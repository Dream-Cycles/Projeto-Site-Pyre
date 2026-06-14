// IMPORT
import { cdCard } from "./cdCard.js";
import {
    previewCard,
    previewArea,
    overlay,
    cdContainer,
    videoPreview,
} from "./var.js";


// GERAL

const information = document.querySelectorAll('.informacoes');
const gradient = document.querySelectorAll('.gradiente');
const gameDes = document.querySelectorAll('.descricao-jogo');

if (information && gameDes) {
    gameDesGradH();

    window.addEventListener('resize', gameDesGradH())
}

// CABECALHO


// MENU-HAMBURGER
const menuGeral = document.querySelector(".menu-geral");

let rotationIncrement = 4;

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

if (previewArea) {
    // VARIÁVEIS
    let selOffset = 0;

    const videoSources = [
        "/assets/vid/MH Wilds Preview.mp4",
        "/assets/vid/Pragmata Preview.mp4",
        "/assets/vid/Gow Laufey Preview.mp4",
    ];

    let cdContainerRect = cdContainer[0].getBoundingClientRect();

    let vidSize = previewCard[0].getBoundingClientRect().height;
    let progresso = 0.5;

    let selSize = cdContainerRect.width + 6;

    let videoHover = false;

    let cardAtual;

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
        (card, index) => new cdCard(card, index, videoSources[index]),
    );
}

// FUNÇÕES GERAIS

function gameDesGradH() {

    const elHeight = new Array(gradient.length).fill(null);
    let inTop;
    gameDes.forEach((element, index) => {
        elHeight[index] = element.clientHeight;
    });

    gradient.forEach((element, index) => {

        const topPadding = getComputedStyle(information[index])

        inTop = parseFloat(topPadding.paddingTop);

        element.style.setProperty(
            '--descricao-h',
            `${elHeight[index]}px`
        )
        element.style.setProperty(
            '--gradiente-top',
            `${inTop}px`
        )

    });

}
