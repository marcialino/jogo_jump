/*Variáveis do jogo*/

var canvas, ctx, ALTURA, LARGURA, frames = 0, maxPulos = 3, VELOCIDADE = 6, estadoAtual, record, img,

pontosParaNovaFase= [5,10,15,20]
faseAtual =0

labelNovaFase = {
    texto: "",
    opacidade:0.0,

    fadeIn:function(dt){
        var fadeInId = setInterval(function(){
            if(labelNovaFase.opacidade < 1.0)
                labelNovaFase.opacidade +=0.01
            else{
                clearInterval(fadeInId)
            }
        },10*dt)
    },

    fadeOut:function(dt){
        var fadeOutId = setInterval(function(){
            if(labelNovaFase.opacidade > 0.0)
                labelNovaFase.opacidade -=0.01

            else{
                clearInterval(fadeOutId)
            }
        },10*dt)
    }

},

estados ={
    jogar: 0,
    jogando: 1,
    perdeu: 2
},

/*Variável Chão*/ 
chao = {
    y:550,
    x:0,
    altura:50,
    
    atualiza:function(){
        this.x -= VELOCIDADE

        if(this.x <=-30)
            this.x +=30
    },

    desenha: function(){
       /*ctx.fillStyle = this.cor
        ctx.fillRect(0, this.y, LARGURA, this.altura)*/
        spriteChao.desenha(this.x, this.y)
        sprite.Chao.desenha(this.x + spriteChao.largura,this.y)
    }
}
bloco = {
    x:50,
    y:0,
    altura: spriteBoneco.altura,
    largura: spriteBoneco.largura,
    gravidade: 1.6,
    velocidade: 0,
    forcaDoPulo: 23.6,
    qntPulos: 0,
    score: 0,
    rotacao:0,

    vidas:3,
    colidindo:false,

    atualiza: function(){
        this.velocidade += this.gravidade
        this.y += this.velocidade
        this.rotacao += Math.PI/180 * VELOCIDADE

        if(this.y > chao.y - this.altura && estadoAtual != estados.perdeu){
            this.y = chao.y-this.altura
            this.qntPulos = 0
            this.velocidade = 0
        }
    },

    /*Para fazer o bloco pular*/
    pula: function(){
        if(this.qntPulos < maxPulos){
        this.velocidade = -this.forcaDoPulo
        this.qntPulos++
        }
    },

    reset:function(){
        this.velocidade = 0
        this.y = 0

        if(this.score > record) {
            record = this.score
            localStorage.setItem('record', this.score)
        }
        this.vida = 3
        this.score = 0

        VELOCIDADE = 6
        faseAtual = 0
        this.gravidade = 1.6
    },

    desenha: function(){
        /*ctx.fillStyle =this.cor
        ctx.fillRect(this.x, this.y, this.largura, this.altura)*/
        ctx.save()
        ctx.translate(this.x + this.largura/2, this.y + this.altura/2)
        ctx.rotate(this.rotacao)
        spriteBoneco.desenha(-this.largura/2, -this.altura/2)
        ctx.restore()
        
    }
},
obstaculos ={
    _obs: [],
    _scored:false,
    /*cores: ['#ffbc1c', '#ff1c1c', '#ff85e1','#52a7ff', '#78ff5d'],*/
    _sprites:[redObstacle, pinkObstacle, greenObstacle, yellowObstacle],

    timerInsere: 0,

    insere: function(){
        this._obs.push({
            x:LARGURA,
            y: chao.y - Math.floor(20 + Math.random()*100),

            /*largura: 30 + Math.floor(21 * Math.random()),*/
            largura: 50,
            sprite: this._sprites[Math.floor(this._sprites.length * Math.random())]
        })

        this.tempoInsere = 30 + Math.floor(20 * Math.random())
    },

    atualiza: function(){
        if(this.timerInsere == 0){
            this.insere()
        }else{
            this.timerInsere--
        }

        for(var i =0, tam = this._obs.length; i < tam; i++){
            var obj = this._obs[i]

            obj.x -= VELOCIDADE

            if(!bloco.colidindo && obj.x <= bloco.x + bloco.largura && bloco.x <= obj.x + obj.largura && obj.y <= bloco.y + bloco.altura){

                bloco.colidindo = true
                setTimeout(function () {  
                    bloco.colidindo = false
                },500)
                if(bloco.vidas >=1)
                    bloco.vidas --
                else{
                    estadoAtual = estados.perdeu
                }
               
            }
            else if(obj.x <=0 && !obj._scored){
                bloco.score++
                obj._scored = true

                if(faseAtual < pontosParaNovaFase.length && bloco.score == pontosParaNovaFase[faseAtual])
                    passarDeFase()
            }

            else if(obs.x <= -obs.largura){
                this._obs.splice(i, 1)
                tam--
                i--
            }
        }
    },

    limpa: function(){
        this._obs =[]
    },

    desenha: function(){
        for (var i = 0, tam = this._obs.length; i< tam; i++ ){
            var obj = this._obs[i]
            /*ctx.fillStyle = obs.cor
            ctx.fillRect(obs.x, chao.y - obs.altura, obs.largura, obs.altura)*/
            obj.sprite.desenha(obj.x, obj.y)
         }
    }
}


function clique(event){
    if(estadoAtual == estados.jogar){
        estadoAtual = estados.jogando
        frames = 0
    }
    else if(estadoAtual == estados.perdeu && bloco.y >= 2 * ALTURA){
        estadoAtual = estados.jogar
        obstaculos.limpa()
        bloco.reset()
   }
    else if(estadoAtual == estados.jogando){
        bloco.pula()

    }
  
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

    estadoAtual = estados.jogar

    record = localStorage.getItem('record')

    if (record == null)
        record = 0

    img = new Image()
    img.scr="imagens/sheet.png"
    
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

      if(estadoAtual == estados.jogando)  {
        obstaculos.atualiza()
      }
      
}
function desenha (){

    /*ctx.fillStyle ='#80daff'*/
    /*ctx.fillRect(0, 0, LARGURA, ALTURA)*/

    /*colocando imagem no background*/

    /*bg.desenha(0, 0)*/

    bg.desenha(0, 0)
    spriteBoneco.desenha(50, 50)
    

    ctx.fillStyle = '#fff'
    ctx.font = '50px Arial'
    ctx.fillText (bloco.score, 30, 68)

    if(estadoAtual == estados.jogar){
        ctx.fillStyle ='green'
        ctx.fillRect(LARGURA / 2 - 50, ALTURA / 2 -50, 100, 100)
    }

    else if(estadoAtual == estados.perdeu){
        ctx.fillStyle = 'red'
        ctx.fillRect(LARGURA / 2 - 50, ALTURA / 2 - 50, 100, 100)

        ctx.save()
        ctx.translate(LARGURA/2, ALTURA/2)
        ctx.fillStyle ='#fff'

        if(bloco.score > record)
            ctx.fillText('Novo Record! ', -150, -65)

        else if(record < 10)
            ctx.fillText('Record: ' + record, -99, -65)

        else if(record >= 10 && record < 100)
            ctx.fillText('Record: ' + record, -112, -65 )

        else
            ctx.fillText('Record: ', + record, -125, -65)
            
        if(bloco.score < 10)
            ctx.fillText(bloco.score, -13, 19)
        
        else if(bloco.score >=10 && bloco.score < 100)
            ctx.fillText(bloco.score,-26, 19)

        else
            ctx.fillText(bloco.score, -39, 19)
        
            ctx.restore()
    }
  
        else if(estadoAtual == estados.jogando){
            obstaculos.desenha()
        }
  
    chao.desenha()  /*Chamar a variável chão, para aparecer na tela.*/
    bloco.desenha()
    this.desenha()
}
 
    /*Função para inicializar o jogo*/
    main()
