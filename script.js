let tarefas = [
  { id: 1, titulo: "Preparar a reunião de segunda", prioridade: "alta", concluida: false },
  { id: 2, titulo: "Responder aos emails", prioridade: "media", concluida: false },
  { id: 3, titulo: "Regar as plantas", prioridade: "baixa", concluida: true }
];
let proximoId = 4;
let filtroAtual = "todas";

const lista = document.getElementById("lista");
const contador = document.getElementById("contador");
const formulario = document.getElementById("formulario");
const campoTitulo = document.getElementById("titulo");
const campoPrioridade = document.getElementById("prioridade");
const filtros = document.getElementById("filtros");
const escapar = texto => texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function desenhar() {
  
  const visiveis = tarefas.filter(t =>
    filtroAtual === "todas" || (filtroAtual === "concluidas") === t.concluida
  );

  const nomes = { alta: "Alta", media: "Média", baixa: "Baixa" };

  // Criar um cartão por tarefa (ou a mensagem de lista vazia)
  lista.innerHTML = visiveis.length === 0
    ? '<li class="vazio">Sem tarefas aqui.</li>'
    : visiveis.map(t => `
        <li class="cartao ${t.concluida ? "concluida" : ""}" data-id="${t.id}">
          <div class="corpo">
            <div class="titulo">${escapar(t.titulo)}</div>
            <span class="etiqueta ${t.prioridade}">${nomes[t.prioridade]}</span>
          </div>
          <div class="acoes">
            <button data-acao="alternar">${t.concluida ? "Reabrir" : "Concluir"}</button>
            <button data-acao="Remover" class="Remover">Remover</button>
          </div>
        </li>`).join("");

  // Contador
  const pendentes = tarefas.filter(t => !t.concluida).length;
  contador.textContent = `${pendentes} pendente(s) de ${tarefas.length}`;

  // Destacar o filtro ativo
  filtros.querySelectorAll("button").forEach(b =>
    b.classList.toggle("ativo", b.dataset.filtro === filtroAtual)
  );
}

desenhar(); 
// CONCLUIR / REABRIR / ELIMINAR
lista.addEventListener("click", evento => {
  const botao = evento.target.closest("button[data-acao]");
  if (!botao) return;

  const id = Number(botao.closest(".cartao").dataset.id);

  if (botao.dataset.acao === "alternar") {
    const tarefa = tarefas.find(t => t.id === id);
    tarefa.concluida = !tarefa.concluida;
  } else {
    tarefas = tarefas.filter(t => t.id !== id);
  }
  desenhar();
});

//  TAREFAS
formulario.addEventListener("submit", evento => {
  evento.preventDefault();
  const texto = campoTitulo.value.trim();
  if (texto === "") return;

  tarefas.unshift({ id: proximoId++, titulo: texto, prioridade: campoPrioridade.value, concluida: false });
  campoTitulo.value = "";
  desenhar();
});

// FILTROS
filtros.addEventListener("click", evento => {
  if (!evento.target.dataset.filtro) return;
  filtroAtual = evento.target.dataset.filtro;
  desenhar();
});