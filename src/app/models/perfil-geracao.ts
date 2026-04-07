import { ConfiguracaoGerador } from './configuracao-gerador';

export interface PerfilGeracao {
  nome: string;
  quantidadeJogos: number;
  configuracao: ConfiguracaoGerador;
}
