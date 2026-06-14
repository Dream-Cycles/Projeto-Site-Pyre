// IMPORT
import { cdCard } from './cdCard.js';
import { previewCard, previewArea, overlay, cdContainer, videoPreview } from './var.js';

// VARIÁVEIS

// MENU-HAMBURGER
const menuGeral = document.querySelector(".menu-geral");

// HTML VIDEO

let rotationIncrement = 4;

if (previewCard.length)
{
    // PREVIEWS

    let selOffset = 0;

    // VARIÁVEIS DO PREVIEW

    const videoSources = [
        "/assets/vid/MH Wilds Preview.mp4",
        "/assets/vid/Pragmata Preview.mp4",
        "/assets/vid/Gow Laufey Preview.mp4",
    ]

    let cdContainerRect = cdContainer[0].getBoundingClientRect();

    let vidSize = previewCard[0].getBoundingClientRect().height;
    let progresso = 0.5;

    let selSize = cdContainerRect.width + 6;

    let videoHover = false;

    let cardAtual;
}


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


// DEFINIR O TAMANHO DO SELECT
if (previewCard.length)
{
    document.documentElement.style.setProperty("--selSize", `${selSize}px`);

const observer = new ResizeObserver((objetos) => {
    cdContainerRect = objetos[0].contentRect;
    selSize = cdContainerRect.width + 6;

    document.documentElement.style.setProperty("--selSize", `${selSize}px`);
});

observer.observe(cdContainer[0]);



// MANTER A ALTURA DO VÍDEO IGUAL AO CONTAINER DO CARD

videoPreview.style.setProperty("--videoSize", `${vidSize}px`);

const observerVideo = new ResizeObserver((objetos) => {
    previewCard[0] = objetos[0].contentRect;
    vidSize = previewCard.height;

    document.documentElement.style.setProperty("--videoSize", `${vidSize}px`);
});

// CENTRALIZAR AFTER DO SELECT

selOffset = (selSize - cdContainerRect.width) / 2;

document.documentElement.style.setProperty(
    "--seloffset",
    `${selOffset * -1}px`,
);

// OBJETO DOS CARD
const cards = [...previewCard].map(
    (card, index) => new cdCard(card, index, videoSources[index])
)
}