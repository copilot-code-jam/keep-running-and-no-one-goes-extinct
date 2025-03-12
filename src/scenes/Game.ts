import { Scene } from "phaser";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  backgrounds: Phaser.GameObjects.Image[];
  msg_text: Phaser.GameObjects.Text;
  ground: Phaser.GameObjects.Image;
  dino!: Phaser.GameObjects.Sprite;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  // New properties for asteroids
  asteroids!: Phaser.Physics.Arcade.Group;
  nextAsteroidTime: number = 0;
  asteroidSpawnRate: number = 1500; // ms between asteroid spawns
  gameOver: boolean = false;

  constructor() {
    super("Game");
  }

  create() {
    this.camera = this.cameras.main;
    this.backgrounds = [];
    // this.camera.setBackgroundColor(0x00ff00);

    // Add multiple background layers
    const backgroundLayers = ["background_0", "background_1", "background_2"];

    backgroundLayers.forEach((key, index) => {
      const bg = this.add
        .image(0, 0, key)
        .setOrigin(0, 0)
        .setDisplaySize(this.cameras.main.width, this.cameras.main.height)
        .setDepth(index); // Set layer order

      this.backgrounds.push(bg);
    });

    // Optional: Adjust alpha for each layer
    this.backgrounds[0].setAlpha(1); // Back layer
    this.backgrounds[1].setAlpha(0.8); // Middle layer
    this.backgrounds[2].setAlpha(0.6);

    // Add the tileset overlay
    this.ground = this.add
      .image(0, this.cameras.main.height, "tileset")
      .setOrigin(0, 1) // Anchor to bottom-left
      .setDisplaySize(this.cameras.main.width, 100);

    this.ground.setDepth(3);

    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("dino", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1, // -1 means loop forever
    });

    const groundTopCenterPosition = this.ground.getTopCenter();

    // Create sprite and play animation
    this.dino = this.physics.add
      .sprite(groundTopCenterPosition.x, groundTopCenterPosition.y, "dino")
      .setScale(3)
      .setDepth(4);

    this.dino.play("run");
    this.cursors = this.input.keyboard?.createCursorKeys();

    // Create asteroid group
    this.asteroids = this.physics.add.group();

    // Set up collision between dino and asteroids
    this.physics.add.overlap(
      this.dino,
      this.asteroids,
      this.handleAsteroidCollision,
      null,
      this
    );

    // Add warning text
    this.msg_text = this.add
      .text(this.cameras.main.centerX, 50, "Watch out for falling asteroids!", {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(5);

    // Initialize asteroid spawning
    this.nextAsteroidTime = this.time.now + this.asteroidSpawnRate;
  }

  update() {
    if (this.gameOver) return;

    const speed = 4;
    // Calculate boundaries based on sprite width and screen width
    const leftBound = this.dino.displayWidth / 2;
    const rightBound = this.cameras.main.width - this.dino.displayWidth / 2;

    if (this.cursors.left.isDown && this.dino.x > leftBound) {
      this.dino.x -= speed;
      this.dino.setFlipX(true);
    } else if (this.cursors.right.isDown && this.dino.x < rightBound) {
      this.dino.x += speed;
      this.dino.setFlipX(false);
    }

    // Spawn new asteroids
    if (this.time.now > this.nextAsteroidTime) {
      this.spawnAsteroid();
      // Gradually increase difficulty by reducing spawn time
      this.asteroidSpawnRate = Math.max(500, this.asteroidSpawnRate - 50);
      this.nextAsteroidTime = this.time.now + this.asteroidSpawnRate;
    }

    // Check for out-of-bounds asteroids and remove them
    this.asteroids
      .getChildren()
      .forEach((asteroid: Phaser.Physics.Arcade.Image) => {
        if (asteroid.y > this.cameras.main.height + 50) {
          asteroid.destroy();
        }
      });
  }

  spawnAsteroid() {
    // Random x position
    const x = Phaser.Math.Between(50, this.cameras.main.width - 50);

    // Create asteroid
    const asteroid = this.asteroids.create(x, -50, "asteroid");
    asteroid.setScale(Phaser.Math.FloatBetween(0.5, 2));

    // Set asteroid properties
    asteroid.setVelocity(
      Phaser.Math.Between(-100, 100), // x velocity for some variety
      Phaser.Math.Between(150, 300) // y velocity (falling speed)
    );

    // Add rotation
    asteroid.setAngularVelocity(Phaser.Math.Between(-100, 100));

    // Set depth to be behind player but in front of background
    asteroid.setDepth(2);
  }

  handleAsteroidCollision(
    dino: Phaser.GameObjects.GameObject,
    asteroid: Phaser.GameObjects.GameObject
  ) {
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

    // Wait a few seconds and then go to game over screen
    this.time.delayedCall(3000, () => {
      this.scene.start("GameOver");
    });
  }
}
