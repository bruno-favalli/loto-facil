import { Injectable } from '@angular/core';
import { Concurso } from '../models/concurso';
import { historicoLotofacil } from '../data/historico-lotofacil';
import { FrequenciaNumero } from '../models/frequencia-numero';
import { AnaliseParidadeConcurso } from '../models/analise-paridade-concurso';
import { ResumoParidade } from '../models/resumo-paridade';
import { AnaliseFaixaConcurso } from '../models/analise-faixa-concurso';
import { ResumoFaixa } from '../models/resumo-faixa';
import { AnaliseRepeticaoConcurso } from '../models/analise-repeticao-concurso';
import { ResumoRepeticao } from '../models/resumo-repeticao';
import { ConfiguracaoGerador } from '../models/configuracao-gerador';
import { JogoGerado } from '../models/jogo-gerado';
import { ConfiguracaoGeracaoMultipla } from '../models/configuracao-geracao-multipla';
import { LinhaMatrizRepeticao } from '../models/linha-matriz-repeticao';
import { PerfilGeracao } from '../models/perfil-geracao';
import { ResultadoGeracaoMultipla } from '../models/resultado-geracao-multipla';

@Injectable({
  providedIn: 'root',
})
export class LotofacilService {
  constructor() {}

  private distribuirQuantidadeEntrePerfis(totalJogos: number): number[] {
    if (totalJogos <= 0) {
      return [0, 0, 0];
    }
    const quantidadePerfil1 = Math.max(1, Math.floor(totalJogos * 0.4));
    const quantidadePerfil2 = Math.max(1, Math.floor(totalJogos * 0.3));
    let quantidadePerfil3 = Math.max(
      1,
      totalJogos - quantidadePerfil1 - quantidadePerfil2,
    );

    if (quantidadePerfil3 < 0) {
      quantidadePerfil3 = 0;
    }

    const soma = quantidadePerfil1 + quantidadePerfil2 + quantidadePerfil3;

    if (soma < totalJogos) {
      quantidadePerfil3 += totalJogos - soma;
    }
    return [quantidadePerfil1, quantidadePerfil2, quantidadePerfil3];
  }

  getPerfisAutomaticos(totalJogos: number): PerfilGeracao[] {
    const resumoParidade = this.getResumoParidade();
    const resumoFaixa = this.getResumoFaixa();
    const distribuicao = this.distribuirQuantidadeEntrePerfis(totalJogos);

    const perfilPrincipalParidade = resumoParidade[0];
    const perfilSecundarioParidade = resumoParidade[1] ?? resumoParidade[0];
    const perfilAlternativoParidade = resumoParidade[2] ?? resumoParidade[0];

    const perfilPrincipalFaixa = resumoFaixa[0];
    const perfilSecundarioFaixa = resumoFaixa[1] ?? resumoFaixa[0];
    const perfilAlternativoFaixa = resumoFaixa[2] ?? resumoFaixa[0];

    const perfis: PerfilGeracao[] = [
      {
        nome: 'Perfil Principal',
        quantidadeJogos: distribuicao[0],
        configuracao: {
          quantidadeNumeros: 15,
          quantidadePares: perfilPrincipalParidade.pares,
          quantidadeImpares: perfilPrincipalParidade.impares,
          quantidadeBaixos: perfilPrincipalFaixa.baixos,
          quantidadeAltos: perfilPrincipalFaixa.altos,
        },
      },
      {
        nome: 'Perfil Secundário',
        quantidadeJogos: distribuicao[1],
        configuracao: {
          quantidadeNumeros: 15,
          quantidadePares: perfilSecundarioParidade.pares,
          quantidadeImpares: perfilSecundarioParidade.impares,
          quantidadeBaixos: perfilSecundarioFaixa.baixos,
          quantidadeAltos: perfilSecundarioFaixa.altos,
        },
      },

      {
        nome: 'Perfil Alternativo',
        quantidadeJogos: distribuicao[2],
        configuracao: {
          quantidadeNumeros: 15,
          quantidadePares: perfilAlternativoParidade.pares,
          quantidadeImpares: perfilAlternativoParidade.impares,
          quantidadeBaixos: perfilAlternativoFaixa.baixos,
          quantidadeAltos: perfilAlternativoFaixa.altos,
        },
      },
    ];
    return perfis.filter((perfil) => perfil.quantidadeJogos > 0);
  }

  getPerfisGeracaoExemplo(): PerfilGeracao[] {
    return [
      {
        nome: 'Perfil Principal',
        quantidadeJogos: 4,
        configuracao: {
          quantidadeNumeros: 15,
          quantidadePares: 7,
          quantidadeImpares: 8,
          quantidadeBaixos: 8,
          quantidadeAltos: 7,
        },
      },
      {
        nome: 'Perfil mais par',
        quantidadeJogos: 3,
        configuracao: {
          quantidadeNumeros: 15,
          quantidadePares: 8,
          quantidadeImpares: 7,
          quantidadeBaixos: 8,
          quantidadeAltos: 7,
        },
      },
      {
        nome: 'Perfil Alternativo',
        quantidadeJogos: 3,
        configuracao: {
          quantidadeNumeros: 15,
          quantidadePares: 6,
          quantidadeImpares: 9,
          quantidadeBaixos: 7,
          quantidadeAltos: 8,
        },
      },
    ];
  }

  getHistorico(): Concurso[] {
    return historicoLotofacil;
  }

  getFrequenciaNumeros(): FrequenciaNumero[] {
    const historico = this.getHistorico();
    const mapaFrequencia: { [key: number]: number } = {};

    for (let numero = 1; numero <= 25; numero++) {
      mapaFrequencia[numero] = 0;
    }

    for (const concurso of historico) {
      for (const bola of concurso.bolas) {
        mapaFrequencia[bola]++;
      }
    }

    const frequencias: FrequenciaNumero[] = [];

    for (let numero = 1; numero <= 25; numero++) {
      frequencias.push({ numero: numero, frequencia: mapaFrequencia[numero] });
    }

    frequencias.sort((a, b) => b.frequencia - a.frequencia);

    return frequencias;
  }

  getNumerosMaisFrequentes(quantidade: number): FrequenciaNumero[] {
    const frequencias = this.getFrequenciaNumeros();
    return frequencias.slice(0, quantidade);
  }

  getNumerosMenosFrequentes(quantidade: number): FrequenciaNumero[] {
    const frequencias = [...this.getFrequenciaNumeros()];
    frequencias.sort((a, b) => a.frequencia - b.frequencia);
    return frequencias.slice(0, quantidade);
  }

  getAnaliseParidade(): AnaliseParidadeConcurso[] {
    const historico = this.getHistorico();

    return historico.map((concurso) => {
      const pares = concurso.bolas.filter((bola) => bola % 2 === 0).length;
      const impares = concurso.bolas.filter((bola) => bola % 2 !== 0).length;

      return {
        concurso: concurso.concurso,
        data: concurso.data,
        pares,
        impares,
      };
    });
  }

  getResumoParidade(): ResumoParidade[] {
    const analises = this.getAnaliseParidade();
    const mapaResumo: { [chave: string]: number } = {};

    for (const analise of analises) {
      const chave = `${analise.pares} - ${analise.impares}`;

      if (!mapaResumo[chave]) {
        mapaResumo[chave] = 0;
      }
      mapaResumo[chave]++;
    }

    const resumo: ResumoParidade[] = [];

    for (const chave in mapaResumo) {
      console.log('chave', chave);
      const [pares, impares] = chave.split(' - ');

      console.log('pares', pares);
      console.log('impares', impares);

      resumo.push({
        pares: Number(pares),
        impares: Number(impares),
        quantidadeConcursos: mapaResumo[chave],
      });
    }

    resumo.sort((a, b) => b.quantidadeConcursos - a.quantidadeConcursos);

    console.log(resumo);
    return resumo;
  }

  getAnaliseFaixaPorConcurso(): AnaliseFaixaConcurso[] {
    const historico = this.getHistorico();
    return historico.map((concurso) => {
      const baixos = concurso.bolas.filter((bola) => bola <= 13).length;
      const altos = concurso.bolas.filter(
        (bola) => bola <= 25 && bola > 13,
      ).length;

      return {
        concurso: concurso.concurso,
        data: concurso.data,
        baixos,
        altos,
      };
    });
  }

  getResumoFaixa(): ResumoFaixa[] {
    const analises = this.getAnaliseFaixaPorConcurso();
    const mapaResumo: { [chave: string]: number } = {};

    for (const analise of analises) {
      const chave = `${analise.baixos} - ${analise.altos}`;

      if (!mapaResumo[chave]) {
        mapaResumo[chave] = 0;
      }
      mapaResumo[chave]++;
    }

    const resumo: ResumoFaixa[] = [];

    for (const chave in mapaResumo) {
      const partes = chave.split(' - ');

      if (partes.length !== 2) {
        continue;
      }

      const baixos = Number(partes[0]);
      const altos = Number(partes[1]);

      if (isNaN(baixos) || isNaN(altos)) {
        continue;
      }

      resumo.push({
        baixos,
        altos,
        quantidadeConcursos: mapaResumo[chave],
      });
    }

    resumo.sort((a, b) => b.quantidadeConcursos - a.quantidadeConcursos);
    return resumo;
  }

  getAnaliseRepeticaoPorConcurso(): AnaliseRepeticaoConcurso[] {
    const historico = this.getHistorico();
    const analises: AnaliseRepeticaoConcurso[] = [];

    for (let i = 0; i < historico.length - 1; i++) {
      const atual = historico[i];
      const anterior = historico[i + 1];

      const numerosRepetidos = atual.bolas
        .filter((bola) => anterior.bolas.includes(bola))
        .sort((a, b) => a - b);

      analises.push({
        concursoAtual: atual.concurso,
        dataAtual: atual.data,
        concursoAnterior: anterior.concurso,
        dataAnterior: anterior.data,
        quantidadeRepetidos: numerosRepetidos.length,
        numerosRepetidos,
      });
    }
    console.log(analises);
    return analises;
  }

  getResumoRepeticao(): ResumoRepeticao[] {
    const analises = this.getAnaliseRepeticaoPorConcurso();
    const mapaResumo: { [quantidade: number]: number } = {};

    for (const analise of analises) {
      const quantidade = analise.quantidadeRepetidos;

      if (!mapaResumo[quantidade]) {
        mapaResumo[quantidade] = 0;
      }
      mapaResumo[quantidade]++;
    }

    const resumo: ResumoRepeticao[] = [];

    for (const quantidade in mapaResumo) {
      resumo.push({
        quantidadeRepetidos: Number(quantidade),
        quantidadeConcursos: mapaResumo[Number(quantidade)],
      });
    }

    resumo.sort((a, b) => b.quantidadeConcursos - a.quantidadeConcursos);
    return resumo;
  }

  private isPar(numero: number): boolean {
    return numero % 2 === 0;
  }

  private isImpar(numero: number): boolean {
    return numero % 2 !== 0;
  }

  private isBaixo(numero: number): boolean {
    return numero <= 13;
  }

  private isAlto(numero: number): boolean {
    return numero > 13 && numero <= 25;
  }

  private criarResumoJogo(numeros: number[]): JogoGerado {
    const totalPares = numeros.filter((numero) => this.isPar(numero)).length;
    const totalImpares = numeros.filter((numero) =>
      this.isImpar(numero),
    ).length;
    const totalBaixos = numeros.filter((numero) => this.isBaixo(numero)).length;
    const totalAltos = numeros.filter((numero) => this.isAlto(numero)).length;

    return {
      numeros: [...numeros].sort((a, b) => a - b),
      totalPares,
      totalImpares,
      totalBaixos,
      totalAltos,
    };
  }

  gerarJodoOtimizandoPorFrequencia(config: ConfiguracaoGerador): JogoGerado {
    const frequencias = this.getFrequenciaNumeros();
    const jogo: number[] = [];

    let paresSelecionados = 0;
    let imparesSelecionados = 0;
    let baixosSelecionados = 0;
    let altosSelecionados = 0;

    for (const item of frequencias) {
      const numero = item.numero;

      if (jogo.includes(numero)) {
        continue;
      }
      const numeroEhPar = this.isPar(numero);
      const numeroEhImpar = this.isImpar(numero);
      const numeroEhBaixo = this.isBaixo(numero);
      const numeroEhAlto = this.isAlto(numero);

      if (numeroEhPar && paresSelecionados >= config.quantidadePares) {
        continue;
      }
      if (numeroEhImpar && imparesSelecionados >= config.quantidadeImpares) {
        continue;
      }
      if (numeroEhBaixo && baixosSelecionados >= config.quantidadeBaixos) {
        continue;
      }
      if (numeroEhAlto && altosSelecionados >= config.quantidadeAltos) {
        continue;
      }
      jogo.push(numero);

      if (numeroEhPar) {
        paresSelecionados++;
      }
      if (numeroEhImpar) {
        imparesSelecionados++;
      }
      if (numeroEhBaixo) {
        baixosSelecionados++;
      }
      if (numeroEhAlto) {
        altosSelecionados++;
      }

      if (jogo.length === config.quantidadeNumeros) {
        break;
      }
    }
    return this.criarResumoJogo(jogo);
  }

  private embaralharArray(numeros: number[]): number[] {
    const copia = [...numeros];

    for (let i = copia.length - 1; i > 0; i--) {
      const indiceAleatorio = Math.floor(Math.random() * (i + 1));
      const temp = copia[i];
      copia[i] = copia[indiceAleatorio];
      copia[indiceAleatorio] = temp;
    }

    return copia;
  }

  private escolherNumeroAleatorio(numeros: number[]): number | null {
    if (numeros.length === 0) {
      return null;
    }
    const indiceAleatorio = Math.floor(Math.random() * numeros.length);
    return numeros[indiceAleatorio];
  }

  private podeAdicionarNumero(
    numero: number,
    jogoAtual: number[],
    config: ConfiguracaoGerador,
  ): boolean {
    if (jogoAtual.includes(numero)) {
      return false;
    }
    const totalPares = jogoAtual.filter((item) => this.isPar(item)).length;
    const totalImpares = jogoAtual.filter((item) => this.isImpar(item)).length;
    const totalBaixos = jogoAtual.filter((item) => this.isBaixo(item)).length;
    const totalAltos = jogoAtual.filter((item) => this.isAlto(item)).length;

    if (this.isPar(numero) && totalPares >= config.quantidadePares) {
      return false;
    }

    if (this.isImpar(numero) && totalImpares >= config.quantidadeImpares) {
      return false;
    }

    if (this.isBaixo(numero) && totalBaixos >= config.quantidadeBaixos) {
      return false;
    }

    if (this.isAlto(numero) && totalAltos >= config.quantidadeAltos) {
      return false;
    }
    return true;
  }

  gerarJogoComAleatoriedadeControlada(config: ConfiguracaoGerador): JogoGerado {
    const frequencias = this.getFrequenciaNumeros();
    const numerosOrdenados = frequencias.map((item) => item.numero);

    const grupoForte = numerosOrdenados.slice(0, 10);
    const grupoMedio = numerosOrdenados.slice(10, 18);
    const grupoApoio = numerosOrdenados.slice(18, 25);

    const jogo: number[] = [];

    while (jogo.length < config.quantidadeNumeros) {
      let grupoAtual: number[] = [];

      if (jogo.length < 6) {
        grupoAtual = this.embaralharArray(grupoForte);
      } else if (jogo.length < 11) {
        grupoAtual = this.embaralharArray([...grupoForte, ...grupoMedio]);
      } else {
        grupoAtual = this.embaralharArray([
          ...grupoForte,
          ...grupoMedio,
          ...grupoApoio,
        ]);
      }

      const candidatosValidos = grupoAtual.filter((numero) =>
        this.podeAdicionarNumero(numero, jogo, config),
      );
      const numeroEscolhido = this.escolherNumeroAleatorio(candidatosValidos);

      if (numeroEscolhido === null) {
        break;
      }
      jogo.push(numeroEscolhido);
    }
    return this.criarResumoJogo(jogo);
  }

  private contarNumerosEmComum(jogoA: number[], jogoB: number[]): number {
    return jogoA.filter((numero) => jogoB.includes(numero)).length;
  }

  private respeitaLimiteDeRepeticao(
    jogoNovo: number[],
    jogosExistentes: JogoGerado[],
    maximoNumerosRepetidosEntreJogos: number,
  ): boolean {
    for (const jogoExistente of jogosExistentes) {
      const quantidadeEmComum = this.contarNumerosEmComum(
        jogoNovo,
        jogoExistente.numeros,
      );
      if (quantidadeEmComum > maximoNumerosRepetidosEntreJogos) {
        return false;
      }
    }
    return true;
  }

  gerarMultiplosJogos(
    configGerador: ConfiguracaoGerador,
    configMultipla: ConfiguracaoGeracaoMultipla,
  ): ResultadoGeracaoMultipla {
    const jogosGerados: JogoGerado[] = [];
    let tentativas = 0;
    const maximoTentativas = 100;

    while (
      jogosGerados.length < configMultipla.quantidadeJogos &&
      tentativas < maximoTentativas
    ) {
      const novoJogo = this.gerarJogoComAleatoriedadeControlada(configGerador);

      const jogoCompleto =
        novoJogo.numeros.length === configGerador.quantidadeNumeros;

      const respeitaRepeticao = this.respeitaLimiteDeRepeticao(
        novoJogo.numeros,
        jogosGerados,
        configMultipla.maximoNumeroRepetidosEntreJogos,
      );

      if (jogoCompleto && respeitaRepeticao) {
        jogosGerados.push(novoJogo);
      }
      tentativas++;
    }
    return {
      jogos: jogosGerados,
      quantidadeSolicitada: configMultipla.quantidadeJogos,
      quantidadeGerada: jogosGerados.length,
      tentativasRealizadas: tentativas,
      maximoTentativas,
      sucessoCompleto: jogosGerados.length === configMultipla.quantidadeJogos,
    };
  }

  getMatrizRepeticaoEntreJogos(jogos: JogoGerado[]): LinhaMatrizRepeticao[] {
    const matriz: LinhaMatrizRepeticao[] = [];

    for (let i = 0; i < jogos.length; i++) {
      const jogoBase = jogos[i];
      const valores: number[] = [];

      for (let j = 0; j < jogos.length; j++) {
        const jogoComparado = jogos[j];
        const quantidadeEmComum = this.contarNumerosEmComum(
          jogoBase.numeros,
          jogoComparado.numeros,
        );
        valores.push(quantidadeEmComum);
      }
      matriz.push({ nomeJogo: `Jogo ${i + 1}`, valores });
    }
    return matriz;
  }
}
