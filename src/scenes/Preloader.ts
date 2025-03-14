import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');

        this.load.image("background_0", 'stringstar-fields/background_0.png');
        this.load.image("background_1", 'stringstar-fields/background_1.png');
        this.load.image("background_2", 'stringstar-fields/background_2.png');
        this.load.image("tileset", 'stringstar-fields/tile.png');
        this.load.image('asteroid', 'asteroids/asteroid.png'); 
        this.load.image('small_asteroid', 'asteroids/small_asteroid.png'); 
        this.load.image('large_asteroid', 'asteroids/large_asteroid.png'); 
        this.load.spritesheet("dino", 'dino-characters/sheets/dino.png', { frameWidth: 24, frameHeight: 24 });
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
