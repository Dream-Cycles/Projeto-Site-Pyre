// IMPORT

import { previewCard, previewArea, overlay, cdContainer, rotationIncrement, videoPreview } from './var.js';

export class cdCard
{
    constructor(card, index, videoSrc) {
        this.card = card;
        this.index = index;
        this.videoSrc = videoSrc

        this.hovered = false;
        this.vidHovered = false;

        this.rotation = 0;
        this.rotationAmount = 0.1;
        this.lastFrame = null;
        this.lastFrameSel = null;
        this.progress = 0;
        this.vidLeft = 0;
        
        this.speedId = null;
        this.cdSelectionId = null;
        this.selectionRotation = null;

        this.cdContainer = document.querySelectorAll(".cd-container");
        this.cdImg = document.querySelectorAll(".cd-img");

        // CHAMADA DE FUNÇÕES
        this.eventBinding();

        this.speedId = requestAnimationFrame((tempo) => this.speedChange(tempo, this.index))
    }

    // FUNÇÕES

    // ADICIONA LISTENERS
    eventBinding()
    {
        this.card.addEventListener("mouseenter", () => this.onMouseEnter());
        this.card.addEventListener("mouseleave", () => this.onMouseLeave());
        previewArea.addEventListener("mouseleave", () => this.onPreviewLeave());
    }

    onMouseEnter()
    {
        cancelAnimationFrame(this.cdSelectionId);
        this.lastFrameSel = null;

        this.cdSelectionId = requestAnimationFrame((tempo) => this.cdSelection(tempo, this.index)
        );

        this.hovered = true;
        this.progress = 50;

        this.timer = setTimeout(() => {
            this.vidHovered = true;

            // COLETA DE DADOS PARA FAZER A MOVIMENTAÇÃO PARA A ESQUERDA

            let ogLeft = this.card.getBoundingClientRect().left;

            this.card.style.setProperty(
                "--offset",
                `-${ogLeft - 50}px`
            );

            // MOVE O CARD PARA A ESQUERDA E ESCONDE OUTROS CARDS

            this.card.classList.add("hovered");

            [...previewCard]
                .filter((other) => !other.classList.contains("hovered"))
                .forEach((other) => other.classList.add("not-hovered"));

            // DELAY DO VIDEO

            this.videoTimer = setTimeout(() => {

                this.vidLeft = this.card.getBoundingClientRect().right;

                videoPreview.src = this.videoSrc

                videoPreview.style.setProperty(
                    "--videoLeft",
                    `${this.vidLeft + 25}px`,
                );

                videoPreview.classList.add("video-show");
                overlay.classList.add("video-show");

                videoPreview.play();
            }, 1000);
            
        }, 2000);
    }
    onMouseLeave()
    {
        clearTimeout(this.timer);

        this.hovered = false;
        cancelAnimationFrame(this.cdSelectionId);

        this.lastFrameSel = null;

        this.cdSelectionId = requestAnimationFrame((tempo) => this.cdSelection(tempo, this.index))
    }

    onPreviewLeave()
    {
        // RETORNA CLASSES AO ORIGINAL
        this.card.classList.remove("hovered");
        this.card.classList.remove("not-hovered");

        videoPreview.classList.remove("video-show");
        overlay.classList.remove("video-show");


        // RESETA O VIDEO
        videoPreview.pause();
        videoPreview.currentTime = 0;

        // LIMPA TIMERS
        clearTimeout(this.videoTimer)

        // LIMPA VARIÁVEIS
        this.hovered = false;
        this.vidHovered = false;

        // RESETA BARRAS DE PROGRESSO
        this.progress = 200;

        cancelAnimationFrame(this.speedId);
        this.lastFrame = null;
        this.speedId = requestAnimationFrame((tempo) => this.speedChange(tempo, this.index));
    }

    // ROTAÇÃO DAS IMAGEMS


    // BARRA DE PROGRESSO

    cdSelection(tempo, selCard)
    {
        if (this.lastFrameSel == null) this.lastFrameSel = tempo;

        const diferenca = (tempo - this.lastFrameSel) / 1000;

        this.lastFrameSel = tempo;

        if (this.hovered || this.vidHovered){
            this.selectionRotation= Math.min(100, this.selectionRotation+ this.progress * diferenca      
            ); 
        }
        else {
            this.selectionRotation = Math.max(
                0,
                this.selectionRotation - this.progress * diferenca
            );
        }

        this.cdContainer[selCard].style.setProperty(
            "--progressoBarra",
            `${this.selectionRotation}%`
        );
        
        if (!this.hovered && this.selectionRotation > 0 || this.hovered && this.selectionRotation < 100

        ) {
            this.cdSelectionId = requestAnimationFrame((tempo) => this.cdSelection(tempo, selCard))
        };
    }

    speedChange(tempo, selCard)
    {
        // CALCULO PARA CONSISTÊNCIA ENTRE FRAMERATES

        if (this.lastFrame == null) this.lastFrame = tempo;

        const diferenca = (tempo - this.lastFrame) / 1000;

        this.lastFrame = tempo;

        if (this.hovered || this.vidHovered) {
            this.rotationAmount = Math.min(
                10,
                this.rotationAmount + rotationIncrement * diferenca
            );
        }
        else {
            this.rotationAmount = Math.max(
                0.1,
                this.rotationAmount - rotationIncrement * diferenca
            )
        }

        this.rotation += this.rotationAmount;

        this.cdImg[selCard].style.setProperty (
            "--rotation",
            `${this.rotation % 360}deg`
        )

        this.speedId = requestAnimationFrame ((tempo) => this.speedChange(tempo, selCard));
    }
}