/* ==========================================================
   MAIN.JS – menu, janelas de projeto e formulário de contato
   ========================================================== */

// Avisa o CSS que o JavaScript está funcionando
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Menu do celular ---------- */
  const botao = document.querySelector('.menu-toggle');
  const menu = document.getElementById('menu-principal');

  if (botao && menu) {
    const definir = (abrir) => {
      menu.classList.toggle('aberto', abrir);
      botao.setAttribute('aria-expanded', String(abrir));
    };

    botao.addEventListener('click', () => {
      definir(botao.getAttribute('aria-expanded') !== 'true');
    });

    // A tecla Esc fecha o menu e devolve o foco ao botão
    document.addEventListener('keydown', (evento) => {
      if (evento.key === 'Escape' && botao.getAttribute('aria-expanded') === 'true') {
        definir(false);
        botao.focus();
      }
    });
  }

  /* ---------- Janelas de detalhes dos projetos ---------- */
  // Cada botão com data-abrir="algum-id" abre a janela que tem esse id
  document.querySelectorAll('[data-abrir]').forEach((botaoAbrir) => {
    botaoAbrir.addEventListener('click', () => {
      const janela = document.getElementById(botaoAbrir.dataset.abrir);
      if (!janela) return;
      janela.showModal();
      document.body.classList.add('modal-aberto');
    });
  });

  document.querySelectorAll('dialog.modal').forEach((janela) => {
    janela.addEventListener('click', (evento) => {
      // Fecha ao clicar no botão "Fechar" ou na área escura ao redor
      if (evento.target === janela || evento.target.closest('[data-fechar]')) {
        janela.close();
      }
    });

    // Roda sempre que a janela fecha (inclusive com a tecla Esc)
    janela.addEventListener('close', () => {
      document.body.classList.remove('modal-aberto');
    });
  });

  /* ---------- Entrada suave dos cards ao rolar a página ---------- */
  const cartoes = document.querySelectorAll('.card, .card-projeto');

  if ('IntersectionObserver' in window) {
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('show');
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.15 });

    cartoes.forEach((cartao, i) => {
      cartao.classList.add('reveal');
      cartao.style.setProperty('--atraso', ((i % 3) * 0.12) + 's'); // cards entram em sequência
      observador.observe(cartao);
    });
  }

  /* ---------- Formulário de contato ---------- */
  const form = document.getElementById('form-contato');
  if (!form) return; // As outras páginas não têm formulário

  const resumo = document.getElementById('resumo-erros');
  const sucesso = document.getElementById('mensagem-sucesso');

  // Regras: retorna true se estiver certo, ou o texto do erro
  const regras = {
    nome: (valor) =>
      valor.trim().length >= 2 || 'Informe seu nome (mínimo de 2 letras).',
    email: (valor) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor) ||
      'Informe um e-mail válido, como nome@exemplo.com.',
    mensagem: (valor) =>
      valor.trim().length >= 10 ||
      'Escreva uma mensagem com pelo menos 10 caracteres.'
  };

  const areaDoErro = (campo) => document.getElementById('erro-' + campo.id);

  // Ao digitar de novo, o aviso de erro daquele campo some
  Object.keys(regras).forEach((id) => {
    const campo = document.getElementById(id);
    campo.addEventListener('input', () => {
      campo.removeAttribute('aria-invalid');
      areaDoErro(campo).textContent = '';
    });
  });

  // Clicar em um erro da lista leva o foco até o campo
  resumo.addEventListener('click', (evento) => {
    const link = evento.target.closest('a');
    if (!link) return;
    evento.preventDefault();
    const campo = document.getElementById(link.getAttribute('href').slice(1));
    if (campo) campo.focus();
  });

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    sucesso.hidden = true;
    const erros = [];

    Object.keys(regras).forEach((id) => {
      const campo = document.getElementById(id);
      campo.removeAttribute('aria-invalid');
      areaDoErro(campo).textContent = '';

      const resultado = regras[id](campo.value);
      if (resultado !== true) {
        campo.setAttribute('aria-invalid', 'true');
        areaDoErro(campo).textContent = resultado;
        erros.push({ id: id, texto: resultado });
      }
    });

    // Se houver erros: mostra a lista e leva o foco para ela
    if (erros.length > 0) {
      resumo.innerHTML =
        '<p class="resumo-titulo">Corrija os campos abaixo:</p><ul>' +
        erros.map((erro) => '<li><a href="#' + erro.id + '">' + erro.texto + '</a></li>').join('') +
        '</ul>';
      resumo.hidden = false;
      resumo.focus();
      return;
    }

    // Tudo certo: abre o WhatsApp com a mensagem pronta
    resumo.hidden = true;
    resumo.innerHTML = '';

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const servico = document.getElementById('servico').value;
    const mensagem = document.getElementById('mensagem').value.trim();

    const texto =
      'Olá! Meu nome é ' + nome + '.\n' +
      'Tenho interesse em: ' + servico + '.\n\n' +
      mensagem + '\n\n' +
      'Meu e-mail: ' + email;

    const numero = form.dataset.whatsapp;
    const endereco = 'https://wa.me/' + numero + '?text=' + encodeURIComponent(texto);

    window.open(endereco, '_blank', 'noopener');

    sucesso.hidden = false;
    sucesso.focus();
    form.reset();
  });
});
