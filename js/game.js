
class Game {

    constructor(canvas, ctx) {

        // =====================================
        // CANVAS
        // =====================================

        this.canvas = canvas;
        this.ctx = ctx;

        this.width = 1280;
        this.height = 720;

        // =====================================
        // WORLD
        // =====================================

        this.worldWidth = 5000;
        this.groundY = 600;

        // =====================================
        // GAME STATE
        // =====================================

        this.state = "playing";
        this.running = false;

        // =====================================
        // TIMING
        // =====================================

        this.lastTime = 0;
        this.deltaTime = 0;

        this.fps = 0;
        this.frameCount = 0;
        this.fpsTimer = 0;

        // =====================================
        // BACKGROUND IMAGES
        // =====================================

        this.backgroundImages = {

            far: new Image(),
            middle: new Image(),
            foreground: new Image(),
            ground: new Image()

        };

        this.backgroundImages.far.src =
            "assets/backgrounds/far_background.png";

        this.backgroundImages.middle.src =
            "assets/backgrounds/middle_background.png";

        this.backgroundImages.foreground.src =
            "assets/backgrounds/foreground.png";

        this.backgroundImages.ground.src =
            "assets/backgrounds/ground_texture.png";

        // =====================================
        // BULLET SYSTEM
        this.bulletManager = new BulletManager(this);
        // =====================================
        
        // =====================================
        // ENEMY
        this.enemyManager = new EnemyManager(this);
        // =====================================

        // =====================================
        // ENVIRONMENT
        // =====================================

        this.environment = new Environment(this);

        // =====================================
        // PLAYER
        // =====================================

        this.player = new Player(this);

        // =====================================
        // CAMERA
        // =====================================

        this.camera = new Camera(this);

        this.camera.worldWidth = this.worldWidth;

        // =====================================
        // USER INTERFACE
        // =====================================

        this.ui = new UI(this);

        // =====================================
        // PAUSE CONTROLS
        // =====================================

        this.setupPauseControls();

        this.setupGameOverControls();

    }


    // ==========================================
    // PAUSE CONTROLS
    // ==========================================

    setupPauseControls() {

        window.addEventListener("keydown", (e) => {

            if (e.code !== "Escape") return;

            e.preventDefault();

            if (e.repeat) return;

            this.togglePause();

        });

    }


    // ==========================================
    // TOGGLE PAUSE
    // ==========================================

    togglePause() {

        if (this.state === "playing") {

            this.state = "paused";

            // Clear movement keys
            this.player.keys = {};

            this.player.crouching = false;

            this.player.state = "idle";

        }

        else if (this.state === "paused") {

            this.state = "playing";

            // Reset frame timing
            this.lastTime = 0;

        }

    }


    // ==========================================
    // START GAME
    // ==========================================

    start() {

        if (this.running) return;

        this.running = true;

        this.lastTime = 0;

        requestAnimationFrame(
            (timestamp) => this.gameLoop(timestamp)
        );

    }


    // ==========================================
    // GAME LOOP
    // ==========================================

    gameLoop(timestamp) {

        if (!this.running) return;

        // Calculate delta time
        if (this.lastTime === 0) {

            this.lastTime = timestamp;

        }

        let dt = (timestamp - this.lastTime) / 1000;

        this.lastTime = timestamp;

        // Prevent large time jumps
        dt = Math.min(dt, 0.05);

        this.deltaTime = dt;

        // Update
        this.update(dt);

        // Render
        this.render();

        // FPS
        this.calculateFPS(dt);

        // Next frame
        requestAnimationFrame(
            (time) => this.gameLoop(time)
        );

    }


    // ==========================================
    // UPDATE GAME
    // ==========================================


    update(dt) {

        if (this.state !== "playing") return;

        // =====================================
        // UPDATE PLAYER
        // =====================================

        // Save player position before movement
        const previousPlayerX = this.player.x;

        // Update player
        this.player.update(dt);

        // =====================================
        // CHECK DEATH ANIMATION COMPLETION
        // =====================================

        if (this.player.deathAnimationFinished) {

            this.state = "gameover";

            return;

        }

        // Resolve player-enemy collision
        if (!this.player.isDead) {

            this.enemyManager.resolvePlayerMovement(
                previousPlayerX
            );

        }

        // =====================================
        // UPDATE BULLETS
        // =====================================

        this.bulletManager.update(dt);

        // =====================================
        // UPDATE ENEMIES
        // =====================================

        this.enemyManager.update(dt);

        // =====================================
        // UPDATE CAMERA
        // =====================================

        this.camera.update(dt);

        // =====================================
        // UPDATE ENVIRONMENT
        // =====================================

        this.environment.update(dt);

        // =====================================
        // UPDATE HUD
        // =====================================

        this.ui.update(dt);

    }



    // ==========================================
    // RENDER GAME
    // ==========================================

    render() {

        const ctx = this.ctx;

        // Clear screen
        ctx.clearRect(
            0,
            0,
            this.width,
            this.height
        );

        // Background layers
        this.drawBackground();

        // Camera transformation
        ctx.save();

        ctx.translate(
            -this.camera.x,
            -this.camera.y
        );

        // Environment
        this.drawEnvironment();

        // Ground
        this.drawGround();

        // Environment objects
        this.environment.render(ctx);

        // Bullets
        this.bulletManager.render(ctx);

        //Enemy        
        this.enemyManager.render(ctx);

        // Player
        this.player.render(ctx);

        ctx.restore();

        // HUD
        this.ui.render(ctx);

        // Debug information
        this.drawDebugInfo();

        ctx.fillText(
            "Enemies: " + this.enemyManager.enemies.length,
            25,
            270
        );

        // Pause overlay
        if (this.state === "paused") {

            this.drawPauseOverlay();

        }


        if (this.state === "gameover") {

            ctx.save();

            // Dark overlay
            ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
            ctx.fillRect(0, 0, this.width, this.height);

            // Game Over title
            ctx.fillStyle = "#e53935";
            ctx.font = "bold 64px Arial";
            ctx.textAlign = "center";

            ctx.fillText(
                "GAME OVER",
                this.width / 2,
                this.height / 2 - 40
            );

            // Subtitle
            ctx.fillStyle = "#ffffff";
            ctx.font = "24px Arial";

            ctx.fillText(
                "YOU HAVE BEEN ELIMINATED",
                this.width / 2,
                this.height / 2 + 15
            );

            // Restart button
            const buttonX = this.width / 2 - 110;
            const buttonY = this.height / 2 + 65;

            ctx.fillStyle = "#8b2525";
            ctx.fillRect(buttonX, buttonY, 220, 55);

            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.strokeRect(buttonX, buttonY, 220, 55);

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 24px Arial";

            ctx.fillText(
                "RESTART",
                this.width / 2,
                buttonY + 36
            );

            ctx.restore();

        }


    }


    setupGameOverControls() {

        this.canvas.addEventListener("click", (e) => {

            if (this.state !== "gameover") return;

            const rect = this.canvas.getBoundingClientRect();

            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;

            const mouseX = (e.clientX - rect.left) * scaleX;
            const mouseY = (e.clientY - rect.top) * scaleY;

            const buttonX = this.width / 2 - 110;
            const buttonY = this.height / 2 + 65;

            if (
                mouseX >= buttonX &&
                mouseX <= buttonX + 220 &&
                mouseY >= buttonY &&
                mouseY <= buttonY + 55
            ) {

                window.location.reload();

            }

        });

    }


    // ==========================================
    // BACKGROUND LAYERS
    // ==========================================

    drawBackground() {

        const ctx = this.ctx;

        // Base sky
        ctx.fillStyle = "#26343c";

        ctx.fillRect(
            0,
            0,
            this.width,
            this.height
        );

        // FAR BACKGROUND
        this.drawParallaxLayer(
            this.backgroundImages.far,
            {
                speed: 0.10,
                y: 0,
                height: 500
            }
        );

        // MIDDLE BACKGROUND
        this.drawParallaxLayer(
            this.backgroundImages.middle,
            {
                speed: 0.35,
                y: 0,
                height: this.height
            }
        );

        // FOREGROUND
        this.drawParallaxLayer(
            this.backgroundImages.foreground,
            {
                speed: 0.75,
                y: 300,
                height: 300
            }
        );

    }


    // ==========================================
    // PARALLAX LAYER
    // ==========================================

    drawParallaxLayer(image, settings) {

        // Check image loading
        if (
            !image.complete ||
            image.naturalWidth === 0
        ) {

            return;

        }

        const ctx = this.ctx;

        const speed = settings.speed;
        const y = settings.y;
        const height = settings.height;

        const imageWidth = image.naturalWidth;
        const imageHeight = image.naturalHeight;

        // Preserve image proportions
        const scale = height / imageHeight;

        const drawWidth = imageWidth * scale;

        // Camera offset
        const offset =
            (this.camera.x * speed) % drawWidth;

        // Repeat horizontally
        for (
            let x = -offset;
            x < this.width;
            x += drawWidth
        ) {

            ctx.drawImage(
                image,
                x,
                y,
                drawWidth,
                height
            );

        }

    }


    // ==========================================
    // ENVIRONMENT
    // ==========================================

    drawEnvironment() {

        // Background scenery is rendered
        // using separate parallax layers.

    }


    // ==========================================
    // GROUND TEXTURE
    // ==========================================

    drawGround() {

        const ground = this.backgroundImages.ground;

        // Temporary ground if texture is missing
        if (
            !ground.complete ||
            ground.naturalWidth === 0
        ) {

            this.ctx.fillStyle = "#443b32";

            this.ctx.fillRect(
                0,
                this.groundY,
                this.worldWidth,
                this.height - this.groundY
            );

            return;

        }

        // Ground dimensions
        const tileWidth = 512;
        const tileHeight = 120;

        // Repeat texture
        for (
            let x = 0;
            x < this.worldWidth;
            x += tileWidth
        ) {

            this.ctx.drawImage(
                ground,
                x,
                this.groundY,
                tileWidth,
                tileHeight
            );

        }

    }


    // ==========================================
    // PAUSE OVERLAY
    // ==========================================

    drawPauseOverlay() {

        const ctx = this.ctx;

        ctx.save();

        // Dark overlay
        ctx.fillStyle = "rgba(0, 0, 0, 0.65)";

        ctx.fillRect(
            0,
            0,
            this.width,
            this.height
        );

        // Panel dimensions
        const panelWidth = 420;
        const panelHeight = 190;

        const panelX =
            (this.width - panelWidth) / 2;

        const panelY =
            (this.height - panelHeight) / 2;

        // Panel background
        ctx.fillStyle = "#20272b";

        ctx.fillRect(
            panelX,
            panelY,
            panelWidth,
            panelHeight
        );

        // Panel border
        ctx.strokeStyle = "#89969b";
        ctx.lineWidth = 3;

        ctx.strokeRect(
            panelX,
            panelY,
            panelWidth,
            panelHeight
        );

        // Title
        ctx.textAlign = "center";

        ctx.fillStyle = "#ffffff";

        ctx.font = "bold 42px monospace";

        ctx.fillText(
            "PAUSED",
            this.width / 2,
            panelY + 75
        );

        // Instruction
        ctx.fillStyle = "#c4cdd0";

        ctx.font = "18px monospace";

        ctx.fillText(
            "PRESS ESC TO RESUME",
            this.width / 2,
            panelY + 125
        );

        ctx.restore();

    }


    // ==========================================
    // FPS CALCULATION
    // ==========================================

    calculateFPS(dt) {

        this.frameCount++;

        this.fpsTimer += dt;

        if (this.fpsTimer >= 1) {

            this.fps = this.frameCount;

            this.frameCount = 0;

            this.fpsTimer = 0;

        }

    }


    // ==========================================
    // DEBUG INFORMATION
    // ==========================================

    drawDebugInfo() {

        const ctx = this.ctx;

        ctx.save();

        // Debug panel
        ctx.fillStyle = "rgba(0, 0, 0, 0.65)";

        ctx.fillRect(
            15,
            190,
            185,
            75
        );

        ctx.fillStyle = "#ffffff";

        ctx.font = "13px monospace";

        ctx.textAlign = "left";

        ctx.fillText(
            "Enemies: " + this.enemyManager.enemies.length,
            25,
            270
        );
        

        ctx.fillText(
            "FPS: " + this.fps,
            25,
            210
        );

        ctx.fillText(
            "Player X: " + Math.round(this.player.x),
            25,
            230
        );

        ctx.fillText(
            "Camera X: " + Math.round(this.camera.x),
            25,
            250
        );

        ctx.restore();

    }


    // ==========================================
    // STOP GAME
    // ==========================================

    stop() {

        this.running = false;

    }

}
