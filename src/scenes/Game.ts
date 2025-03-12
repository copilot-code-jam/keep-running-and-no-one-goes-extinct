import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    backgrounds: Phaser.GameObjects.Image[]; 
    msg_text : Phaser.GameObjects.Text;
    ground: Phaser.GameObjects.Image;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.backgrounds = [];
        // this.camera.setBackgroundColor(0x00ff00);

         // Add multiple background layers
         const backgroundLayers = ['background_0', 'background_1', 'background_2'];
        
         backgroundLayers.forEach((key, index) => {
             const bg = this.add.image(0, 0, key)
                 .setOrigin(0, 0)
                 .setDisplaySize(
                     this.cameras.main.width,
                     this.cameras.main.height
                 )
                 .setDepth(index); // Set layer order
             
             this.backgrounds.push(bg);
         });
 
         // Optional: Adjust alpha for each layer
         this.backgrounds[0].setAlpha(1);    // Back layer
         this.backgrounds[1].setAlpha(0.8);  // Middle layer
         this.backgrounds[2].setAlpha(0.6); 

         this.ground = this.add.image(0, this.cameras.main.height - 32, 'tileset')
         .setOrigin(0, 0)  // Anchor to bottom-left
         .setCrop(0, 200, 288, 176)  // Adjust these values based on your tileset
         .setDisplaySize(this.cameras.main.width, 32); // Make it stretch across screen

        // Ensure ground is on top of backgrounds
        this.ground.setDepth(3);

        // this.msg_text = this.add.text(512, 384, 'Make something fun!', {
        //     fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
        //     stroke: '#000000', strokeThickness: 8,
        //     align: 'center'
        // });
        // this.msg_text.setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });
    }
}
