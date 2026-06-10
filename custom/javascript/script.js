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

// VARIÁVEIS DO PREVIEW
let rotation = 0;
let rotationAmount = 0.1;

let ultimoFrame = null;
let speedId;

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

                    hovered = true;

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
            
            cancelAnimationFrame(speedId);
            ultimoFrame = null;
            speedId = requestAnimationFrame(speedIncrease);
        });
    });
});


// RODAR IMAGEM

function speedIncrease(tempo)
{   
    // CALCULO PARA CONSISTÊNCIA ENTRE FRAMERATES
    if (ultimoFrame == null) ultimoFrame = tempo;

    let diferenca = (tempo - ultimoFrame) / 1000;

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




