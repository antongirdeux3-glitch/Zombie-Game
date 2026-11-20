// ==========================================
// MUTATED BOSS ENCOUNTER
// ==========================================

class MutatedBoss {

    constructor(game, x) {
        this.game = game;
        this.name = "THE ABOMINATION";
        this.x = x;
        this.width = 150;
        this.height = 190;
        this.y = game.groundY - this.height;

        this.maxHealth = 3000;
        this.health = this.maxHealth;
        this.speed = 42;
        this.meleeDamage = 25;
        this.projectileDamage = 20;

        this.state = "entering";
        this.active = true;
        this.facing = -1;

        this.meleeRange = 185;
        this.meleeCooldown = 3.2;
        this.meleeTimer = 1.5;
        this.projectileCooldown = 3.5;
        this.projectileTimer = 2;
        this.recoveryTimer = 0;
        this.hurtTimer = 0;

        this.projectiles = [];
    }

    update(dt) {
        if (!this.active) return;

        const player = this.game.player;
        if (!player || player.isDead) return;

        this.meleeTimer = Math.max(0, this.meleeTimer - dt);
        this.projectileTimer = Math.max(0, this.projectileTimer - dt);
        this.hurtTimer = Math.max(0, this.hurtTimer - dt);

        const bossCenter = this.x + this.width / 2;
        const dx = player.x - bossCenter;
        const distance = Math.abs(dx);
        this.facing = dx >= 0 ? 1 : -1;

        if (this.state === "entering") {
            this.state = "approaching";
        }

        if (this.state === "recovering") {
            this.recoveryTimer -= dt;
            if (this.recoveryTimer <= 0) this.state = "approaching";
        } else if (distance > this.meleeRange) {
            this.state = "approaching";
            this.x += this.facing * this.speed * dt;
        } else if (this.meleeTimer <= 0) {
            this.performMeleeAttack(player);
        } else {
            this.state = "idle";
        }

        // Ranged attack gives the player a threat while keeping distance.
        if (distance > this.meleeRange + 80 && this.projectileTimer <= 0) {
            this.fireToxicProjectile(player);
        }

        this.updateProjectiles(dt, player);
    }

    performMeleeAttack(player) {
        this.state = "attacking";

        const playerCenter = player.x;
        const bossCenter = this.x + this.width / 2;
        const verticalOverlap =
            this.y < player.y + player.height &&
            this.y + this.height > player.y;

        if (
            verticalOverlap &&
            Math.abs(playerCenter - bossCenter) <= this.meleeRange
        ) {
            player.takeDamage(this.meleeDamage);
        }

        this.meleeTimer = this.meleeCooldown;
        this.recoveryTimer = 0.8;
        this.state = "recovering";
    }

    fireToxicProjectile(player) {
        const startX = this.x + this.width / 2;
        const startY = this.y + 75;
        const direction = player.x >= startX ? 1 : -1;

        this.projectiles.push({
            x: startX,
            y: startY,
            width: 34,
            height: 22,
            direction,
            speed: 300,
            active: true
        });

        this.projectileTimer = this.projectileCooldown;
        this.state = "attacking";
        this.recoveryTimer = 0.45;
    }

    updateProjectiles(dt, player) {
        for (const projectile of this.projectiles) {
            if (!projectile.active) continue;

            projectile.x += projectile.direction * projectile.speed * dt;

            const playerBox = {
                x: player.x - player.width / 2,
                y: player.y,
                width: player.width,
                height: player.height
            };

            const hit =
                projectile.x < playerBox.x + playerBox.width &&
                projectile.x + projectile.width > playerBox.x &&
                projectile.y < playerBox.y + playerBox.height &&
                projectile.y + projectile.height > playerBox.y;

            if (hit && !player.isDead) {
                player.takeDamage(this.projectileDamage);
                projectile.active = false;
            }

            if (
                projectile.x < 0 ||
                projectile.x > this.game.worldWidth
            ) {
                projectile.active = false;
            }
        }

        this.projectiles = this.projectiles.filter(p => p.active);
    }

    takeDamage(amount) {
        if (!this.active || !Number.isFinite(amount) || amount <= 0) return;

        this.health = Math.max(0, this.health - amount);
        this.state = "hurt";
        this.hurtTimer = 0.12;

        if (this.health <= 0) {
            this.active = false;
            this.state = "dead";
            this.projectiles = [];
        }
    }

    render(ctx) {
        if (!this.active) return;

        // Temporary placeholder body. Replace with boss sprites later.
        ctx.save();

        ctx.fillStyle = this.hurtTimer > 0 ? "#f2b7a0" : "#59423d";
        ctx.fillRect(this.x, this.y + 35, this.width, this.height - 35);

        ctx.fillStyle = "#756056";
        ctx.fillRect(this.x + 18, this.y, this.width - 36, 65);

        ctx.fillStyle = "#b8d84b";
        const eyeX = this.facing === 1 ? this.x + 100 : this.x + 38;
        ctx.fillRect(eyeX, this.y + 24, 13, 9);
        ctx.fillRect(eyeX + 20, this.y + 24, 13, 9);

        ctx.fillStyle = "#2c2422";
        ctx.fillRect(this.x + 42, this.y + 92, 66, 16);

        // Boss health strip above the placeholder.
        ctx.fillStyle = "#252525";
        ctx.fillRect(this.x, this.y - 18, this.width, 9);
        ctx.fillStyle = "#d32f2f";
        ctx.fillRect(
            this.x,
            this.y - 18,
            this.width * (this.health / this.maxHealth),
            9
        );

        for (const projectile of this.projectiles) {
            ctx.fillStyle = "#9acb42";
            ctx.fillRect(
                projectile.x,
                projectile.y,
                projectile.width,
                projectile.height
            );
            ctx.fillStyle = "#d8ff75";
            ctx.fillRect(
                projectile.x + 7,
                projectile.y + 5,
                12,
                7
            );
        }

        ctx.restore();
    }
}


// ==========================================
// BOSS MANAGER
// ==========================================

class BossManager {

    constructor(game) {
        this.game = game;
        this.boss = null;
        this.started = false;
        this.defeated = false;
    }

    startEncounter() {
        if (this.started) return;

        this.started = true;
        this.game.enemyManager.waveState = "boss_active";

        const player = this.game.player;
        const spawnX = Math.min(
            this.game.worldWidth - 250,
            Math.max(250, player.x + 650)
        );

        this.boss = new MutatedBoss(this.game, spawnX);
        console.log("BOSS ENCOUNTER STARTED: THE ABOMINATION");
    }

    update(dt) {
        if (
            !this.started &&
            this.game.enemyManager.waveState === "boss_pending"
        ) {
            this.startEncounter();
        }

        if (!this.boss || this.defeated) return;

        this.boss.update(dt);

        if (!this.boss.active) {
            this.defeated = true;
            this.game.enemyManager.waveState = "boss_defeated";
            this.game.state = "victory";
            this.game.player.score += 5000;
            console.log("BOSS DEFEATED: THE ABOMINATION");
        }
    }

    render(ctx) {
        if (this.boss && this.boss.active) {
            this.boss.render(ctx);
        }
    }
}
