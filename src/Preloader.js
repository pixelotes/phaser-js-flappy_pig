Flappy.Preloader = function(game){
    //Variables generales
    Flappy.GAME_WIDTH = 288;
    Flappy.GAME_HEIGHT = 505;
};
Flappy.Preloader.prototype = {
    preload: function() {
        //Barra de carga
        this.stage.backgroundColor = '#B4D9E7';
        this.preloadBar = this.add.sprite((Flappy.GAME_WIDTH-311)/2,
            (Flappy.GAME_HEIGHT-27)/2, 'preloaderBar');
        this.load.setPreloadSprite(this.preloadBar);
 
        //Carga los recursos que vamos a utilizar en el juego
        this.load.image('fondo', 'assets/background.png');
        this.load.image('suelo', 'assets/ground.png');
        this.load.image('titulo', 'assets/title.png');
        this.load.image('botonInicio', 'assets/start-button.png');
        this.load.image('pipe', 'assets/pipes.png');
        this.load.image('tubI', 'assets/tubI.png');
        this.load.image('tubS', 'assets/tubS.png');
        this.load.image('pause', 'assets/button-pause.png');
        this.load.image('fondogo', 'assets/scoreboard.png');
        
        this.load.audio('sfxflap', 'assets/flap.wav');
        this.load.audio('sfxouch', 'assets/ouch.wav');
        this.load.audio('sfxscore', 'assets/score.wav');
        this.load.audio('ingamemus', 'assets/ingame.mp3');

        this.load.spritesheet('jugador', 'assets/pig.png', 34, 24, 3);
        
        this.load.bitmapFont('flappyfont', 'assets/fonts/flappyfont/flappyfont.png', 'assets/fonts/flappyfont/flappyfont.fnt');  
    },
    create: function() {
        //Cuando termina de cargar recursos ejecuta el menú principal
        this.state.start('MainMenu');
    }
};