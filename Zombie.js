class Zombie {

    constructor(game) {
        this.game = game;
        //this.animator = new Animator(ASSET_MANAGER.getAsset("./zombie.png"), 16, 64, 64, 64, 
        //    7, 0.15, 0, false, true);

        this.spritesheet = ASSET_MANAGER.getAsset("./zombie.png");
        
        this.loadProperties();
        this.animations = [];
        this.loadAnimations();
    };

    loadAnimations() {
        for (var i = 0; i < 3; i++) { // 3 states (0 = IDLE, 1 = WALKING, 2 = RUNNING)
            this.animations.push([]);
                for (var j = 0; j < 2; j++) { // two facings (0 = LEFT, 1 = RIGHT)
                    this.animations[i].push([]);
                }
        }

        //facing left
        this.animations[0][0] = new Animator(this.spritesheet, 16, 128, 64, 64, 1, 0.15, 0, false, true); //IDLE
        this.animations[1][0] = new Animator(this.spritesheet, 16, 128, 64, 64, 7, 0.20, 0, false, true); //WALKING
        this.animations[2][0] = new Animator(this.spritesheet, 16, 128, 64, 64, 7, 0.10, 0, false, true); //RUNNING

        //facing right
        this.animations[0][1] = new Animator(this.spritesheet, 16, 64, 64, 64, 1, 0.15, 0, false, true); //IDLE
        this.animations[1][1] = new Animator(this.spritesheet, 16, 64, 64, 64, 7, 0.20, 0, false, true); //WALKING
        this.animations[2][1] = new Animator(this.spritesheet, 16, 64, 64, 64, 7, 0.10, 0, false, true); //RUNNING

        this.deadAnim = new Animator(this.spritesheet, 144, 384, 64, 64, 5, 0.15, 0, false, false); //DEAD
        this.undeadAnim = new Animator(this.spritesheet, 144, 384, 64, 64, 5, 0.15, 0, true, false); //UNDEAD
    }

    loadProperties() {
        //facing
        this.LEFT = 0;
        this.RIGHT = 1;

        //states
        this.IDLE = 0;
        this.WALKING = 1;
        this.RUNNING = 2;

        //jumpingState
        this.JUMPING = false;
        this.HITMAXPEAK = false;

        //basic restrictions
        this.GROUND = 450;
        this.MAX_RUN = 600;
        this.MAX_WALK = 200;
        this.ACCELERATION = 20;
        this.GRAVITY = 400;

        //initial
        this.undead = false;
        this.dead = false;
        this.x = 0;
        this.y = this.GROUND;
        this.state = this.IDLE;
        this.facing = this.RIGHT;
        this.velocity = {x: 0,y: 0};
    }

    horizontalUpdate() { //Updates left and right movement
        if (this.game.left && !this.game.right) {
            this.facing = this.LEFT;
            if (this.game.run) {
                this.state = this.RUNNING;
                if (Math.abs(this.velocity.x) <= this.MAX_RUN) {
                    this.velocity.x -= this.ACCELERATION; 
                } else {
                    this.velocity.x = this.velocity.x = (this.MAX_RUN) * (-1);
                }
            } else {
                this.state = this.WALKING;
                if (Math.abs(this.velocity.x) <= this.MAX_WALK) {
                    this.velocity.x -= this.ACCELERATION; 
                } else {
                    this.velocity.x = (this.MAX_WALK) * (-1);
                }
            }
 
           
        } else if (this.game.right && !this.game.left) {
            this.facing = this.RIGHT;
            if (this.game.run) {
                this.state = this.RUNNING;
                if (Math.abs(this.velocity.x) <= this.MAX_RUN) {
                    this.velocity.x += this.ACCELERATION; 
                } else {
                    this.velocity.x = this.velocity.x = (this.MAX_RUN);
                }
            } else {
                this.state = this.WALKING;
                if (Math.abs(this.velocity.x) <= this.MAX_WALK) {
                    this.velocity.x += this.ACCELERATION; 
                } else {
                    this.velocity.x = this.MAX_WALK;
                }
            }
        } else if (this.game.down) {
            this.dead = true;
        } else {
            this.velocity.x = 0;
            this.state = this.IDLE;
        }  
    } 

    noJumpUpdate() {
        if (!this.game.down) {
            this.horizontalUpdate();
            if (this.game.up) {
                this.velocity.y -= this.GRAVITY;
                this.JUMPING = true;
                this.game.up = false;
            } 
        }
        else if (this.game.down && !this.game.up) {
            this.dead = true;
        }
    }

    jumpUpdate() {
        this.horizontalUpdate();
        if (!this.HITMAXPEAK) {
            this.velocity.y -= 100;
            if (Math.abs(this.velocity.y) >= 2750) {
                this.velocity.y = 0;
                this.HITMAXPEAK = true;
            }
        } else {
            if (this.y >= this.GROUND) {
                this.velocity.y = 0;
                this.y = this.GROUND;
                this.JUMPING = false;
                this.HITMAXPEAK = false;
            } else this.velocity.y += 10;
        }
    }

    XYupdate(TICK) {
        this.x += this.velocity.x * TICK;
        this.y += this.velocity.y * TICK;
    }

    gravityUpdate(TICK) {
        if (this.y < this.GROUND) {
            this.y += this.GRAVITY * TICK;
        } 
    }

    //if in a dead state
    deadUpdate() {
        this.velocity.x = 0;
        this.velocity.y = 0;
        if (!this.undead) {
            if(this.game.up) {
                this.undead = true;
                this.game.up = false;
            }
        } else {
            if (this.undeadAnim.isDone()) {
                this.undead = false;
                this.dead = false;
                this.undeadAnim.elapsedTime = 0;
                this.deadAnim.elapsedTime = 0;
            }
        }
        
    }

    update() {
        const TICK = this.game.clockTick;
        this.gravityUpdate(TICK);
        if (!this.JUMPING) {
            if(!this.dead) {
                this.noJumpUpdate();
            } else {
                this.deadUpdate();
            }
        } else if (this.JUMPING) {
            this.jumpUpdate();
        }
        this.XYupdate(TICK); 
    }

    draw(ctx) {
        if (this.dead) {
            if (this.undead) {
                this.undeadAnim.drawFrame(this.game.clockTick, ctx, this.x, this.y, PARAMS.SCALE);
            } else if (!this.undead) {
                this.deadAnim.drawFrame(this.game.clockTick, ctx, this.x, this.y, PARAMS.SCALE);
            }

        } else {
            this.animations[this.state][this.facing].drawFrame(this.game.clockTick, ctx, this.x, this.y, PARAMS.SCALE);
        }
    }

}