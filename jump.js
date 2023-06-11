var canvas, ctx, ALTURA, LARGURA, frames = 0, maxPulos = 3,

/*Variável Chão*/ 
chao = {
    y:550,
    altura:50,
    cor:'#ffdf70',

    desenha: function(){
        ctx.fillStyle = this.cor
        ctx.fillRect(0, this.y, LARGURA, this.altura)
    }
}
bloco = {
    x:50,
    y:0,
    altura: 50,
    largura: 50,
    cor:'#ff4e4e',
    gravidade: 1.5,
    velocidade: 0,
    forcaDoPulo: 15,
    qntPulos: 0,

    atualiza: function(){
        this.velocidade += this.gravidade
        this.y += this.velocidade

        if(this.y > chao.y - this.altura){
            this.y = chao.y-this.altura
            this.qntPulos = 0
        }
    },

    /*Para fazer o bloco pular*/
    pula: function(){
        if(this.qntPulos < maxPulos){
        this.velocidade = -this.forcaDoPulo
        this.qntPulos++
        }
    },

    desenha: function(){
        ctx.fillStyle =this.cor
        ctx.fillRect(this.x, this.y, this.largura, this.altura)

    }
}


function clique(event){
    bloco.pula()
}
function main (){
    ALTURA = window.innerHeight
    LARGURA = window.innerWidth

    if (LARGURA >=500){
        LARGURA = 600
        ALTURA = 600
    }
    canvas = document.createElement('canvas')
    canvas.width = LARGURA
    canvas.height = ALTURA
    canvas.style.border ='1px solid #000'

    ctx = canvas.getContext('2d')/*contexto:textos e imagens*/

    document.body.appendChild(canvas)/*código para adicionar o canvas no Html*/

    /*Para saber se a pessoa clicou*/ 
    document.addEventListener('mousedown',clique)
    
    roda()

}
function roda(){
    atualiza()
    desenha()

    window.requestAnimationFrame(roda)/*criar um loop*/ 

}
function atualiza(){
    frames++

    bloco.atualiza()
}
function desenha (){
    ctx.fillStyle ='#50beff'
    ctx.fillRect(0, 0, LARGURA, ALTURA)

    chao.desenha()  /*Chamar a variável chão, para aparecer na tela.*/
    bloco.desenha()
}
 
    /*Função para inicializar o jogo*/
    main()
