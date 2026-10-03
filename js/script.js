const TELEFONE_WHATSAPP = "5581979023108";

const PAGINA_ATUAL =
    window.location.pathname.split("/").pop() || "index.html";

const FUNDOS_PAGINAS = {
    "index.html": {
        banner: "banner-principal.webp",
        fundo: "area-verde.webp"
    },
    "sobre.html": {
        banner: "fachada-resort.webp",
        fundo: "area-verde.webp"
    },
    "acomodacoes.html": {
        banner: "suite-premium.webp",
        fundo: "chale-casal.webp"
    },
    "lazer.html": {
        banner: "piscina.webp",
        fundo: "area-verde.webp"
    },
    "gastronomia.html": {
        banner: "restaurante.webp",
        fundo: "area-verde.webp"
    },
    "galeria.html": {
        banner: "banner-principal.webp",
        fundo: "area-verde.webp"
    },
    "reservas.html": {
        banner: "chale-casal.webp",
        fundo: "fachada-resort.webp"
    },
    "contato.html": {
        banner: "fachada-resort.webp",
        fundo: "area-verde.webp"
    }
};

// Componentes compartilhados
function criarCabecalho() {
    const cabecalho = document.querySelector(".cabecalho");

    if (!cabecalho) {
        return;
    }

    cabecalho.innerHTML = `
        <a class="marca" href="index.html">
            <img
                class="logo"
                src="imagens/logo.webp"
                width="660"
                height="269"
                alt="Resort Dom Basílio — página inicial">
        </a>

        <button
            class="botao-menu"
            type="button"
            aria-controls="menu-principal"
            aria-expanded="false">
            Menu
        </button>

        <nav id="menu-principal" class="menu" aria-label="Menu principal">
            <ul class="menu-lista">
                <li><a href="index.html">Início</a></li>
                <li><a href="sobre.html">O Resort</a></li>
                <li><a href="acomodacoes.html">Acomodações</a></li>
                <li><a href="lazer.html">Lazer</a></li>
                <li><a href="gastronomia.html">Gastronomia</a></li>
                <li><a href="galeria.html">Galeria</a></li>
                <li><a href="reservas.html">Reservas</a></li>
                <li><a href="contato.html">Contato</a></li>
            </ul>
        </nav>
    `;

    const botaoMenu = cabecalho.querySelector(".botao-menu");
    const menu = cabecalho.querySelector("#menu-principal");
    const linksMenu = menu.querySelectorAll("a");

    function fecharMenu() {
        menu.classList.remove("aberto");
        botaoMenu.setAttribute("aria-expanded", "false");
        botaoMenu.textContent = "Menu";
    }

    linksMenu.forEach(function (link) {
        if (link.getAttribute("href") === PAGINA_ATUAL) {
            link.setAttribute("aria-current", "page");
        }

        link.addEventListener("click", fecharMenu);
    });

    cabecalho.classList.add("menu-interativo");

    botaoMenu.addEventListener("click", function () {
        const estaAberto = menu.classList.toggle("aberto");

        botaoMenu.setAttribute("aria-expanded", String(estaAberto));
        botaoMenu.textContent = estaAberto ? "Fechar menu" : "Menu";
    });

    cabecalho.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape" && menu.classList.contains("aberto")) {
            fecharMenu();
            botaoMenu.focus();
        }
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 1100) {
            fecharMenu();
        }
    });
}

function criarRodape() {
    const rodape = document.querySelector(".rodape");

    if (!rodape) {
        return;
    }

    rodape.innerHTML = `
        <p><strong>Resort Dom Basílio</strong></p>
        <address>Estrada de Aldeia, KM 13 — Camaragibe/PE</address>
        <p>Projeto acadêmico — empreendimento fictício.</p>
    `;
}

// Funções auxiliares
function obterHoje() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function formatarData(data) {
    return data.split("-").reverse().join("/");
}

function abrirWhatsApp(linhas) {
    const texto = encodeURIComponent(linhas.join("\n"));
    window.location.href = `https://wa.me/${TELEFONE_WHATSAPP}?text=${texto}`;
}

function limparMensagemAoEditar(formulario, mensagem) {
    formulario.addEventListener("input", function () {
        mensagem.textContent = "";
    });
}

// Formulário de reservas
function configurarFormularioReserva() {
    const formulario = document.querySelector("#formulario-reserva");

    if (!formulario) {
        return;
    }

    const nome = formulario.querySelector("#nome");
    const email = formulario.querySelector("#email");
    const acomodacao = formulario.querySelector("#acomodacao");
    const hospedes = formulario.querySelector("#hospedes");
    const entrada = formulario.querySelector("#entrada");
    const saida = formulario.querySelector("#saida");
    const observacoes = formulario.querySelector("#observacoes");
    const botao = formulario.querySelector("#botao-reserva");
    const mensagem = formulario.querySelector("#mensagem-reserva");

    const capacidades = {
        "chale-casal": 2,
        "chale-familia": 4,
        "suite-premium": 2
    };

    function atualizarLimiteHospedes() {
        const capacidade = capacidades[acomodacao.value] || 4;
        hospedes.max = String(capacidade);

        if (Number(hospedes.value) > capacidade) {
            hospedes.value = String(capacidade);
        }
    }

    function atualizarDataSaida() {
        saida.min = entrada.value || obterHoje();

        if (saida.value && saida.value <= entrada.value) {
            saida.value = "";
        }
    }

    entrada.min = obterHoje();
    saida.min = obterHoje();

    acomodacao.addEventListener("change", atualizarLimiteHospedes);
    entrada.addEventListener("change", atualizarDataSaida);
    limparMensagemAoEditar(formulario, mensagem);

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const capacidade = capacidades[acomodacao.value];
        const quantidade = Number(hospedes.value);

        if (!capacidade) {
            mensagem.textContent = "Selecione uma acomodação.";
            acomodacao.focus();
            return;
        }

        if (
            !Number.isInteger(quantidade) ||
            quantidade < 1 ||
            quantidade > capacidade
        ) {
            mensagem.textContent =
                `Essa acomodação permite de 1 a ${capacidade} hóspedes.`;
            hospedes.focus();
            return;
        }

        if (entrada.value < obterHoje()) {
            mensagem.textContent =
                "A data de entrada não pode ser anterior a hoje.";
            entrada.focus();
            return;
        }

        if (saida.value <= entrada.value) {
            mensagem.textContent =
                "A saída deve ser posterior à data de entrada.";
            saida.focus();
            return;
        }

        const inicio = new Date(`${entrada.value}T00:00:00Z`);
        const fim = new Date(`${saida.value}T00:00:00Z`);
        const milissegundosPorDia = 24 * 60 * 60 * 1000;
        const noites = (fim - inicio) / milissegundosPorDia;
        const opcaoEscolhida =
            acomodacao.options[acomodacao.selectedIndex].textContent.trim();

        abrirWhatsApp([
            "Olá! Gostaria de consultar disponibilidade no Resort Dom Basílio.",
            "",
            `Nome: ${nome.value.trim()}`,
            `E-mail: ${email.value.trim()}`,
            `Acomodação: ${opcaoEscolhida}`,
            `Total de hóspedes: ${quantidade}`,
            `Entrada: ${formatarData(entrada.value)}`,
            `Saída: ${formatarData(saida.value)}`,
            `Total de noites: ${noites}`,
            "",
            `Observações: ${observacoes.value.trim() || "Nenhuma."}`,
            "",
            "Poderiam informar a disponibilidade, o valor e as condições da hospedagem?"
        ]);
    });

    botao.disabled = false;
}

// Formulário de contato
function configurarFormularioContato() {
    const formulario = document.querySelector("#formulario-contato");

    if (!formulario) {
        return;
    }

    const nome = formulario.querySelector("#nome-contato");
    const email = formulario.querySelector("#email-contato");
    const assunto = formulario.querySelector("#assunto-contato");
    const texto = formulario.querySelector("#texto-contato");
    const botao = formulario.querySelector("#botao-contato");
    const mensagem = formulario.querySelector("#resultado-contato");

    limparMensagemAoEditar(formulario, mensagem);

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const textoInformado = texto.value.trim();

        if (textoInformado.length < 10) {
            mensagem.textContent =
                "Escreva uma mensagem com pelo menos 10 caracteres.";
            texto.focus();
            return;
        }

        const assuntoEscolhido =
            assunto.options[assunto.selectedIndex].textContent.trim();

        abrirWhatsApp([
            "Olá! Vim pelo site do Resort Dom Basílio.",
            "",
            `Nome: ${nome.value.trim()}`,
            `E-mail: ${email.value.trim()}`,
            `Assunto: ${assuntoEscolhido}`,
            "",
            textoInformado
        ]);
    });

    botao.disabled = false;
}

// Imagens de fundo de cada página
function configurarFundosDaPagina() {
    const imagens = FUNDOS_PAGINAS[PAGINA_ATUAL];

    if (!imagens) {
        return;
    }

    const enderecoBanner =
        new URL(`imagens/${imagens.banner}`, document.baseURI).href;
    const enderecoFundo =
        new URL(`imagens/${imagens.fundo}`, document.baseURI).href;

    document.body.classList.add("pagina-com-fotos");
    document.body.style.setProperty(
        "--banner-pagina",
        `url("${enderecoBanner}")`
    );
    document.body.style.setProperty(
        "--fundo-pagina",
        `url("${enderecoFundo}")`
    );
}

// Ampliação das fotos da galeria
function configurarGaleria() {
    const visualizador = document.querySelector("#visualizador-foto");

    if (!visualizador) {
        return;
    }

    const imagemAmpliada = visualizador.querySelector("#imagem-ampliada");
    const legendaAmpliada = visualizador.querySelector("#legenda-ampliada");
    const botaoFechar = visualizador.querySelector("#fechar-foto");
    const fotos = document.querySelectorAll(".foto-galeria");

    let ultimaFotoClicada = null;

    fotos.forEach(function (botao) {
        const imagem = botao.querySelector("img");
        const legenda = botao.querySelector("span");

        botao.setAttribute(
            "aria-label",
            `Ampliar foto: ${legenda.textContent}`
        );

        botao.addEventListener("click", function () {
            ultimaFotoClicada = botao;
            imagemAmpliada.src = imagem.src;
            imagemAmpliada.alt = imagem.alt;
            legendaAmpliada.textContent = legenda.textContent;

            visualizador.showModal();
            document.body.classList.add("foto-aberta");
        });
    });

    botaoFechar.addEventListener("click", function () {
        visualizador.close();
    });

    visualizador.addEventListener("click", function (evento) {
        if (evento.target === visualizador) {
            visualizador.close();
        }
    });

    visualizador.addEventListener("close", function () {
        document.body.classList.remove("foto-aberta");

        if (ultimaFotoClicada) {
            ultimaFotoClicada.focus();
        }
    });
}

criarCabecalho();
criarRodape();
configurarFormularioReserva();
configurarFormularioContato();
configurarFundosDaPagina();
configurarGaleria();
