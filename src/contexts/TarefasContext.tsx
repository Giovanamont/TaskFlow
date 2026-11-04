import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  alterarTarefa,
  criarTarefa,
  excluirTarefa,
  listarTarefas,
} from "../services/tarefaService";
import type { NovaTarefa, Tarefa } from "../types/Tarefa";

type TarefasContextType = {
  tarefas: Tarefa[];
  carregando: boolean;
  erro: string;
  adicionarTarefa: (novaTarefa: NovaTarefa) => Promise<void>;
  atualizarTarefa: (id: string, dados: NovaTarefa) => Promise<void>;
  alternarConclusao: (tarefa: Tarefa) => Promise<void>;
  removerTarefa: (id: string) => Promise<void>;
};

// null: permite ao hook detectar uso fora do Provider
const TarefasContext = createContext<TarefasContextType | null>(null);

type TarefasProviderProps = {
  children: ReactNode;
};

export function TarefasProvider({
  children,
}: Readonly<TarefasProviderProps>) {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarTarefas() {
      try {
        setCarregando(true);
        setErro("");
        const dados = await listarTarefas();
        setTarefas(dados);
      } catch {
        setErro("Não foi possível carregar as tarefas.");
      } finally {
        setCarregando(false);
      }
    }

    carregarTarefas();
  }, []);

  // POST: o CrudCrud devolve a tarefa já com _id; não precisa de novo GET.
  // Lança o erro para o TaskModal não fechar se a criação falhar.
  async function adicionarTarefa(novaTarefa: NovaTarefa) {
    try {
      setErro("");
      const tarefaCriada = await criarTarefa(novaTarefa);

      setTarefas((tarefasAtuais) => [tarefaCriada, ...tarefasAtuais]);
    } catch {
      setErro("Não foi possível criar a tarefa.");
      throw new Error("Não foi possível criar a tarefa.");
    }
  }

  // PUT: lança o erro para quem chamou (ex.: TaskModal) saber que falhou
  async function atualizarTarefa(id: string, dados: NovaTarefa) {
    try {
      setErro("");
      const tarefaAlterada = await alterarTarefa(id, dados);

      setTarefas((tarefasAtuais) =>
        tarefasAtuais.map((tarefaAtual) =>
          tarefaAtual._id === id ? tarefaAlterada : tarefaAtual,
        ),
      );
    } catch {
      setErro("Não foi possível atualizar a tarefa.");
      throw new Error("Não foi possível atualizar a tarefa.");
    }
  }

  // Intenção da interface: concluir / reabrir. Usa a mesma operação de PUT.
  async function alternarConclusao(tarefa: Tarefa) {
    if (!tarefa._id) {
      return;
    }

    const { _id, ...dados } = tarefa;

    try {
      await atualizarTarefa(_id, {
        ...dados,
        concluida: !tarefa.concluida,
      });
    } catch {
      // o erro já foi registrado em `erro` por atualizarTarefa
    }
  }

  // DELETE: primeiro o backend remove; depois o estado do React é atualizado.
  async function removerTarefa(id: string) {
    try {
      setErro("");
      await excluirTarefa(id);

      setTarefas((tarefasAtuais) =>
        tarefasAtuais.filter((tarefa) => tarefa._id !== id),
      );
    } catch {
      setErro("Não foi possível excluir a tarefa.");
    }
  }

  return (
    <TarefasContext.Provider
      value={{
        tarefas,
        carregando,
        erro,
        adicionarTarefa,
        atualizarTarefa,
        alternarConclusao,
        removerTarefa,
      }}
    >
      {children}
    </TarefasContext.Provider>
  );
}

export function useTarefas() {
  const contexto = useContext(TarefasContext);

  if (!contexto) {
    throw new Error(
      "useTarefas deve ser utilizado dentro de TarefasProvider.",
    );
  }

  return contexto;
}
