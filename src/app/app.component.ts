import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LotofacilService } from './services/lotofacil.service';
import { Concurso } from './models/concurso';
import { FrequenciaNumero } from './models/frequencia-numero';
import { AnaliseParidadeConcurso } from './models/analise-paridade-concurso';
import { ResumoParidade } from './models/resumo-paridade';
import { AnaliseFaixaConcurso } from './models/analise-faixa-concurso';
import { ResumoFaixa } from './models/resumo-faixa';
import { AnaliseRepeticaoConcurso } from './models/analise-repeticao-concurso';
import { ResumoRepeticao } from './models/resumo-repeticao';
import { ConfiguracaoGerador } from './models/configuracao-gerador';
import { JogoGerado } from './models/jogo-gerado';
import { ConfiguracaoGeracaoMultipla } from './models/configuracao-geracao-multipla';
import { FormsModule } from '@angular/forms';
import { LinhaMatrizRepeticao } from './models/linha-matriz-repeticao';
import { PerfilGeracao } from './models/perfil-geracao';
import { ResultadoGeracaoMultipla } from './models/resultado-geracao-multipla';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Analisador Lotofácil';
  historico: Concurso[] = [];
  frequencias: FrequenciaNumero[] = [];
  resumoParidade: ResumoParidade[] = [];
  analiseParidade: AnaliseParidadeConcurso[] = [];
  resumoFaixa: ResumoFaixa[] = [];
  analiseFaixa: AnaliseFaixaConcurso[] = [];
  analiseRepeticao: AnaliseRepeticaoConcurso[] = [];
  resumoRepeticao: ResumoRepeticao[] = [];
  numerosMaisFrequentes: FrequenciaNumero[] = [];
  numerosMenosFrequentes: FrequenciaNumero[] = [];

  configuracaoGerador: ConfiguracaoGerador = {
    quantidadeNumeros: 15,
    quantidadePares: 7,
    quantidadeImpares: 8,
    quantidadeBaixos: 8,
    quantidadeAltos: 7,
  };
  jogoGerado: JogoGerado | null = null;

  perfisGeracao: PerfilGeracao[] = [];

  configuracaoGeracaoMultipla: ConfiguracaoGeracaoMultipla = {
    quantidadeJogos: 5,
    maximoNumeroRepetidosEntreJogos: 9,
  };
  jogosGerados: JogoGerado[] = [];
  resultadoGeracaoMultipla: ResultadoGeracaoMultipla | null = null;

  matrizRepeticaoEntreJogos: LinhaMatrizRepeticao[] = [];

  aplicarConfigucoes(): void {
    const somaParidade =
      this.configuracaoGerador.quantidadePares +
      this.configuracaoGerador.quantidadeImpares;
    const somaFaixas =
      this.configuracaoGerador.quantidadeBaixos +
      this.configuracaoGerador.quantidadeAltos;

    const quantidadeNumeros = this.configuracaoGerador.quantidadeNumeros;

    if (somaParidade !== quantidadeNumeros) {
      alert(
        'A soma de pares e ímpares deve ser igual à quantidade total de números.',
      );
      return;
    }
    if (somaFaixas !== quantidadeNumeros) {
      alert(
        'A soma de baixos e altos deve ser igual à quantidade total de números.',
      );
      return;
    }
    this.gerarNovosJogos();
  }

  constructor(private lotofacilService: LotofacilService) {
    this.perfisGeracao = this.lotofacilService.getPerfisAutomaticos(
      this.configuracaoGeracaoMultipla.quantidadeJogos,
    );
    this.historico = this.lotofacilService.getHistorico();
    this.frequencias = this.lotofacilService.getFrequenciaNumeros();
    this.numerosMaisFrequentes =
      this.lotofacilService.getNumerosMaisFrequentes(5);
    this.numerosMenosFrequentes =
      this.lotofacilService.getNumerosMenosFrequentes(5);
    this.analiseParidade = this.lotofacilService.getAnaliseParidade();
    this.resumoParidade = this.lotofacilService.getResumoParidade();
    this.analiseFaixa = this.lotofacilService.getAnaliseFaixaPorConcurso();
    this.resumoFaixa = this.lotofacilService.getResumoFaixa();
    this.analiseRepeticao =
      this.lotofacilService.getAnaliseRepeticaoPorConcurso();
    this.resumoRepeticao = this.lotofacilService.getResumoRepeticao();
    this.resultadoGeracaoMultipla = this.lotofacilService.gerarMultiplosJogos(
      this.configuracaoGerador,
      this.configuracaoGeracaoMultipla,
    );
    this.jogosGerados = this.resultadoGeracaoMultipla.jogos;
    this.matrizRepeticaoEntreJogos =
      this.lotofacilService.getMatrizRepeticaoEntreJogos(this.jogosGerados);

    console.log(
      'Matriz de Repetição Entre Jogos:',
      this.matrizRepeticaoEntreJogos,
    );
    console.log('Jogos Gerados:', this.jogosGerados);
  }

  gerarNovosJogos(): void {
    this.perfisGeracao = this.lotofacilService.getPerfisAutomaticos(
      this.configuracaoGeracaoMultipla.quantidadeJogos,
    );
    this.resultadoGeracaoMultipla = this.lotofacilService.gerarMultiplosJogos(
      this.configuracaoGerador,
      this.configuracaoGeracaoMultipla,
    );
    this.jogosGerados = this.resultadoGeracaoMultipla.jogos;
    this.matrizRepeticaoEntreJogos =
      this.lotofacilService.getMatrizRepeticaoEntreJogos(this.jogosGerados);
  }

  getClasseCelulaMatriz(
    valor: number,
    linhaIndex: number,
    colunaIndex: number,
  ): string {
    if (linhaIndex === colunaIndex) {
      return 'celula-diagonal';
    }

    if (valor <= 6) {
      return 'celula-baixa-repeticao';
    }

    if (valor <= 9) {
      return 'celula-media-repeticao';
    }
    return 'celula-alta-repeticao';
  }

  getTextoCelulaMatriz(
    valor: number,
    linhaIndex: number,
    colunaIndex: number,
  ): string | number {
    if (linhaIndex === colunaIndex) {
      return '-';
    }
    return valor;
  }
}
