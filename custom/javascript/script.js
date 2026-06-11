// VARIÁVEIS

// MENU-HAMBURGER
const menuGeral = document.querySelector(".menu-geral");

// HTML VIDEO
const videoSrc = document.querySelector(".preview-video");

// PREVIEWS

const highlightCard = document.querySelectorAll(".card-preview");
const videoPreview = document.querySelector(".preview-video");
const overlay = document.querySelector(".overlay");

const cdContainer = document.querySelectorAll(".cd-container");

let selOffset = 0;

// VARIÁVEIS DO PREVIEW
let cdContainerRect = cdContainer[0].getBoundingClientRect();

let rotation = 0;
let rotationAmount = 0.1;

const selectionRotation = new Array(cdContainer.length).fill(null);
const ultimoFrameSel = new Array(cdContainer.length).fill(null);
let progresso = 0.5;

let ultimoFrame = null;
let speedId;
const cdSelectionId = new Array(cdContainer.length).fill(null);

let selSize = cdContainerRect.width + 6;

let vidLeft = 0;
let vidSize = highlightCard[0].getBoundingClientRect().height;

let hovered = false;

let cardAtual;

// ABRE A BARRA DE PESQUISA (MOBILE ONLY)
document
    .getElementById("botao-pesquisa")
    .addEventListener("click", function () {
        document.querySelector(".pesquisa-form").classList.toggle("clicked");
        document.getElementById("pesquisa-texto").focus();
    });

// ABRE O MENU QUANDO FOR CLICADO

document
    .querySelector(".menu-hamburger")
    .addEventListener("click", function () {
        menuGeral.classList.add("menu-clicked");
    });
document.querySelector(".menu-close").addEventListener("click", function () {
    menuGeral.classList.remove("menu-clicked");
});

// AÇÕES DO PREVIEW

// MOVIMENTAÇÃO COM O HOVER
[...highlightCard].forEach((card, index) => {
    let timer;
    let videoTimer;

    // ACELERAÇÃO DO DISCO
    rotationIncrement = 4;

    card.addEventListener("mouseenter", () => {
        if (!hovered) {
            cardAtual = index;

            cancelAnimationFrame(cdSelectionId[cardAtual]);
            ultimoFrameSel[cardAtual] = null;

            cdSelectionId[cardAtual] = requestAnimationFrame((tempo) =>
                cdSelection(tempo, cardAtual),
            );

            hovered = true;
            progresso = 50;

            timer = setTimeout(() => {
                // COLETA DE DADOS PARA FAZER A MOVIMENTAÇÃO PARA A ESQUERDA
                let ogLeft = card.getBoundingClientRect().left;

                document.documentElement.style.setProperty(
                    "--offset",
                    `-${ogLeft - 50}px`,
                );

                // MOVE O CARD PARA A ESQUERDA E ESCONDE OS OUTROS CARDS
                card.classList.add("hovered");

                [...highlightCard]
                    .filter((outro) => !outro.classList.contains("hovered"))
                    .forEach((outro) => outro.classList.add("not-hovered"));

                // CANCELANIMATION PARA EVITAR LOOPS DUPLICADOS
                cancelAnimationFrame(speedId);
                ultimoFrame[cardAtual] = null;
                speedId = requestAnimationFrame(speedIncrease);

                // DELAY PARA O VÍDEO
                videoTimer = setTimeout(() => {
                    // SELECIONA O VÍDEO
                    switch (cardAtual) {
                        case 0:
                            videoPreview.src = "/assets/vid/MH Wilds Preview.mp4";
                            break;

                        case 1:
                            videoPreview.src = "/assets/vid/Pragmata Preview.mp4";
                            break;

                        default:
                            videoPreview.src = "/assets/vid/Gow Laufey Preview.mp4";
                            break;
                    }

                    // ESPAÇO ENTRE O VÍDEO E O CARD

                    vidLeft = card.getBoundingClientRect().right;

                    console.log(vidLeft);

                    document.documentElement.style.setProperty(
                        "--videoLeft",
                        `${vidLeft + 25}px`,
                    );

                    videoPreview.classList.add("video-show");
                    overlay.classList.add("video-show");

                    videoPreview.play();
                }, 1000);
            }, 2000);
        }
    });

    // RETORNA AO ESTADO ORIGINAL
    card.addEventListener("mouseleave", () => {
        clearTimeout(timer);

        cardAtual = index;
        cancelAnimationFrame(cdSelectionId[cardAtual]);

        ultimoFrameSel[cardAtual] = null;

        cdSelectionId[cardAtual] = requestAnimationFrame((tempo) =>
            cdSelection(tempo, cardAtual),
        );
    });
    document.querySelector(".preview").addEventListener("mouseleave", () => {
        card.classList.remove("hovered");
        card.classList.remove("not-hovered");
        videoPreview.classList.remove("video-show");
        overlay.classList.remove("video-show");

        videoPreview.pause();
        videoPreview.currentTime = 0;

        clearTimeout(videoTimer);

        hovered = false;

        progresso = 200;

        cancelAnimationFrame(speedId);

        ultimoFrame = null;

        speedId = requestAnimationFrame(speedIncrease);
    });
});

// DEFINIR O TAMANHO DO SELECT

document.documentElement.style.setProperty("--selSize", `${selSize}px`);

const observer = new ResizeObserver((objetos) => {
    cdContainerRect = objetos[0].contentRect;
    selSize = cdContainerRect.width + 6;

    document.documentElement.style.setProperty("--selSize", `${selSize}px`);
});

observer.observe(cdContainer[0]);

// MANTER A ALTURA DO VÍDEO IGUAL AO CONTAINER DO CARD

document.documentElement.style.setProperty("--videoSize", `${vidSize}px`);

const observerVideo = new ResizeObserver((objetos) => {
    highlightCard[0] = objetos[0].contentRect;
    vidSize = highlightCard.height;

    document.documentElement.style.setProperty("--videoSize", `${vidSize}px`);
});

// CENTRALIZAR AFTER DO SELECT

selOffset = (selSize - cdContainerRect.width) / 2;

document.documentElement.style.setProperty(
    "--seloffset",
    `${selOffset * -1}px`,
);

// FUNÇÕES
// RODAR IMAGEM

function speedIncrease(tempo) {
    // CALCULO PARA CONSISTÊNCIA ENTRE FRAMERATES

    if (ultimoFrame == null) ultimoFrame = tempo;

    const diferenca = (tempo - ultimoFrame) / 1000;

    ultimoFrame = tempo;

    switch (hovered) {
        case true:
            rotationAmount = Math.min(
                20,
                rotationAmount + rotationIncrement * diferenca,
            );
            break;

        case false:
            rotationAmount = Math.max(
                0.1,
                rotationAmount - rotationIncrement * diferenca,
            );
            break;
    }
    rotation += rotationAmount;

    document.documentElement.style.setProperty(
        "--rotation",
        `${rotation % 360}deg`,
    );

    speedId = requestAnimationFrame(speedIncrease);
}
requestAnimationFrame(speedIncrease);

// SELEÇÃO

function cdSelection(tempo, selCard) {
    if (ultimoFrameSel[selCard] == null) ultimoFrameSel[selCard] = tempo;

    const diferenca = (tempo - ultimoFrameSel[selCard]) / 1000;

    ultimoFrameSel[selCard] = tempo;

    switch (hovered) {
        case true:
            selectionRotation[selCard] = Math.min(
                100,
                selectionRotation[selCard] + progresso * diferenca,
            );
            break;

        case false:
            selectionRotation[selCard] = Math.max(
                0,
                selectionRotation[selCard] - progresso * diferenca,
            );
            break;
    }

    cdContainer[selCard].style.setProperty(
        "--progressoBarra",
        `${selectionRotation[selCard]}%`,
    );

    if (
        (!hovered && selectionRotation[selCard] > 0) ||
        (hovered && selectionRotation[selCard] <= 100)
    ) {
        cdSelectionId[selCard] = requestAnimationFrame((tempo) =>
            cdSelection(tempo, selCard),
        );
    }
}
