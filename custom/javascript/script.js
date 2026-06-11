// VARIÁVEIS

// BOTÃO DE PESQUISA
const pesquisa = document.getElementById("botao-pesquisa");
const pesquisaText = document.getElementById("pesquisa-texto")
const pesquisaClose = document.getElementById("pesquisa-close");
const pesquisaForm = document.querySelector(".pesquisa-form");

// MENU-HAMBURGER
const menuHamburger = document.querySelector(".menu-hamburger");
const menuGeral = document.querySelector(".menu-geral");
const menuClose = document.querySelector(".menu-close");

// PREVIEWS

const highlight = document.querySelector(".preview");
const highlightCard = document.querySelectorAll(".card-preview");
const videoPreview = document.querySelector(".preview-video");
const overlay = document.querySelector(".overlay");

const cdImg = document.querySelector(".cd-img");

const cdContainer = document.querySelector(".cd-container")

let cdContainerRect = cdContainer.getBoundingClientRect();
let selSize = cdContainerRect.width + 6;


let selOffset = 0;

// VARIÁVEIS DO PREVIEW
let rotation = 0;
let rotationAmount = 0.1;


let selectionRotation = 0;
let ultimoFrameSel = null;
let progresso = 50;

let ultimoFrame = null;
let speedId;
let cdSelectionId

let hovered = false;

// ABRE A BARRA DE PESQUISA (MOBILE ONLY)
pesquisa.addEventListener('click', function () {

  pesquisaForm.classList.toggle('clicked');
  pesquisaText.focus();

})

// ABRE O MENU QUANDO FOR CLICADO

menuHamburger.addEventListener('click', function ()
{

  menuGeral.classList.add('menu-clicked');

})
menuClose.addEventListener('click', function() {

  menuGeral.classList.remove('menu-clicked');

})

// AÇÕES DO PREVIEW

// MOVIMENTAÇÃO COM O HOVER
highlight.addEventListener("mousemove", () => {
    [...highlightCard].forEach((card) => {
        let timer;
        let videoTimer;

        // ACELERAÇÃO DO DISCO
        rotationIncrement = 4;

        card.addEventListener("mouseenter", () => {
            if (!hovered) {

                cancelAnimationFrame(cdSelectionId)
                ultimoFrameSel = null;
                cdSelectionId = requestAnimationFrame(cdSelection);

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
                    ultimoFrame = null;
                    speedId = requestAnimationFrame(speedIncrease);

                    

                    // DELAY PARA O VÍDEO
                    videoTimer = setTimeout(() => {
                        videoPreview.classList.add("video-show");
                        overlay.classList.add("video-show");

                        videoPreview.play();
                    }, 750);
                }, 2000);
            }
        });

        // RETORNA AO ESTADO ORIGINAL
        card.addEventListener("mouseleave", () => {
            clearTimeout(timer);
        })

        highlight.addEventListener("mouseleave", () => {
            card.classList.remove("hovered");
            card.classList.remove("not-hovered");
            videoPreview.classList.remove("video-show");
            overlay.classList.remove("video-show");

            videoPreview.pause();
            videoPreview.currentTime = 0;


            clearTimeout(videoTimer)

            hovered = false;

            progresso = 200;
            
            cancelAnimationFrame(speedId);
            cancelAnimationFrame(cdSelectionId);


            ultimoFrame = null;
            ultimoFrameSel = null;


            speedId = requestAnimationFrame(speedIncrease);
            cdSelectionId = requestAnimationFrame(cdSelection);
            
        });
    });
});

// DEFINIR O TAMANHO DO SELECT


document.documentElement.style.setProperty (
    "--selSize",
    `${selSize}px`
)

const observer = new ResizeObserver ((objetos) => {
    cdContainerRect = objetos[0].contentRect;
    selSize = cdContainerRect.width + 6;

    document.documentElement.style.setProperty (
    "--selSize",
    `${selSize}px`
    )

})

observer.observe(cdContainer);

// CENTRALIZAR SELECT

selOffset = (selSize - cdContainerRect.width) / 2;

document.documentElement.style.setProperty (
    "--seloffset",
    `${selOffset * - 1}px`
);


// FUNÇÕES


// RODAR IMAGEM

function speedIncrease(tempo)
{   
    // CALCULO PARA CONSISTÊNCIA ENTRE FRAMERATES
    if (ultimoFrame == null) ultimoFrame = tempo;

    const diferenca = (tempo - ultimoFrame) / 1000;

    ultimoFrame = tempo;

    switch (hovered)
    {
        case true:
            rotationAmount = Math.min ( 20, rotationAmount + rotationIncrement * diferenca);
            break;
        
        case false:
            rotationAmount = Math.max ( 0.1, rotationAmount - rotationIncrement * diferenca);
            break;
    }
  

    speedId = requestAnimationFrame(speedIncrease);
}

function cdRotate() {

    rotation += rotationAmount;

    document.documentElement.style.setProperty
    (
        "--rotation",
        `${rotation}deg`
    );

    requestAnimationFrame(cdRotate);
}

requestAnimationFrame(cdRotate);

// SELEÇÃO

function cdSelection(tempo) {

  if (ultimoFrameSel == null) ultimoFrameSel = tempo;

  const diferenca = (tempo - ultimoFrameSel) / 1000;

  ultimoFrameSel = tempo;

  switch (hovered)
    {
        case true:
            selectionRotation = Math.min ( 100, selectionRotation + progresso * diferenca);
            break;
        
        case false:
            selectionRotation = Math.max ( 0, selectionRotation - progresso * diferenca);
            break;
    }

  document.documentElement.style.setProperty(
      "--progresso",
      `${selectionRotation}%`
  );

  cdSelectionId = requestAnimationFrame(cdSelection)
}








