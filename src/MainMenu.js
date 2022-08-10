Flappy.MainMenu = function(game) {};
Flappy.MainMenu.prototype = {
    create: function() {
        var style = {};

        //fondo
        //game.add.tileSprite(posX, posY, ancho, alto, elemento)
        this.scrollingbg = this.game.add.tileSprite(0, 0, 288, 505, 'fondo');
        
        //suelo
        this.ground = this.game.add.tileSprite(0, 400, 335, 112, 'suelo');
        
        //movimiento del fondo y del suelo
        //objeto.autoScroll(velocidadX,velocidadY);
        this.ground.autoScroll(-50,0);
        this.scrollingbg.autoScroll(-10,0);
        
        //crear titulo y jugador
        this.grupoTitulo = this.game.add.group();
        
        //crear sprite titulo y agregar a grupo
        this.titulo = this.game.add.sprite(0,0,'titulo');
        this.grupoTitulo.add(this.titulo);
        
        //crear sprite jugador y agregar a grupo
        this.jugador = this.game.add.sprite(200,5,'jugador');
        this.grupoTitulo.add(this.jugador);
        
        //añadir animacion al jugador
        this.jugador.animations.add('flap');
        this.jugador.animations.play('flap',12,true);
        
        //cambiar la localizacion del grupo
        this.grupoTitulo.x = 30;
        this.grupoTitulo.y = 100;
        
        //animacion oscilante
        this.game.add.tween(this.grupoTitulo).to({y:90}, 350, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
        
        //boton inicio
        //game.add.button(x,y,elemento,metodo,contexto);
        this.botonInicio = this.game.add.button(this.game.width/2, 300, 'botonInicio', this.iniciaJuego, this);
        
        //define el punto central del boton
        this.botonInicio.anchor.setTo(0.5,0.5); 
        
    },
    iniciaJuego: function() {
        this.state.start('Game');
    }
};