class Cemetary {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});
        this.spritesheet = ASSET_MANAGER.getAsset("./cemetary.png");

    };
    update () {

    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet, 0, 0, 1280, 720);
    
    };
}