
class Player {

    constructor(game) {

        this.game = game;

        // =====================================
        // POSITION
        // =====================================

        this.x = 180;
        this.width = 42;
        this.height = 72;

        this.groundY = game.groundY;
        this.y = this.groundY - this.height;

        // =====================================
        // MOVEMENT
        // =====================================

        this.speed = 180;
        this.facing = 1;

        // =====================================
        // PLAYER STATE
        // =====================================

        this.state = "idle";
        this.crouching = false;

        this.isDead = false;

        // =====================================
        // SPRITE DISPLAY SIZE
        // =====================================

        this.spriteWidth = 200;
        this.spriteHeight = 164;

        this.spriteYOffset = 15;

        // =====================================
        // IDLE SPRITE
        // =====================================

        this.idleSprite = new Image();

        this.idleSprite.src =
            "assets/player/idle_strip.png";

        this.idleFrameCount = 3;
        this.idleFrameWidth = 0;
        this.idleFrameHeight = 0;

        this.idleFrame = 0;
        this.idleFrameTimer = 0;

        this.idleFrameDuration = 0.15;

        // =====================================
        // DEATH SPRITE
        // =====================================

        this.deathSprite = new Image();

        this.deathSprite.src =
            "assets/player/death_strip.png";

        this.deathFrameCount = 7;
        this.deathFrameWidth = 0;
        this.deathFrameHeight = 0;

        this.deathFrame = 0;
        this.deathFrameTimer = 0;

        this.deathFrameDuration = 0.15;

        this.deathAnimationFinished = false;

        // =====================================
        // WALKING SPRITE
        // =====================================

        this.walkSprite = new Image();

        this.walkSprite.src =
            "assets/player/walking_strip.png";

        this.walkFrameCount = 6;
        this.walkFrameWidth = 0;
        this.walkFrameHeight = 0;

        this.walkFrame = 0;
        this.walkFrameTimer = 0;

        this.walkFrameDuration = 0.10;

        // =====================================
        // SHOOTING SPRITE
        // =====================================

        this.shootSprite = new Image();

        this.shootSprite.src =
            "assets/player/shooting_strip.png";

        this.shootFrameCount = 3;
        this.shootFrameWidth = 0;
        this.shootFrameHeight = 0;

        this.shootFrame = 0;
        this.shootFrameTimer = 0;

        this.shootFrameDuration = 0.15;

        this.isShooting = false;

        // =====================================
        // PLAYER ATTRIBUTES
        // =====================================

        this.health = 100;
        this.maxHealth = 100;

        this.armor = 75;
        this.maxArmor = 100;

        // =====================================
        // PROGRESSION
        // =====================================

        this.xp = 250;
        this.maxXP = 500;

        this.rank = "PRIVATE";

        this.score = 0;
        this.kills = 0;

        this.grenades = 3;

        // =====================================
        // WEAPON SYSTEM
        // =====================================

        this.weaponSystem = new Weapon(this);

        this.weapon = this.weaponSystem.name;

        this.ammo = this.weaponSystem.ammo;

        this.maxAmmo =
            this.weaponSystem.magazineSize;

        this.reserveAmmo =
            this.weaponSystem.reserveAmmo;

        // =====================================
        // KEYBOARD CONTROLS
        // =====================================

        this.keys = {};

        this.mouseDown = false;

        this.setupControls();

    }


    // =====================================
    // CONTROLS
    // =====================================

    setupControls() {

        // Keyboard controls
        window.addEventListener("keydown", (e) => {

            this.keys[e.code] = true;

            // Reload weapon with R
            if (
                e.code === "KeyR" &&
                !e.repeat
            ) {

                this.weaponSystem.reload();

            }

            // Prevent browser scrolling
            if (
                [
                    "ArrowLeft",
                    "ArrowRight",
                    "ArrowDown"
                ].includes(e.code)
            ) {

                e.preventDefault();

            }

        });


        window.addEventListener("keyup", (e) => {

            this.keys[e.code] = false;

        });


        window.addEventListener("blur", () => {

            this.keys = {};
            this.mouseDown = false;

        });


        // Mouse controls
        this.game.canvas.addEventListener(
            "mousedown",
            (e) => {

                if (e.button !== 0) return;

                this.mouseDown = true;

            }
        );


        window.addEventListener("mouseup", (e) => {

            if (e.button !== 0) return;

            this.mouseDown = false;

        });


        // Prevent context menu
        this.game.canvas.addEventListener(
            "contextmenu",
            (e) => {

                e.preventDefault();

            }
        );

    }


    // =====================================
    // UPDATE
    // =====================================

    update(dt) {

        if (this.isDead) {

            this.updateAnimation(dt);
            return;

        }

        let moving = false;

        // Move left
        if (
            this.keys["KeyA"] ||
            this.keys["ArrowLeft"]
        ) {

            this.x -= this.speed * dt;

            this.facing = -1;

            moving = true;

        }

        // Move right
        if (
            this.keys["KeyD"] ||
            this.keys["ArrowRight"]
        ) {

            this.x += this.speed * dt;

            this.facing = 1;

            moving = true;

        }

        // Crouching
        this.crouching =
            this.keys["KeyS"] ||
            this.keys["ArrowDown"];

        // World boundaries
        const halfWidth = this.width / 2;

        this.x = Math.max(
            halfWidth,
            Math.min(
                this.game.worldWidth - halfWidth,
                this.x
            )
        );

        // Keep player on ground
        this.y = this.groundY - this.height;

        // =====================================
        // PLAYER STATE
        // =====================================

        if (this.crouching) {

            this.state = "crouching";

        } else if (moving) {

            this.state = "walking";

        } else {

            this.state = "idle";

        }

        // =====================================
        // WEAPON UPDATE
        // =====================================

        this.weaponSystem.update(dt);

        // =====================================
        // AUTOMATIC SHOOTING
        // =====================================

        const canShoot =
            this.mouseDown &&
            this.weaponSystem.ammo > 0 &&
            !this.weaponSystem.isReloading;

        this.isShooting = canShoot;

        // Fire weapon
        if (canShoot) {

            this.weaponSystem.fire();

        }

        // =====================================
        // SYNCHRONIZE HUD
        // =====================================

        this.syncWeaponStats();

        // =====================================
        // DEATH CHECK
        // =====================================

        this.checkDeath();

        // =====================================
        // UPDATE ANIMATIONS
        // =====================================

        this.updateAnimation(dt);

    }


    // =====================================
    // START SHOOTING ANIMATION
    // =====================================

    startShootingAnimation() {

        // Do not start if image is not loaded
        if (
            !this.shootSprite.complete ||
            this.shootSprite.naturalWidth === 0
        ) {

            return;

        }

        this.isShooting = true;

        this.shootFrame = 0;

        this.shootFrameTimer = 0;

    }


    // =====================================
    // UPDATE ANIMATIONS
    // =====================================

    updateAnimation(dt) {

        // =====================================
        // CALCULATE IDLE FRAME DIMENSIONS
        // =====================================

        if (
            this.idleSprite.complete &&
            this.idleSprite.naturalWidth > 0
        ) {

            this.idleFrameWidth =
                this.idleSprite.naturalWidth /
                this.idleFrameCount;

            this.idleFrameHeight =
                this.idleSprite.naturalHeight;

        }

        // =====================================
        // CALCULATE DEATH FRAME DIMENSIONS
        // =====================================

        if (
            this.deathSprite.complete &&
            this.deathSprite.naturalWidth > 0
        ) {

            this.deathFrameWidth =
                this.deathSprite.naturalWidth /
                this.deathFrameCount;

            this.deathFrameHeight =
                this.deathSprite.naturalHeight;

        }

        // =====================================
        // CALCULATE WALKING FRAME DIMENSIONS
        // =====================================

        if (
            this.walkSprite.complete &&
            this.walkSprite.naturalWidth > 0
        ) {

            this.walkFrameWidth =
                this.walkSprite.naturalWidth /
                this.walkFrameCount;

            this.walkFrameHeight =
                this.walkSprite.naturalHeight;

        }

        // =====================================
        // CALCULATE SHOOTING FRAME DIMENSIONS
        // =====================================

        if (
            this.shootSprite.complete &&
            this.shootSprite.naturalWidth > 0
        ) {

            this.shootFrameWidth =
                this.shootSprite.naturalWidth /
                this.shootFrameCount;

            this.shootFrameHeight =
                this.shootSprite.naturalHeight;

        }

        // =====================================
        // DEATH ANIMATION
        // =====================================

        if (this.isDead) {

            if (
                this.deathAnimationFinished ||
                this.deathFrameWidth === 0
            ) {

                return;

            }

            this.deathFrameTimer += dt;

            if (
                this.deathFrameTimer >=
                this.deathFrameDuration
            ) {

                this.deathFrameTimer -=
                    this.deathFrameDuration;

                this.deathFrame++;

                if (
                    this.deathFrame >=
                    this.deathFrameCount
                ) {

                    this.deathFrame =
                        this.deathFrameCount - 1;

                    this.deathAnimationFinished = true;

                }

            }

            return;

        }

        // =====================================
        // SHOOTING ANIMATION
        // =====================================

        if (this.isShooting) {

            this.shootFrameTimer += dt;

            if (
                this.shootFrameTimer >=
                this.shootFrameDuration
            ) {

                this.shootFrameTimer = 0;

                this.shootFrame++;

                if (
                    this.shootFrame >=
                    this.shootFrameCount
                ) {

                    this.shootFrame = 0;

                }

            }

            return;

        }

        // =====================================
        // IDLE ANIMATION
        // =====================================

        if (this.state === "idle") {

            if (this.idleFrameWidth === 0) return;

            this.idleFrameTimer += dt;

            if (
                this.idleFrameTimer >=
                this.idleFrameDuration
            ) {

                this.idleFrameTimer -=
                    this.idleFrameDuration;

                this.idleFrame++;

                if (
                    this.idleFrame >=
                    this.idleFrameCount
                ) {

                    this.idleFrame = 0;

                }

            }

        } else {

            this.idleFrame = 0;
            this.idleFrameTimer = 0;

        }

        // =====================================
        // WALKING ANIMATION
        // =====================================

        if (this.state === "walking") {

            if (this.walkFrameWidth === 0) return;

            this.walkFrameTimer += dt;

            if (
                this.walkFrameTimer >=
                this.walkFrameDuration
            ) {

                this.walkFrameTimer -=
                    this.walkFrameDuration;

                this.walkFrame++;

                if (
                    this.walkFrame >=
                    this.walkFrameCount
                ) {

                    this.walkFrame = 0;

                }

            }

        } else {

            this.walkFrame = 0;
            this.walkFrameTimer = 0;

        }

    }


    // =====================================
    // SYNCHRONIZE WEAPON STATISTICS
    // =====================================

    syncWeaponStats() {

        this.weapon =
            this.weaponSystem.name;

        this.ammo =
            this.weaponSystem.ammo;

        this.maxAmmo =
            this.weaponSystem.magazineSize;

        this.reserveAmmo =
            this.weaponSystem.reserveAmmo;

    }


    // =====================================
    // RECEIVE DAMAGE
    // =====================================

    takeDamage(amount) {

        if (this.isDead || amount <= 0) return;

        let remainingDamage = amount;

        // Armor absorbs damage first
        if (this.armor > 0) {

            const absorbed = Math.min(
                this.armor,
                remainingDamage
            );

            this.armor -= absorbed;

            remainingDamage -= absorbed;

        }

        // Apply remaining damage to health
        if (remainingDamage > 0) {

            this.health = Math.max(
                0,
                this.health - remainingDamage
            );

        }

        // Check player death
        this.checkDeath();

    }


    // =====================================
    // DEATH CHECK
    // =====================================

    checkDeath() {

        if (
            this.health <= 0 &&
            !this.isDead
        ) {

            this.health = 0;

            this.isDead = true;

            this.state = "dead";

            this.deathFrame = 0;
            this.deathFrameTimer = 0;

            this.deathAnimationFinished = false;

            this.isShooting = false;

            this.keys = {};

            this.mouseDown = false;

            console.log("PLAYER DIED");

        }

    }


    // =====================================
    // RENDER
    // =====================================

    render(ctx) {

        let sprite;

        let frame;

        let frameWidth;

        let frameHeight;

        // =====================================
        // SELECT DEATH SPRITE
        // =====================================

        if (
            this.isDead &&
            this.deathSprite.complete &&
            this.deathSprite.naturalWidth > 0
        ) {

            sprite = this.deathSprite;

            frame = this.deathFrame;

            frameWidth = this.deathFrameWidth;

            frameHeight = this.deathFrameHeight;

        }

        // =====================================
        // SELECT SHOOTING SPRITE
        // =====================================

        else if (
            this.isShooting &&
            this.shootSprite.complete &&
            this.shootSprite.naturalWidth > 0
        ) {

            sprite = this.shootSprite;

            frame = this.shootFrame;

            frameWidth = this.shootFrameWidth;

            frameHeight = this.shootFrameHeight;

        }

        // =====================================
        // SELECT WALKING / IDLE SPRITE
        // =====================================

        else if (
            this.state === "idle" &&
            this.idleSprite.complete &&
            this.idleSprite.naturalWidth > 0
        ) {

            sprite = this.idleSprite;

            frame = this.idleFrame;

            frameWidth = this.idleFrameWidth;

            frameHeight = this.idleFrameHeight;

        }

        else {

            sprite = this.walkSprite;

            frame =
                this.state === "walking"
                    ? this.walkFrame
                    : 0;

            frameWidth = this.walkFrameWidth;

            frameHeight = this.walkFrameHeight;

        }

        // =====================================
        // CHECK SPRITE AVAILABILITY
        // =====================================

        if (
            !sprite ||
            !sprite.complete ||
            sprite.naturalWidth === 0 ||
            frameWidth === 0
        ) {

            return;

        }

        // =====================================
        // DRAW PLAYER
        // =====================================

        ctx.save();

        ctx.translate(
            this.x,
            this.groundY
        );

        ctx.scale(
            this.facing,
            1
        );

        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(

            sprite,

            frame * frameWidth,
            0,

            frameWidth,
            frameHeight,

            -this.spriteWidth / 2,
            -this.spriteHeight + 13,

            this.spriteWidth,
            this.spriteHeight

        );

        ctx.restore();

    }

}
