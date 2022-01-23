class Hero {
    constructor(game, x) {
        this.game = game;
        this.x = x + 1200;
        this.spritesheet = ASSET_MANAGER.getAsset("./defender.png");
        //this.animation = new Animator(this.spritesheet,86,908,96,104,10,0.1,2,false,true);
        this.loadProperties();
        this.animations = [];
        this.loadAnimation();
    };

    loadProperties() {
        this.timeElapsed = 0;
       

        this.IDLE = 0;
        this.WALKING = 1;
        this.ATTACKING = 2;
        this.GROUND = 480;
        this.MAX_WALK = 2;

        this.y = this.GROUND;
        this.state = this.WALKING; //3 states, IDLE, WALKING, ATTACKING
        
    }

    loadAnimation() {
        /*
        this.idleAnimation = [];
        this.idleAnimation[0] = new Animator(this.spritesheet,88,1200,80,104,10,0.1,0,false,true);
        
        this.walkAnimation = [];
        this.walkAnimation[0] = new Animator(this.spritesheet,88,907,96,104,10,0.1,1.5,true,true);

        this.attackAnimation = [];
        this.attackAnimation[0] = new Animator(this.spritesheet,88,315,128,120,10,0.03,0.5,false,false);
        */
        for (var i = 0; i < 3; i++) {
            this.animations.push([]);
        }

        this.animations[this.IDLE] = new Animator(this.spritesheet,80,1200,80,104,10,0.1,0,false,true);
        this.animations[this.WALKING] = new Animator(this.spritesheet,91,907,96,104,10,0.1,1.5,true,true);
        this.animations[this.ATTACKING] = new Animator(this.spritesheet,88,315,128,120,10,0.1,0.5,false,false);
  
    }

    update() {
        const TICK = this.game.clockTick;
        if (this.state == this.WALKING) {
            if (this.timeElapsed < 0.5) {
                this.x -= this.MAX_WALK;
                this.timeElapsed += TICK;
            } else {
                this.timeElapsed = 0;
                this.state = this.ATTACKING;
            }
        } else if (this.state == this.ATTACKING) {
            if (this.animations[this.ATTACKING].isDone()) {
                this.state = this.WALKING;
                this.animations[this.ATTACKING].elapsedTime = 0;
            }
        }
    };

    

    draw(ctx) {
        /*
        this.idleAnimation[0].drawFrame(this.game.clockTick,ctx,0,0,1); //idle left
        this.idleAnimation[0].drawFrameReverse(this.game.clockTick,ctx,64,0,1); //idle right
        this.walkAnimation[0].drawFrame(this.game.clockTick,ctx,0,128*2,1); //walk left
        this.walkAnimation[0].drawFrameReverse(this.game.clockTick,ctx,64,128*2,1); //walk right
        this.attackAnimation[0].drawFrame(this.game.clockTick,ctx,0,128,1); //attack left
        this.attackAnimation[0].drawFrameReverse(this.game.clockTick,ctx,64,128,1); //attack right
        */
        if (this.state == this.ATTACKING) {
            this.animations[this.ATTACKING].drawFrame(this.game.clockTick,ctx,this.x - 40,this.y - 35,1.5); 

        } else {
            this.animations[this.state].drawFrame(this.game.clockTick,ctx,this.x,this.y,1.5); 
        }
        

        // var offscreenCanvas = document.createElement('canvas');
        // offscreenCanvas.width = 128;
        // offscreenCanvas.hieght = 128;
        // var offscreenCtx = offscreenCanvas.getContext('2d');
        // offscreenCtx.save();
        // offscreenCtx.scale(-1,1);
        // this.walkAnimation[0].drawFrame(this.game.clockTick,offscreenCtx,-100,0,1);
        // offscreenCtx.restore();
        // ctx.drawImage(offscreenCanvas,this.x,100);

        
    };
};