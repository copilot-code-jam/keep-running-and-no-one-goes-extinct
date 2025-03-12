import { Scene } from 'phaser';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    backgrounds: Phaser.GameObjects.Image[];
    msg_text: Phaser.GameObjects.Text;
    ground: Phaser.GameObjects.Image;
    dino!: Phaser.GameObjects.Sprite;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    asteroids!: Phaser.Physics.Arcade.Group;
    asteroidKeys: string[];    

    constructor() {
        super('Game');
        this.asteroidKeys = ["small_asteroid", "large_asteroid", 'asteroid']; // Define asteroid keys
    }

    create() {
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
        this.dino = this.physics.add.sprite(groundTopCenterPosition.x, groundTopCenterPosition.y, 'dino').setScale(3).setDepth(4);

        this.dino.play('run');
        this.cursors = this.input.keyboard?.createCursorKeys();

        // Create a group for asteroids
        this.asteroids = this.physics.add.group({
            defaultKey: 'large_asteroid',
            maxSize: 10
        });



        // Spawn asteroids at random intervals
        this.time.addEvent({
            delay: 1000,
            callback: this.spawnAsteroid,
            callbackScope: this,
            loop: true
        });



        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });

        this.physics.add.overlap(
            this.dino,
            this.asteroids,
            this.handleCollision,
            null,
            this
          );
    }


    spawnAsteroid() {
        const x = Phaser.Math.Between(0, this.cameras.main.width);
        const key = Phaser.Math.RND.pick(this.asteroidKeys);
        const asteroid = this.asteroids.get(x, 0, key);

        if (asteroid) {
            asteroid.setActive(true);
            asteroid.setVisible(true);
            asteroid.setVelocityY(200);
            asteroid.setDepth(4);
            asteroid.setVelocity(
                Phaser.Math.Between(-100, 100), // x velocity for some variety
                Phaser.Math.Between(150, 300) // y velocity (falling speed)
              );
              // Add rotation
    asteroid.setAngularVelocity(Phaser.Math.Between(-100, 100));

        }
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

        // this.physics.world.collide(this.dino, this.asteroids, this.handleCollision, undefined, this);
    }

    handleCollision(dino: Phaser.GameObjects.Sprite, asteroid: Phaser.GameObjects.Image) {
        // Handle collision (e.g., end game, reduce health, etc.)
        // Stop game
    this.gameOver = true;

    // Stop player animation and movement
    this.dino.anims.stop();
    this.asteroids.setVelocity(0, 0);

    // Tint the player red to indicate death
    this.dino.setTint(0xff0000);

    // Show game over message
    const gameOverText = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        "GAME OVER\nExtinction by asteroid!",
        {
          fontFamily: "Arial",
          fontSize: "48px",
          color: "#ff0000",
          stroke: "#000000",
          strokeThickness: 6,
          align: "center",
        }
      )
      .setOrigin(0.5)
      .setDepth(10);

    // Shake camera for impact effect
    this.cameras.main.shake(500, 0.05);
    }
}
