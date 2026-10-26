import React, { createContext, useContext, useState, useEffect } from "react";
import type { Tarefa } from "../Types/Tarefa";
import { listarTarefas, alterarTarefa as alterarTarefaService } from "../services/tarefaServisces";

interface TarefasContextData {
  tarefas: Tarefa[];
  carregando: boolean;
  erro: string | null;
  atualizarTarefa: (id: string, tarefa: Omit<Tarefa, "_id">) => Promise<void>;
  alternarConclusao: (tarefa: Tarefa) => Promise<void>;
}

//
const TarefasContext = createContext<TarefasContextData>({} as TarefasContextData);

// Provider
export const TarefasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    listarTarefas()
      .then(setTarefas)
      .catch(() => setErro("Erro ao carregar tarefas."))
      .finally(() => setCarregando(false));
  }, []);

  const atualizarTarefa = async (id: string, dadosAtualizados: Omit<Tarefa, "_id">) => {
    try {
      const alterada = await alterarTarefaService(id, dadosAtualizados);
      setTarefas((prev) =>
        prev.map((tarefaAtual) =>
          tarefaAtual._id === id ? alterada : tarefaAtual
        )
      );
    } catch (err) {
      setErro("Erro ao atualizar a tarefa.");
    }
  };

  const alternarConclusao = async (tarefa: Tarefa) => {
    const { _id, ...resto } = tarefa;
    const dadosAtualizados = {
      ...resto,
      concluida: !tarefa.concluida,
    };
    await atualizarTarefa(_id, dadosAtualizados);
  };

  return (
    <TarefasContext.Provider
      value={{
        tarefas,
        carregando,
        erro,
        atualizarTarefa,
        alternarConclusao,
      }}
    >
      {children}
    </TarefasContext.Provider>
  );
};

// Hook personalizado
export const useTarefas = () => useContext(TarefasContext);