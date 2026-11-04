import axios from "axios";

export const RECURSO = "tarefas";

export const api = axios.create({
  baseURL: "https://crudcrud.com/api/SEU_IDENTIFICADOR_AQUI",
});