// Relógios
function updateClock(id, tz) {
  const el = document.getElementById(id);
  const now = new Date();
  const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: tz };
  el.textContent = now.toLocaleTimeString('pt-BR', options);
}
const clocks = [
  { id: "clock-brasil", tz: "America/Sao_Paulo" },
  { id: "clock-ny", tz: "America/New_York" },
  { id: "clock-londres", tz: "Europe/London" },
  { id: "clock-toquio", tz: "Asia/Tokyo" },
  { id: "clock-sidney", tz: "Australia/Sydney" }
];
function tickAll() {
  clocks.forEach(clock => updateClock(clock.id, clock.tz));
}
setInterval(tickAll, 1000);
tickAll();

// Calendário
const calendarEl = document.getElementById('calendar');
const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
let dataAtual = new Date();

function renderCalendar(date) {
  calendarEl.innerHTML = '';
  const ano = date.getFullYear();
  const mes = date.getMonth();

  // Header
  const header = document.createElement('div');
  header.className = 'calendar-header';
  header.innerHTML = `
    <button id="prevCal">&lt;</button>
    <span>${date.toLocaleString('pt-BR', { month: 'long' })} ${ano}</span>
    <button id="nextCal">&gt;</button>
  `;
  calendarEl.appendChild(header);

  // Dias da semana
  const grid = document.createElement('div');
  grid.className = 'calendar-grid';
  diasSemana.forEach(dia => {
    const day = document.createElement('div');
    day.className = 'calendar-day header';
    day.textContent = dia;
    grid.appendChild(day);
  });

  // Dias do mês
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const numDias = new Date(ano, mes + 1, 0).getDate();

  for (let i = 0; i < primeiroDia; i++) {
    const empty = document.createElement('div');
    empty.className = 'calendar-day';
    grid.appendChild(empty);
  }

  for (let d = 1; d <= numDias; d++) {
    const day = document.createElement('div');
    day.className = 'calendar-day';
    day.textContent = d;
    const hoje = new Date();
    if (
      d === hoje.getDate() &&
      mes === hoje.getMonth() &&
      ano === hoje.getFullYear()
    ) {
      day.classList.add('today');
    }
    grid.appendChild(day);
  }

  calendarEl.appendChild(grid);

  document.getElementById('prevCal').onclick = () => {
    dataAtual = new Date(ano, mes - 1, 1);
    renderCalendar(dataAtual);
  };
  document.getElementById('nextCal').onclick = () => {
    dataAtual = new Date(ano, mes + 1, 1);
    renderCalendar(dataAtual);
  };
}
renderCalendar(dataAtual);

// Lista de tarefas por categoria
const categoriaForm = document.getElementById('categoriaForm');
const categoriasDiv = document.getElementById('categorias');
let categorias = [];

function renderCategorias() {
  categoriasDiv.innerHTML = '';
  categorias.forEach((cat, idxCat) => {
    // Categoria block
    const catBlock = document.createElement('div');
    catBlock.className = 'categoria-block';

    // Categoria header
    const catHeader = document.createElement('div');
    catHeader.className = 'categoria-header';
    catHeader.innerHTML = `
      <span class="categoria-nome">${cat.nome}</span>
      <button class="categoria-remove-btn" title="Remover Categoria">&#10006;</button>
    `;
    catHeader.querySelector('.categoria-remove-btn').onclick = () => {
      categorias.splice(idxCat, 1);
      renderCategorias();
    };
    catBlock.appendChild(catHeader);

    // Form adicionar tarefa
    const tarefaForm = document.createElement('form');
    tarefaForm.className = 'tarefa-form';
    tarefaForm.innerHTML = `
      <input type="text" placeholder="Nova tarefa..." required>
      <button type="submit">Adicionar</button>
    `;
    tarefaForm.onsubmit = function(e) {
      e.preventDefault();
      const texto = tarefaForm.querySelector('input').value.trim();
      if (texto) {
        cat.tarefas.push({ texto, done: false });
        renderCategorias();
      }
      tarefaForm.reset();
    };
    catBlock.appendChild(tarefaForm);

    // Lista de tarefas
    const ul = document.createElement('ul');
    ul.className = 'tarefa-lista';
    cat.tarefas.forEach((tarefa, idxTarefa) => {
      const li = document.createElement('li');
      li.className = tarefa.done ? 'done' : '';
      li.innerHTML = `
        <button class="tarefa-toggle-btn" title="Concluir/Desfazer">&#10003;</button>
        <span>${tarefa.texto}</span>
        <button class="tarefa-remove-btn" title="Remover Tarefa">&#10006;</button>
      `;
      li.querySelector('.tarefa-toggle-btn').onclick = () => {
        cat.tarefas[idxTarefa].done = !cat.tarefas[idxTarefa].done;
        renderCategorias();
      };
      li.querySelector('.tarefa-remove-btn').onclick = () => {
        cat.tarefas.splice(idxTarefa, 1);
        renderCategorias();
      };
      ul.appendChild(li);
    });
    catBlock.appendChild(ul);

    categoriasDiv.appendChild(catBlock);
  });
}

categoriaForm.onsubmit = function(e) {
  e.preventDefault();
  const nome = document.getElementById('novaCategoria').value.trim();
  if (nome && !categorias.some(c => c.nome.toLowerCase() === nome.toLowerCase())) {
    categorias.push({ nome, tarefas: [] });
    renderCategorias();
    categoriaForm.reset();
  }
};
renderCategorias();