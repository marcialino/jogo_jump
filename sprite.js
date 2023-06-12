class Sprite {
    constructor(x, y, largura, altura) {
        this.x = x
        this.y = y
        this.largura = largura
        this.altura = altura

        /*Para desenhar imagem
        x e y do desenho, largura e altura da imagem e x e y da Canvas, base do jogo.*/

        this.desenha = function (xCanvas, yCanvas) {
            ctx.drawImage(img, this.x, this.y, this.largura, this.altura, xCanvas, yCanvas, this.largura, this.altura)
        }
    }
}

var bg = new Sprite(0, 0, 600, 600)/*br= background. Coordenadas da imagem sheet.*/
spriteBoneco = new Sprite(618, 16, 87, 87)