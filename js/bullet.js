
class Bullet {

    constructor(x, y, direction, damage) {

        // Position
        this.x = x;
        this.y = y;

        // Dimensions
        this.width = 12;
        this.height = 4;

        // Movement
        this.speed = 700;
        this.direction = direction;

        // Damage
        this.damage = damage;

        // State
        this.active = true;
    }


    // =====================================
    // UPDATE
    // =====================================

    update(dt) {

        this.x +=
            this.speed * this.direction * dt;

        // Remove bullet outside world
        if (
            this.x < 0 ||
            this.x > 5000
        ) {

            this.active = false;

        }

    }


    // =====================================
    // RENDER
    // =====================================

    render(ctx) {

        ctx.save();

        // Bullet body
        ctx.fillStyle = "#f5d76e";

        ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );

        // Bright center
        ctx.fillStyle = "#ffffff";

        ctx.fillRect(
            this.x + 3,
            this.y + 1,
            5,
            2
        );

        ctx.restore();

    }

    //This checks whether the bullet rectangle overlaps the enemy rectangle.
    checkCollision(enemy) {

        return (
            this.x < enemy.x + enemy.width &&
            this.x + this.width > enemy.x &&
            this.y < enemy.y + enemy.height &&
            this.y + this.height > enemy.y
        );

}

}


// ==========================================
// BULLET MANAGER
// ==========================================

class BulletManager {

    constructor(game) {

        this.game = game;

        this.bullets = [];

    }


    // =====================================
    // CREATE BULLET
    // =====================================

    addBullet(x, y, direction, damage) {

        const bullet = new Bullet(
            x,
            y,
            direction,
            damage
        );

        this.bullets.push(bullet);

    }


    // =====================================
    // UPDATE BULLETS
    // =====================================

    
    update(dt) {

        for (const bullet of this.bullets) {

            bullet.update(dt);

            if (!bullet.active) continue;

            for (const enemy of this.game.enemyManager.enemies) {

                if (!enemy.active) continue;

                if (bullet.checkCollision(enemy)) {

                    enemy.takeDamage(bullet.damage);

                    bullet.active = false;

                    break;

                }

            }

            // Boss uses the same player bullet damage and collision rules.
            const boss = this.game.bossManager?.boss;
            if (
                bullet.active &&
                boss &&
                boss.active &&
                bullet.checkCollision(boss)
            ) {
                boss.takeDamage(bullet.damage);
                bullet.active = false;
            }

        }

        this.bullets = this.bullets.filter(
            bullet => bullet.active
        );

    }



    // =====================================
    // RENDER BULLETS
    // =====================================

    render(ctx) {

        for (const bullet of this.bullets) {

            bullet.render(ctx);

        }

    }

}
