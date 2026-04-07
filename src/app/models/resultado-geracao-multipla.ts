import { JogoGerado } from './jogo-gerado';

export interface ResultadoGeracaoMultipla {
  jogos: JogoGerado[];
  quantidadeSolicitada: number;
  quantidadeGerada: number;
  tentativasRealizadas: number;
  maximoTentativas: number;
  sucessoCompleto: boolean;
}
