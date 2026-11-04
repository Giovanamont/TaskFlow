import { api, RECURSO } from "./API";
import type { Tarefa } from "../types/Tarefa";

// 📌 Função para listar as tarefas (GET)
export async function listarTarefas(): Promise<Tarefa[]> {
  const resposta = await api.get<Tarefa[]>(RECURSO);
  return resposta.data;
}


export async function alterarTarefa(
  id: string,
  tarefa: Omit<Tarefa, "_id">
): Promise<Tarefa> {
  await api.put(`${RECURSO}/${id}`, tarefa);
  return {
    ...tarefa,
    _id: id,
  };
}
