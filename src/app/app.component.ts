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

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
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

  constructor(private lotofacilService: LotofacilService) {
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
    this.jogoGerado = this.lotofacilService.gerarJodoOtimizandoPorFrequencia(
      this.configuracaoGerador,
    );
  }
}
