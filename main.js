const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

//images
ASSET_MANAGER.queueDownload("./zombie.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	//entities
	gameEngine.addEntity(new Zombie(gameEngine))

	gameEngine.init(ctx);

	gameEngine.start();
});

entit
