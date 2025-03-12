import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    backgrounds: Phaser.GameObjects.Image[]; 
    msg_text : Phaser.GameObjects.Text;
    ground: Phaser.GameObjects.Image;
    dino!: Phaser.GameObjects.Sprite;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

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


        //  this.ground = this.add.image(0, this.cameras.main.height, 'tileset')
        //  .setOrigin(0, 1)  // Anchor to bottom-left
        //  .setCrop(0, 150, 288, 288)  // Adjust these values based on your tileset
        //  .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

         // Add the tileset overlay
        
        this.ground = this.add.image(0, this.cameras.main.height, 'tileset')
        .setOrigin(0, 1)  // Anchor to bottom-left
        .setDisplaySize(this.cameras.main.width, 100);

        this.ground.setDepth(3);

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('dino', {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1  // -1 means loop forever
        });

        const groundTopCenterPosition = this.ground.getTopCenter();
    
        // Create sprite and play animation
        this.dino = this.add.sprite(groundTopCenterPosition.x, groundTopCenterPosition.y, 'dino').setScale(3).setDepth(4);

        this.dino.play('run');
        this.cursors = this.input.keyboard?.createCursorKeys();




        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });
    }


    update() {
        const speed = 4;
        // Calculate boundaries based on sprite width and screen width
        const leftBound = this.dino.displayWidth / 2;
        const rightBound = this.cameras.main.width - (this.dino.displayWidth / 2);
    
        if (this.cursors.left.isDown && this.dino.x > leftBound) {
            this.dino.x -= speed;
            this.dino.setFlipX(true);
        }
        else if (this.cursors.right.isDown && this.dino.x < rightBound) {
            this.dino.x += speed;
            this.dino.setFlipX(false);
        }
    }
}
