// 1. Encontra o espaço reservado para o cabeçalho
const cabecalho = document.querySelector(".cabecalho");

if (cabecalho) {
    // 2. Cria o menu compartilhado por todas as páginas
    cabecalho.innerHTML = `
        <a class="marca" href="index.html">
            <img
                class="logo"
                src="imagens/logo.png"
                alt="Resort Dom Basílio — página inicial">
        </a>

        <button
            class="botao-menu"
            type="button"
            aria-controls="menu-principal"
            aria-expanded="false">
            Menu
        </button>

        <nav
            id="menu-principal"
            class="menu"
            aria-label="Menu principal">

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

    // 3. Encontra os elementos depois de criar o menu
    const botaoMenu = cabecalho.querySelector(".botao-menu");
    const menu = cabecalho.querySelector("#menu-principal");
    const linksMenu = menu.querySelectorAll("a");

    // 4. Descobre o nome do arquivo aberto
    let paginaAtual = window.location.pathname.split("/").pop();

    // Quando o endereço termina em "/", considera a página inicial
    if (paginaAtual === "") {
        paginaAtual = "index.html";
    }

    // 5. Destaca automaticamente o link da página atual
    linksMenu.forEach(function (link) {
        if (link.getAttribute("href") === paginaAtual) {
            link.setAttribute("aria-current", "page");
        }
    });

    // 6. Ativa os estilos do menu interativo
    cabecalho.classList.add("menu-interativo");

    // 7. Abre ou fecha o menu pelo botão
    botaoMenu.addEventListener("click", function () {
        const estaAberto = menu.classList.toggle("aberto");

        botaoMenu.setAttribute("aria-expanded", estaAberto);

        if (estaAberto) {
            botaoMenu.textContent = "Fechar menu";
        } else {
            botaoMenu.textContent = "Menu";
        }
    });

    // 8. Função para fechar o menu
    function fecharMenu() {
        menu.classList.remove("aberto");
        botaoMenu.setAttribute("aria-expanded", "false");
        botaoMenu.textContent = "Menu";
    }

    // 9. Fecha o menu ao escolher um link
    linksMenu.forEach(function (link) {
        link.addEventListener("click", fecharMenu);
    });

    // 10. Fecha com a tecla Escape e devolve o foco ao botão
    cabecalho.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape" && menu.classList.contains("aberto")) {
            fecharMenu();
            botaoMenu.focus();
        }
    });
}

    // 11. Cria o rodapé compartilhado por todas as páginas
    const rodape = document.querySelector(".rodape");

        if (rodape) {
            rodape.innerHTML = `
                <p><strong>Resort Dom Basílio</strong></p>

                <address>
                    Estrada de Aldeia, KM 13 — Camaragibe/PE
                </address>

                <p>Projeto acadêmico — empreendimento fictício.</p>
            `;
            }

    // 12. Encontra o formulário de reservas
    const formularioReserva = document.querySelector("#formulario-reserva");

    // Só executa esta parte na página que possui o formulário
    if (formularioReserva) {
        const nome = formularioReserva.querySelector("#nome");
        const acomodacao = formularioReserva.querySelector("#acomodacao");
        const hospedes = formularioReserva.querySelector("#hospedes");
        const entrada = formularioReserva.querySelector("#entrada");
        const saida = formularioReserva.querySelector("#saida");
        const botaoReserva = formularioReserva.querySelector("#botao-reserva");
        const mensagem = formularioReserva.querySelector("#mensagem-reserva");

        // 13. Guarda as capacidades de cada acomodação
        const capacidades = {
            "chale-casal": 2,
            "chale-familia": 4,
            "suite-premium": 2
        };

        // Monta a data de hoje no formato usado pelo campo: AAAA-MM-DD
        function obterHoje() {
            const hoje = new Date();

            const ano = hoje.getFullYear();
            const mes = String(hoje.getMonth() + 1).padStart(2, "0");
            const dia = String(hoje.getDate()).padStart(2, "0");

            return `${ano}-${mes}-${dia}`;
        }

        entrada.min = obterHoje();
        saida.min = obterHoje();

        // 14. Atualiza o limite de hóspedes ao escolher a acomodação
        acomodacao.addEventListener("change", function () {
            const capacidade = capacidades[acomodacao.value];

            if (capacidade) {
                hospedes.max = capacidade;
            } else {
                hospedes.max = 4;
            }
        });

        // Apaga o resultado anterior quando o formulário é alterado
        formularioReserva.addEventListener("input", function () {
            mensagem.textContent = "";
        });

        // Converte AAAA-MM-DD para DD/MM/AAAA
        function formatarData(data) {
            const partes = data.split("-");

            return `${partes[2]}/${partes[1]}/${partes[0]}`;
        }

        // 15. Verifica os dados ao clicar em "Simular reserva"
        formularioReserva.addEventListener("submit", function (evento) {
            // Impede que o formulário envie dados ou recarregue a página
            evento.preventDefault();

            const nomeInformado = nome.value.trim();
            const capacidade = capacidades[acomodacao.value];
            const quantidade = Number(hospedes.value);

            if (nomeInformado === "") {
                mensagem.textContent = "Informe seu nome.";
                nome.focus();
                return;
            }

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

            // Calcula as noites usando datas em UTC para evitar
            // diferenças causadas por mudanças de horário local
            const inicio = new Date(entrada.value + "T00:00:00Z");
            const fim = new Date(saida.value + "T00:00:00Z");

            const milissegundosPorDia = 24 * 60 * 60 * 1000;
            const noites = (fim - inicio) / milissegundosPorDia;

            const opcaoEscolhida =
                acomodacao.options[acomodacao.selectedIndex].textContent.trim();

            // Pega os dados complementares do formulário
            const emailInformado =
            formularioReserva.querySelector("#email").value.trim();

            const observacoes =
            formularioReserva.querySelector("#observacoes").value.trim();

            // Número do atendimento: Brasil + DDD + telefone
            const telefone = "5581979023108";

            // Prepara a solicitação de disponibilidade
            const mensagemWhatsApp = [
            "Olá! Gostaria de consultar disponibilidade no Resort Dom Basílio.",
            "",
            `Nome: ${nomeInformado}`,
            `E-mail: ${emailInformado}`,
            `Acomodação: ${opcaoEscolhida}`,
            `Total de hóspedes: ${quantidade}`,
            `Entrada: ${formatarData(entrada.value)}`,
            `Saída: ${formatarData(saida.value)}`,
            `Total de noites: ${noites}`,
            "",
            `Observações: ${observacoes || "Nenhuma."}`,
            "",
            "Poderiam informar a disponibilidade, o valor e as condições da hospedagem?"
            ].join("\n");

            const linkWhatsApp =
              `https://wa.me/${telefone}?text=${encodeURIComponent(mensagemWhatsApp)}`;

            // Abre a conversa com a mensagem preparada
            window.location.href = linkWhatsApp;
            });

            // 16. Habilita o botão após configurar o formulário
            botaoReserva.disabled = false;
    }

        // 17. Formulário de contato pelo WhatsApp
        const formularioContato = document.querySelector("#formulario-contato");

        if (formularioContato) {
            const nomeContato = formularioContato.querySelector("#nome-contato");
            const emailContato = formularioContato.querySelector("#email-contato");
            const assuntoContato = formularioContato.querySelector("#assunto-contato");
            const textoContato = formularioContato.querySelector("#texto-contato");
            const botaoContato = formularioContato.querySelector("#botao-contato");
            const resultadoContato =
                formularioContato.querySelector("#resultado-contato");

            formularioContato.addEventListener("submit", function (evento) {
                evento.preventDefault();

                const nomeInformado = nomeContato.value.trim();
                const mensagemInformada = textoContato.value.trim();

                if (nomeInformado === "") {
                    resultadoContato.textContent = "Informe seu nome.";
                    nomeContato.focus();
                    return;
                }

                if (mensagemInformada.length < 10) {
                    resultadoContato.textContent =
                        "Escreva uma mensagem com pelo menos 10 caracteres.";

                    textoContato.focus();
                    return;
                }

                // Número com código do Brasil e DDD, somente dígitos
                const telefone = "5581979023108";

                // Pega o texto da opção escolhida
                const assuntoEscolhido =
                    assuntoContato.options[assuntoContato.selectedIndex].textContent;

                // Monta a mensagem com quebras de linha
                const mensagemWhatsApp = [
                    "Olá! Vim pelo site do Resort Dom Basílio.",
                    "",
                    `Nome: ${nomeInformado}`,
                    `E-mail: ${emailContato.value.trim()}`,
                    `Assunto: ${assuntoEscolhido}`,
                    "",
                    mensagemInformada
                ].join("\n");

                // Prepara espaços, acentos e quebras de linha para o link
                const linkWhatsApp =
                    `https://wa.me/${telefone}?text=${encodeURIComponent(mensagemWhatsApp)}`;

                // Abre o WhatsApp na mesma aba
                window.location.href = linkWhatsApp;
            });

            formularioContato.addEventListener("input", function () {
                resultadoContato.textContent = "";
            });

            botaoContato.disabled = false;
        }

        // 18. Imagens de fundo de cada página
    const fundosPaginas = {
        "index.html": {
            banner: "banner-principal.png",
            fundo: "area-verde.png"
        },
        "sobre.html": {
            banner: "fachada-resort.png",
            fundo: "area-verde.png"
        },
        "acomodacoes.html": {
            banner: "suite-premium.png",
            fundo: "chale-casal.png"
        },
        "lazer.html": {
            banner: "piscina.png",
            fundo: "area-verde.png"
        },
        "gastronomia.html": {
            banner: "restaurante.png",
            fundo: "area-verde.png"
        },
        "galeria.html": {
            banner: "banner-principal.png",
            fundo: "area-verde.png"
        },
        "reservas.html": {
            banner: "chale-casal.png",
            fundo: "fachada-resort.png"
        },
        "contato.html": {
            banner: "fachada-resort.png",
            fundo: "area-verde.png"
        }
    };

    // Identifica o arquivo aberto
    const arquivoPagina =
        window.location.pathname.split("/").pop() || "index.html";

    const imagensPagina = fundosPaginas[arquivoPagina];

    if (imagensPagina) {
        document.body.classList.add("pagina-com-fotos");

        // Calcula os endereços a partir da localização do HTML
        const enderecoBanner = new URL(
            `imagens/${imagensPagina.banner}`,
            document.baseURI
        ).href;

        const enderecoFundo = new URL(
            `imagens/${imagensPagina.fundo}`,
            document.baseURI
        ).href;

        // Entrega ao CSS os endereços completos
        document.body.style.setProperty(
            "--banner-pagina",
            `url("${enderecoBanner}")`
        );

        document.body.style.setProperty(
            "--fundo-pagina",
            `url("${enderecoFundo}")`
        );
    }

    // 19. Ampliação das fotos da galeria
    const visualizadorFoto = document.querySelector("#visualizador-foto");

    if (visualizadorFoto) {
        const fotosGaleria = document.querySelectorAll(".foto-galeria");
        const imagemAmpliada = document.querySelector("#imagem-ampliada");
        const legendaAmpliada = document.querySelector("#legenda-ampliada");
        const fecharFoto = document.querySelector("#fechar-foto");

        let ultimaFotoClicada = null;

        // Configura cada botão da galeria
        fotosGaleria.forEach(function (botao) {
            const foto = botao.querySelector("img");
            const legenda = botao.querySelector("span");

            botao.setAttribute(
                "aria-label",
                `Ampliar foto: ${legenda.textContent}`
            );

            botao.addEventListener("click", function () {
                ultimaFotoClicada = botao;

                // Copia a foto e sua descrição para a janela
                imagemAmpliada.src = foto.src;
                imagemAmpliada.alt = foto.alt;
                legendaAmpliada.textContent = legenda.textContent;

                visualizadorFoto.showModal();
                document.body.classList.add("foto-aberta");
            });
        });

        // Fecha pelo botão
        fecharFoto.addEventListener("click", function () {
            visualizadorFoto.close();
        });

        // Executa tanto ao fechar pelo botão quanto pela tecla Esc
        visualizadorFoto.addEventListener("close", function () {
            document.body.classList.remove("foto-aberta");

            if (ultimaFotoClicada) {
                ultimaFotoClicada.focus();
            }
        });
}