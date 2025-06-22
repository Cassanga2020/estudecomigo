let perguntas = [];
let categoriaSelecionada = "";
let nivelSelecionado = "";
let indice = 0;
let respostaSelecionada = null;
let pontuacao = 0;


const app = document.getElementById("app");

// Carrega as perguntas do JSON local
fetch("perguntas.json")
  .then(response => response.json())
  .then(data => {
    perguntas = data;
    renderCategorias();
  })
  .catch(error => {
    app.innerHTML = `<p class="text-red-500">Erro ao carregar perguntas: ${error.message}</p>`;
  });

function renderCategorias() {
  const categorias = [...new Set(perguntas.map(q => q.categoria))];
  app.innerHTML = `
    <h1 class="text-3xl font-bold mb-4">Plataforma de Estudos</h1>
    <h2 class="text-xl mb-2">Escolha a Categoria</h2>
    <div class="grid grid-cols-2 gap-2">
      ${categorias.map(cat => `
        <button class="bg-blue-600 text-white p-2 rounded" onclick="selecionarCategoria('${cat}')">${cat}</button>
      `).join("")}
    </div>
  `;
}

function selecionarCategoria(cat) {
  categoriaSelecionada = cat;
  renderNiveis();
}

function renderNiveis() {
  app.innerHTML = `
    <h2 class="text-xl mb-2">Escolha o Nível</h2>
    <div class="flex gap-2">
      ${["Iniciante", "Intermediário", "Avançado"].map(n => `
        <button class="bg-green-600 text-white p-2 rounded" onclick="iniciarQuiz('${n}')">${n}</button>
      `).join("")}
    </div>
  `;
}

function iniciarQuiz(nivel) {
  nivelSelecionado = nivel;
  categoriaSelecionada = categoriaSelecionada;
  indice = 0;
  respostaSelecionada = null;
  renderPergunta();
   pontuacao = 0; 
}

function renderPergunta() {
  const filtradas = perguntas.filter(q =>
    q.categoria === categoriaSelecionada &&
    q.nivel === nivelSelecionado
  );

  const pergunta = filtradas[indice];

  if (!pergunta) {
  app.innerHTML = `
    <h2 class="text-xl font-semibold">Fim das perguntas!</h2>
    <p class="text-lg mb-4">Pontuação: ${pontuacao}</p>
    <button class="mt-4 bg-gray-700 text-white p-2 rounded" onclick="renderCategorias()">Voltar ao Início</button>
  `;
  return;
}

  app.innerHTML = `
    <div class="bg-white p-4 rounded shadow">
      <h3 class="text-lg font-semibold mb-4">${pergunta.pergunta}</h3>
      <div class="space-y-2">
        ${pergunta.opcoes.map((opcao, i) => `
          <button class="w-full text-left border p-2 rounded
            ${respostaSelecionada !== null ? (i === pergunta.resposta_correta ? 'bg-green-300' : i === respostaSelecionada ? 'bg-red-300' : '') : ''}"
            ${respostaSelecionada !== null ? 'disabled' : ''}
            onclick="selecionarResposta(${i})">
            ${opcao}
          </button>
        `).join("")}
      </div>
      ${respostaSelecionada !== null ? `
        <button class="mt-4 bg-blue-600 text-white p-2 rounded" onclick="proximaPergunta()">Próxima Pergunta</button>
      ` : ""}
    </div>
  `;
}

function selecionarResposta(i) {
  respostaSelecionada = i;
  renderPergunta();
}

function proximaPergunta() {
  respostaSelecionada = null;
  indice++;
  renderPergunta();
}
function selecionarResposta(i) {
  const perguntaAtual = perguntas.filter(q =>
    q.categoria === categoriaSelecionada &&
    q.nivel === nivelSelecionado
  )[indice];

  respostaSelecionada = i;
  if (i === perguntaAtual.resposta_correta) {
    pontuacao++;
  }
  renderPergunta();
}
function alternarTema() {
  document.body.classList.toggle("modo-escuro");
}