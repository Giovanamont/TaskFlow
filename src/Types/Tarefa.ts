export interface Tarefa {
  _id: string;
  titulo: string;
  descricao?: string;
  data: string;
  prioridade: "baixa" | "media" | "alta";
  projeto: string;
  concluida: boolean;
}
  