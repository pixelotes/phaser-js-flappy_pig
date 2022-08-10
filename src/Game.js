Flappy.Game = function (game) {
    //variables globales
    this.puntuacion = 0; //puntuacion inicial
    this.velocidad = -200; //velocidad del scroll
    this.gravedad = 1200; //gravedad del mundo
    this.distancia = 1.40; //distancia entre tuberias
    this.salto = -400; //fuerza del salto
    this.distub = 120; //distancia entre tuberias
    this.maximo = 0;
    this.chequeo = true;
    this.guardado = false;
    
};
Flappy.Game.prototype = {
    create: function () {
        
        this.chequeo = true;
        
        //inicia el motor de fisicas
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //configura la gravedad
        this.game.physics.arcade.gravity.y = this.gravedad;
        
        //agrega audio
        this.sfxflap = this.game.add.audio('sfxflap');
        this.sfxouch = this.game.add.audio('sfxouch');
        this.sfxscore = this.game.add.audio('sfxscore')
        this.ingamemusic = this.game.add.audio('ingamemus');
        
        //añade el fondo
        this.scrollingbg = this.game.add.tileSprite(0, 0, 288, 505, 'fondo');   
                    
        this.tuberias = this.game.add.group();
        
        //crea tuberias
        this.pipeGen = this.game.time.events.loop(Phaser.Timer.SECOND * this.distancia, this.creaPipes, this);
        this.pipeGen.timer.start();
        
        //suelo
        this.suelo = this.game.add.tileSprite(0, 400, 335, 112, 'suelo');
        //movimiento del fondo y del suelo
        //objeto.autoScroll(velocidadX,velocidadY);
        this.suelo.autoScroll(this.velocidad, 0);
        this.scrollingbg.autoScroll(this.velocidad / 5, 0);

        // Crea un nuevo objeto Jugador
        this.jugador = this.game.add.sprite(50, 50, 'jugador');
        this.jugador.anchor.setTo(0.5, 0.5);

        //Anima al jugador
        this.jugador.animations.add('flap');
        this.jugador.animations.play('flap', 12, true);

        //Fisicas
        this.game.physics.enable(this.jugador, Phaser.Physics.ARCADE);
        this.game.physics.enable(this.suelo, Phaser.Physics.ARCADE);
        this.suelo.body.allowGravity = false; //Hace que el suelo no caiga por la gravedad
        this.suelo.body.immovable = true; //Hace que el suelo no se vea afectado por las colisiones

        this.jugador.body.collideWorldBounds = true; //impide que el jugador pueda salir de la pantalla

        //controles
        //añadimos un listener a la barra espaciadora, que ejecuta el método aleteo() al ser pulsada
        //addkey(tecla).evento.add(metodo,contexto);
        this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.aleteo, this);
        
        // Create touch area
        this.touchArea = this.game.add.sprite(0, 0);
        this.touchArea.width = this.game.width;
        this.touchArea.height = this.game.height;
        this.touchArea.inputEnabled  = true;
        this.touchArea.events.onInputDown.add(this.aleteo, this);
        
        //crea el marcador
        this.marcador = this.game.add.bitmapText(this.game.width/2, 10, 'flappyfont',this.puntuacion.toString(), 24);
        this.marcador.visible = true;
        
        //crea el boton de pausa
        this.add.button(this.game.width-58, 10, 'pause', this.managePause, this);
        
        //crea la pantalla de Game Over
        this.alturamedia = this.game.height/2;
        this.alturamedia = -100;
        this.gameoverscr = this.game.add.group(); //creamos un grupo para la pantalla game over
        this.gameoverbg = this.game.add.sprite(this.game.width/2, this.alturamedia, 'fondogo');
        this.gameoverbg.anchor.setTo(0.5,0.5);   
        this.gameoverpuntos = this.game.add.bitmapText(this.game.width/2+83, this.alturamedia-22, 'flappyfont',this.puntuacion.toString(), 24);
        this.gameovermaxpuntos = this.game.add.bitmapText(this.game.width/2+83, this.alturamedia+25, 'flappyfont',this.maximo.toString(), 24);
        this.gameoverscr.add(this.gameoverbg);
        this.gameoverscr.add(this.gameoverpuntos);
        this.gameoverscr.add(this.gameovermaxpuntos);
        
        this.ingamemusic.play('');

    },

    managePause: function () {
        this.game.paused = true;
        var pausedText = this.add.text(this.game.width/2, 250, "Partida en pausa.\nToca para reanudar.", this._fontStyle);
        pausedText.anchor.setTo(0.5, 0.5);
        this.input.onDown.add(function () {
            pausedText.destroy();
            this.game.paused = false;
        }, this);
    },

    update: function () {
        //this.game.physics.arcade.collide(this.jugador, this.suelo);
        this.game.physics.arcade.collide(this.jugador, this.suelo, this.choquesuelo, null, this);
        this.game.physics.arcade.collide(this.jugador, this.tuberias, this.findeljuego, null, this);

        //Vuelve a inclinar al jugador poco a poco hacia abajo
        if (this.jugador.angle < 45) {
            this.jugador.angle += 2.5;
        }
        
        //Comprueba la puntuación
        this.checkPuntos();
    },
    
    choquesuelo: function() {
        this.findeljuego(true);
    },
    
    aleteo: function () {
        this.jugador.body.velocity.y = this.salto;

        // rota al jugador -40 grados
        this.game.add.tween(this.jugador).to({
            angle: -40
        }, 100).start();
        this.sfxflap.play('');
    },
  
    //segunda versión. hace bajar un menú más elaborado
    findeljuego: function (suelo) {
        if(this.chequeo){this.sfxouch.play('',0,1,false);}
        if(suelo){if(this.chequeo){this.chequeo = false;}}
        if(this.puntuacion > this.maximo) {
            this.maximo = this.puntuacion;
        }
        this.puntostmp = this.puntuacion;
        
        this.gameovermaxpuntos.setText(this.maximo.toString());
        this.pipeGen.timer.stop();     
        this.suelo.autoScroll(0,0);
        this.scrollingbg.autoScroll(0,0);
        this.tuberias.setAll('body.velocity.x',0);
        this.game.add.tween(this.gameoverscr).to({y:this.game.height/2+100}, 100, Phaser.Easing.Linear.NONE, true);

        this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.reiniciar, this);
        this.touchArea.events.onInputDown.add(this.reiniciar, this);
        
    },
    
    guardarPuntuacion: function () {
    	
			var params = {
				"guardar" : true, //automático
				"idjuego" : parent.location.search.split('id=')[1], //automático
				"puntuacion" : this.puntostmp, //variable que contiene la puntuación
				"userid" : parent.document.getElementById('userid').value, //automático
				"dificultad" : 1 //1-fácil, 2-medio, 3-difícil
				}
			$.ajax({
				data: params,
				url: '//localhost/prj/puntuaciones.php',
				type: 'post',
				beforeSend: function () {
					
				},
				success: function(response) {
					//refrescar tabla de puntuaciones parent
					parent.refreshRanking();
					
				}
			});
		
		
    },
    
    //hace una petición ajax que comprueba si el logro ya existe para el usuario y el juego. De no ser así, lo guarda y muestra un toast con el nombre del juego.
    guardarLogros: function (idlog, nomlog, tipolog) {
		var params = {
				"guardar" : true, //automático
				"idjuego" : parent.location.search.split('id=')[1], //automático
				"idusuario" : parent.document.getElementById('userid').value, //automático
				"idlogro" : idlog,
				"nombrelogro" : nomlog,
				"tipologro" : tipolog
				}
			$.ajax({
				data: params,
				url: '//localhost/prj/logros.php',
				type: 'post',
				beforeSend: function () {
					
				},
				success: function(response) {
					//lanzar notificacion segun respuesta
					if(response.length > 8) {
						$.notify(response, {globalPosition: 'top left', className: 'success'});
					}
				}
			});
	},
	
	//Método para comprobar logros. Las condiciones variarán para cada juego, pero deben llamar a guardarLogros(idlogro,texto,tipo)
	checkLogros: function () {
		if(this.puntuacion >= 10) {
			if(this.puntuacion >= 20) {
				if(this.puntuacion >= 30) {
					this.guardarLogros(3, 'Dios de la fontaneria', 3);
					setTimeout(function(){}, 300);
					this.guardarLogros(2, 'Manitas', 2);
					setTimeout(function(){}, 300);
					this.guardarLogros(1, 'Aprendiz de fontanero', 1);
					setTimeout(function(){}, 300);
					
				} else {
					this.guardarLogros(2, 'Manitas', 2);
					setTimeout(function(){}, 300);
					this.guardarLogros(1, 'Aprendiz de fontanero', 1);
					setTimeout(function(){}, 300);
				}
			} else {
				this.guardarLogros(1, 'Aprendiz de fontanero', 1);
				setTimeout(function(){}, 300);
			}		
		}
		
	},
    
    reiniciar: function() {
    	this.guardarPuntuacion();
    	this.puntuacion = 0;
        this.state.start('Game');
    },
    
    creaPipes: function () {
        
        //this.tuberias = this.game.add.group(); //creamos un grupo de sprites
        
        var alt = this.game.rnd.integerInRange(170, 330); //altura aleatoria
        
        //Creamos los sprites
        this.tuberiaI = this.game.add.sprite(300, alt, 'tubI');
        this.tuberiaS = this.game.add.sprite(300, alt - this.tuberiaI.height - this.distub, 'tubS');

        //Añadimos las dos tuberías al grupo
        this.tuberias.add(this.tuberiaI);
        this.tuberias.add(this.tuberiaS);

        //Añadimos propiedades a todos los elementos del grupo a la vez
        this.game.physics.enable(this.tuberias, Phaser.Physics.ARCADE);
        this.tuberias.setAll('body.allowGravity',false);
        this.tuberias.setAll('body.immovable',true);
        this.tuberias.setAll('body.velocity.x',this.velocidad);
        
        this.tuberiaI.puntuado = false;
        
        this.suelo.bringToTop;
    },
    
    checkPuntos: function () {
        //if(this.tuberias.exists && this.tuberias.tuberiaI.world.x <= this.jugador.world.x) {
        if(this.tuberiaI) {
            if(this.tuberiaI.world.x<=this.jugador.world.x) {
                    if(this.tuberiaI.puntuado == false) {
                        this.puntuacion++;
                        this.marcador.setText(this.puntuacion.toString());
                        this.gameoverpuntos.setText(this.puntuacion.toString());
                        this.sfxscore.play('');
                        this.checkLogros();
                    }
                    if(this.tuberiaI.puntuado == false) {
                        this.tuberiaI.puntuado = true;
                    }
            }
        }
        
    }
};