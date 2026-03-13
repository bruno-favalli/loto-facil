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

@Injectable({
  providedIn: 'root',
})
export class LotofacilService {
  constructor() {}

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
}
