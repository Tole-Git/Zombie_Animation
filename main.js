const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

//images
ASSET_MANAGER.queueDownload("./zombie.png");
ASSET_MANAGER.queueDownload("./cemetary.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	//entities
	gameEngine.addEntity(new Zombie(gameEngine));
	gameEngine.addEntity(new Cemetary(gameEngine, 1, 1));


	gameEngine.init(ctx);

	gameEngine.start();
});

