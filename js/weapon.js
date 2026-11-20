
class Weapon {

    constructor(player) {

        this.player = player;

        // Weapon information
        this.name = "ASSAULT RIFLE";

        // Damage
        this.damage = 25;

        // Ammunition
        this.magazineSize = 30;
        this.ammo = 30;
        this.reserveAmmo = 120;
        this.maxReserveAmmo = 300;

        // Firing
        this.fireRate = 8;
        this.fireInterval = 1 / this.fireRate;

        // Reloading
        this.reloadTime = 1.5; // 1.2 = balanced  0.8 = very fast
        this.isReloading = false;
        this.reloadTimer = 0;

        // Firing state
        this.fireTimer = 0;

    }


    // =====================================
    // UPDATE
    // =====================================

    update(dt) {

        if (this.fireTimer > 0) {

            this.fireTimer -= dt;

        }

        if (this.isReloading) {

            this.reloadTimer -= dt;

            if (this.reloadTimer <= 0) {

                this.finishReload();

            }

        }

    }


    // =====================================
    // RELOAD
    // =====================================

    reload() {

        if (this.isReloading) return;

        if (this.ammo >= this.magazineSize) return;

        if (this.reserveAmmo <= 0) return;

        this.isReloading = true;

        this.reloadTimer = this.reloadTime;

    }


    // =====================================
    // FINISH RELOAD
    // =====================================

    finishReload() {

        const missingAmmo =
            this.magazineSize - this.ammo;

        const transferredAmmo =
            Math.min(missingAmmo, this.reserveAmmo);

        this.ammo += transferredAmmo;

        this.reserveAmmo -= transferredAmmo;

        this.isReloading = false;

        this.reloadTimer = 0;

    }


    // =====================================
    // CAN FIRE
    // =====================================

    canFire() {

        return (
            !this.isReloading &&
            this.ammo > 0 &&
            this.fireTimer <= 0
        );

    }


    // =====================================
    // FIRE
    // =====================================

       fire() {

        if (!this.canFire()) return false;

        // Consume ammunition
        this.ammo--;

        // Set fire-rate cooldown
        this.fireTimer = this.fireInterval;

        // Get player position and direction
        const player = this.player;

        const direction = player.facing;

        // Bullet starting position
        const bulletX =
            player.x + direction * 60;

        const bulletY =
            player.y - (player.crouching ? -10 : -20);

        // Create bullet
        this.player.game.bulletManager.addBullet(
            bulletX,
            bulletY,
            direction,
            this.damage
        );

        // Start shooting animation
        //player.startShootingAnimation();

        return true;
    }


}
