/* ===== SELECTS ===== */
const motor = document.getElementById('motor');
const freio = document.getElementById('freio');
const transmissao = document.getElementById('transmissao');
const suspensao = document.getElementById('suspensao');
const blindagem = document.getElementById('blindagem');

/* ===== CHECKBOXES ===== */
const fullTuning = document.getElementById('fullTuning');
const fullTuningBlind = document.getElementById('fullTuningBlind');
const vendasSwitch = document.getElementById('vendasSwitch');

/* ===== FUNÇÃO PARA SETAR NÍVEL MÁXIMO ===== */
function maxSelect(select) {
  select.selectedIndex = select.options.length - 1;
}

/* ===== FULL TUNING ===== */
fullTuning.addEventListener('change', () => {
  if (fullTuning.checked) {
    fullTuningBlind.checked = false;

    maxSelect(motor);
    maxSelect(freio);
    maxSelect(transmissao);
    maxSelect(suspensao);
    blindagem.selectedIndex = 0;
  } else {
    motor.selectedIndex = 0;
    freio.selectedIndex = 0;
    transmissao.selectedIndex = 0;
    suspensao.selectedIndex = 0;
    blindagem.selectedIndex = 0;
  }
  calculateTotal();
});

/* ===== FULL TUNING + BLINDAGEM ===== */
fullTuningBlind.addEventListener('change', () => {
  if (fullTuningBlind.checked) {
    fullTuning.checked = false;

    maxSelect(motor);
    maxSelect(freio);
    maxSelect(transmissao);
    maxSelect(suspensao);
    maxSelect(blindagem);
  } else {
    motor.selectedIndex = 0;
    freio.selectedIndex = 0;
    transmissao.selectedIndex = 0;
    suspensao.selectedIndex = 0;
    blindagem.selectedIndex = 0;
  }
  calculateTotal();
});

function calculateComissao30() {

  let subtotal = 0;

  const reparo = document.querySelector(
    '.counter-row:nth-of-type(1) .qty-input[data-price]'
  );

  const vendasInputs = document.querySelectorAll(
    '.qty-input'
  );

  vendasInputs.forEach(input => {

    const preco = Number(input.dataset.price);

    if (
      preco === 1200 ||
      preco === 960 ||
      preco === 900 ||
      preco === 720 ||
      preco === 768
    ) {

      subtotal +=
        Number(input.value) * preco;

    }

  });

  const comissao = subtotal * 0.30;

  const campo = document.getElementById('comissao30');

  if (campo) {

    campo.textContent =
      comissao.toLocaleString('pt-BR');

  }

}

/* ===== SWITCH VENDAS ( PNEU / REPARO /CHAVE DE RODAS ) ===== */
vendasSwitch.addEventListener("change", () => {
  updateVendasValues();
  calculateTotal();
});

function updateVendasValues() {
  const labels = document.querySelectorAll('.counter-row .counter-label');
  labels.forEach(label => {
    if (label.textContent.trim().startsWith("Reparo") && !label.textContent.includes("Carro")) {
      label.nextElementSibling.querySelector("[data-qty]").dataset.price = vendasSwitch.checked ? 960 : 1200;
    }
    if (label.textContent.trim().startsWith("Pneu")) {
      label.nextElementSibling.querySelector("[data-qty]").dataset.price = vendasSwitch.checked ? 720 : 900;
    }
    if (label.textContent.trim().startsWith("Chave de Roda")) {
      label.nextElementSibling.querySelector("[data-qty]").dataset.price = vendasSwitch.checked ? 768 : 960;
    }
  });
}

/* ===== CÁLCULO TOTAL ===== */
function calculateTotal() {
  let total = 0;

  document.querySelectorAll('input[type="checkbox"]:checked').forEach(el => {
    if (!el.id.includes('fullTuning')) {
      total += Number(el.dataset.price || 0);
    }
  });

  document.querySelectorAll('select').forEach(el => {
    total += Number(el.value);
  });

  document.querySelectorAll('[data-qty]').forEach(el => {

  let quantidade = 0;

  if (el.tagName === 'INPUT') {
    quantidade = Number(el.value);
  } else {
    quantidade = Number(el.textContent);
  }

  total += quantidade * Number(el.dataset.price);

  });

  document.getElementById('total').textContent =
    total.toLocaleString('pt-BR');

  calculateComissao30();
  }

/* ===== CAMPOS NUMÉRICOS EDITÁVEIS ===== */
function updateInputQty(input) {

  let value = Number(input.value);

  if (isNaN(value)) {
    value = 0;
  }

  if (value < 0) {
    value = 0;
  }

  if (value > 500) {
    value = 500;
  }

  input.value = value;

  calculateTotal();
}

/* ===== CONTADORES - CAMPOS EDITÁVEIS ===== */
function changeQty(btn, val) {

  const field = btn.parentElement.querySelector('[data-qty]');

  if (field.tagName === 'INPUT') {

    let current = Number(field.value);

    current += val;

    if (current < 0) {
      current = 0;
    }

    if (current > 500) {
      current = 500;
    }

    field.value = current;

  } else {

    field.textContent = Math.max(
      0,
      Number(field.textContent) + val
    );

  }

  calculateTotal();
}

/* ===== RESET ===== */
function resetCalculator() {
  document.querySelectorAll('input[type="checkbox"]').forEach(el => el.checked = false);
  document.querySelectorAll('select').forEach(el => el.selectedIndex = 0);
  document.querySelectorAll('[data-qty]').forEach(el => {

  if (el.tagName === 'INPUT') {
    el.value = 0;
  } else {
    el.textContent = 0;
  }

  const priceElement =
    el.parentElement.previousElementSibling?.querySelector(".price");

  if (priceElement) {
    el.dataset.price =
      priceElement.textContent.replace(/\D/g,'');
  }

});

const comissao = document.getElementById('comissao30');

if (comissao) {
  comissao.textContent = '0';
}

  document.getElementById('total').textContent = '0';
}

/* ===== TEMA ESCURO / CLARO / CUSTOM ===== */
/*const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (prefersDark) {
  document.body.classList.remove('theme-light');
} else {
  document.body.classList.add('theme-light');
}*/

document.addEventListener('DOMContentLoaded', function () {
  // Agora podemos garantir que o temaToggleBtn existe no DOM
  const themeToggleBtn = document.querySelector('.theme-toggle-btn');
  if (themeToggleBtn) {
    let currentTheme = 0;  // 0 = claro, 1 = escuro, 2 = neon
    const themes = ['theme-dark', 'theme-light', 'theme-neon']; // Array com os temas

    themeToggleBtn.addEventListener('click', () => {
      // Remover o tema atual
      document.body.classList.remove(themes[currentTheme]);

      // Atualizar o índice para o próximo tema
      currentTheme = (currentTheme + 1) % themes.length;

      // Adicionar o próximo tema
      document.body.classList.add(themes[currentTheme]);
    });
  }
});

/* =========================================================
   ACCORDION MOBILE - RESPONSIVO REAL
   ========================================================= */
(function () {

  function initAccordion() {

    if (window.innerWidth > 768) return;

    if (document.querySelector('.accordion-content')) return;

    const headers = document.querySelectorAll(
      'h2.servicos-header, h2.vendas-header'
    );

    headers.forEach(header => {

      const content = document.createElement('div');
      content.classList.add('accordion-content', 'closed');

      let next = header.nextElementSibling;

      while (
        next &&
        !next.matches('h2.servicos-header') &&
        !next.matches('h2.vendas-header')
      ) {
        const current = next;
        next = next.nextElementSibling;
        content.appendChild(current);
      }

      header.parentNode.insertBefore(content, next);

      header.addEventListener('click', () => {
        content.classList.toggle('closed');
      });

    });
  }

  window.addEventListener('load', initAccordion);
  window.addEventListener('resize', initAccordion);

})();

// Função para criar confetes
function createConfetes() {
  const confeteCount = 15; // Número de confetes
  const container = document.body;

  // Remover confetes existentes
  const existingConfetes = document.querySelectorAll('.confetes');
  existingConfetes.forEach(confete => confete.remove());

  // Criar novos confetes
  for (let i = 0; i < confeteCount; i++) {
    const confete = document.createElement('div');
    confete.classList.add('confetes');
    confete.style.left = `${Math.random() * 100}%`; // Posição aleatória
    confete.style.animationDelay = `${Math.random() * 5}s`; // Atraso aleatório
    confete.style.setProperty('--i', i);
    container.appendChild(confete);
  }
}

// Função para garantir que as animações sejam ativadas apenas no tema neon
function enableCarnivalAnimations() {
  if (document.body.classList.contains('theme-neon')) {
    createConfetes();
  } else {
    // Caso não seja o tema neon, removemos os confetes
    const existingConfetes = document.querySelectorAll('.confetes');
    existingConfetes.forEach(confete => confete.remove());
  }
}

// Detectar quando o tema neon está ativado e ativar as animações
enableCarnivalAnimations();

// Alternar entre os temas e ativar as animações
document.addEventListener('DOMContentLoaded', function () {
  const themeToggleBtn = document.querySelector('.theme-toggle-btn');
  if (themeToggleBtn) {
    let currentTheme = 0;  // 0 = claro, 1 = escuro, 2 = neon
    const themes = ['theme-dark', 'theme-light', 'theme-neon']; // Array com os temas

    themeToggleBtn.addEventListener('click', () => {
      // Remover o tema atual
      document.body.classList.remove(themes[currentTheme]);

      // Atualizar o índice para o próximo tema
      currentTheme = (currentTheme + 1) % themes.length;

      // Adicionar o próximo tema
      document.body.classList.add(themes[currentTheme]);

      // Recriar animações se o tema neon for ativado
      enableCarnivalAnimations();
    });
  }
});

// Função para criar os pedaços coloridos no clique
function createPedaços(event) {
  // Verificar se o tema é neon
  if (!document.body.classList.contains('theme-neon')) return;

  // Criar o pedaço colorido
  const pedaço = document.createElement('div');
  pedaço.classList.add('pedaço-colorido');

  // Definir a cor do pedaço aleatoriamente
  const cores = ['#ffeb3b', '#00ff3c', '#ff5722', '#00bcd4', '#ff4081'];
  const cor = cores[Math.floor(Math.random() * cores.length)];
  pedaço.style.backgroundColor = cor;

  // Definir a posição do pedaço onde o clique aconteceu
  pedaço.style.left = `${event.pageX - 5}px`; // Ajustar para centralizar no clique
  pedaço.style.top = `${event.pageY - 5}px`;  // Ajustar para centralizar no clique

  // Adicionar o pedaço à tela
  document.body.appendChild(pedaço);

  // Remover o pedaço após a animação (0.5 segundos)
  setTimeout(() => {
    pedaço.remove();
  }, 500); // Tempo da animação (500ms)
}

// Detectar cliques em qualquer parte da tela
document.addEventListener('click', createPedaços);


document.addEventListener('change', calculateTotal);
