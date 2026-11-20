
class Enemy {

    constructor(game, x, type = "normal") {

        this.game = game;

        // =====================================
        // ENEMY TYPE
        // =====================================

        this.type = type;

        // =====================================
        // POSITION AND DIMENSIONS
        // =====================================

        this.x = x;

        this.width = 45;
        this.height = 70;

        this.y = game.groundY - this.height;

        // =====================================
        // DEFAULT ATTRIBUTES
        // =====================================

        this.maxHealth = 100;
        this.health = 100;

        this.speed = 75;
        this.attackDamage = 10;
        this.attackInterval = 1.5;

        this.color = "#526b43";
        this.headColor = "#82945a";

        // =====================================
        // ENEMY TYPE ATTRIBUTES
        // =====================================

        switch (this.type) {

            case "fast":

                this.maxHealth = 60;
                this.health = 60;

                this.speed = 130;
                this.attackDamage = 7;
                this.attackInterval = 1;

                this.color = "#789b48";
                this.headColor = "#a4bd64";

                break;

            case "tank":

                this.maxHealth = 250;
                this.health = 250;

                this.speed = 40;
                this.attackDamage = 20;
                this.attackInterval = 2;

                this.width = 65;
                this.height = 85;

                this.y = game.groundY - this.height;

                this.color = "#493b35";
                this.headColor = "#766052";

                break;

            case "normal":

            default:

                this.type = "normal";

                break;

        }

        // =====================================
        // STATE
        // =====================================

        this.active = true;

        // =====================================
        // AI SETTINGS
        // =====================================

        this.detectionRange = 550;

        this.stopDistance = 8;

        this.attackRange = 8;

        this.isChasing = false;

        // =====================================
        // ATTACK SETTINGS
        // =====================================

        this.attackTimer = 0;

        this.facing = -1;

    }


    // =====================================
    // UPDATE ENEMY MOVEMENT
    // =====================================

    update(dt) {

        if (!this.active) return;

        const player = this.game.player;

        if (!player || player.isDead) return;

        // =====================================
        // HITBOX POSITIONS
        // =====================================

        const enemyLeft = this.x;
        const enemyRight = this.x + this.width;

        const playerLeft = player.x - player.width / 2;
        const playerRight = player.x + player.width / 2;

        const enemyCenter = this.x + this.width / 2;

        // =====================================
        // HITBOX DISTANCE
        // =====================================

        let distance = 0;

        if (enemyRight < playerLeft) {

            distance = playerLeft - enemyRight;

        } else if (playerRight < enemyLeft) {

            distance = enemyLeft - playerRight;

        }

        // =====================================
        // DETECTION
        // =====================================

        const dx = player.x - enemyCenter;

        const centerDistance = Math.abs(dx);

        this.isChasing =
            centerDistance <= this.detectionRange;

        // =====================================
        // FACING
        // =====================================

        if (dx > 0) {

            this.facing = 1;

        } else if (dx < 0) {

            this.facing = -1;

        }

        // =====================================
        // MOVE TOWARD PLAYER
        // =====================================

        if (
            this.isChasing &&
            distance > this.attackRange
        ) {

            const direction = Math.sign(dx);

            const movement = Math.min(
                this.speed * dt,
                distance - this.attackRange
            );

            this.x += direction * movement;

        }

    }


    // =====================================
    // ATTACK PLAYER
    // =====================================

    attackPlayer(dt) {

        if (!this.active) return;

        const player = this.game.player;

        if (!player || player.isDead) return;

        // Update attack cooldown
        this.attackTimer = Math.max(
            0,
            this.attackTimer - dt
        );

        if (!this.isChasing) return;

        // =====================================
        // CHECK VERTICAL COLLISION
        // =====================================

        const verticalOverlap =
            this.y < player.y + player.height &&
            this.y + this.height > player.y;

        if (!verticalOverlap) return;

        // =====================================
        // CHECK HORIZONTAL DISTANCE
        // =====================================

        const enemyLeft = this.x;
        const enemyRight = this.x + this.width;

        const playerLeft = player.x - player.width / 2;
        const playerRight = player.x + player.width / 2;

        let distance = 0;

        if (enemyRight < playerLeft) {

            distance = playerLeft - enemyRight;

        } else if (playerRight < enemyLeft) {

            distance = enemyLeft - playerRight;

        }

        // =====================================
        // APPLY DAMAGE
        // =====================================

        if (
            distance <= this.attackRange &&
            this.attackTimer <= 0
        ) {

            player.takeDamage(this.attackDamage);

            this.attackTimer = this.attackInterval;

        }

    }


    // =====================================
    // RECEIVE DAMAGE
    // =====================================

    takeDamage(amount) {

        if (
            !this.active ||
            !Number.isFinite(amount) ||
            amount <= 0
        ) {

            return;

        }

        this.health -= amount;

        // =====================================
        // CHECK DEATH
        // =====================================

        if (this.health <= 0) {

            this.health = 0;

            this.active = false;

            // Every Tank Zombie drops one reserve-ammo magazine.
            if (this.type === "tank") {
                this.game.enemyManager.addAmmoPickup(
                    this.x + this.width / 2,
                    this.game.groundY
                );
            }

            // =====================================
            // REWARD PLAYER
            // =====================================

            const player = this.game.player;

            player.kills += 1;

            player.score += 100;

            player.xp += 50;

            // Prevent XP from exceeding maximum
            player.xp = Math.min(
                player.xp,
                player.maxXP
            );

        }

    }


    // =====================================
    // RENDER ENEMY
    // =====================================

    render(ctx) {

        if (!this.active) return;

        // =====================================
        // ENEMY BODY
        // =====================================

        ctx.fillStyle = this.color;

        ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );

        // =====================================
        // ENEMY HEAD
        // =====================================

        ctx.fillStyle = this.headColor;

        ctx.fillRect(
            this.x + 5,
            this.y - 18,
            35,
            25
        );

        // =====================================
        // ENEMY EYES
        // =====================================

        ctx.fillStyle = "#ff3333";

        if (this.facing === 1) {

            ctx.fillRect(
                this.x + 25,
                this.y - 10,
                5,
                5
            );

            ctx.fillRect(
                this.x + 35,
                this.y - 10,
                5,
                    5
            );

        } else {

            ctx.fillRect(
                this.x + 5,
                this.y - 10,
                5,
                5
            );

            ctx.fillRect(
                this.x + 15,
                this.y - 10,
                5,
                5
            );

        }

        // =====================================
        // HEALTH BAR BACKGROUND
        // =====================================

        ctx.fillStyle = "#333333";

        ctx.fillRect(
            this.x,
            this.y - 30,
            this.width,
            6
        );

        // =====================================
        // HEALTH BAR
        // =====================================

        ctx.fillStyle = "#e53935";

        ctx.fillRect(
            this.x,
            this.y - 30,
            this.width * (this.health / this.maxHealth),
            6
        );

    }

}


// =========================================
// ENEMY MANAGER
// =========================================

class EnemyManager {

    constructor(game) {

        this.game = game;

        // =====================================
        // ENEMY COLLECTION
        // =====================================

        this.enemies = [];

        // Reserve-ammo magazines dropped by Tank Zombies.
        this.ammoPickups = [];

        // =====================================
        // SPAWNING SETTINGS
        // =====================================

        this.spawnInterval = 4;

        this.spawnTimer = 2;

        this.maxEnemies = 8;

        this.minSpawnDistance = 500;

        this.maxSpawnDistance = 850;

        // =====================================
        // ENEMY TYPE PROBABILITIES
        // =====================================

        this.enemyTypes = [

            { type: "normal", weight: 70 },
            { type: "fast", weight: 20 },
            { type: "tank", weight: 10 }

        ];

        // DIFFICULTY SETTINGS
        this.difficultyLevel = 1;
        this.difficultyName = "Easy";

    }


    // =====================================
    // PLAYER-ENEMY COLLISION
    // =====================================

    resolvePlayerMovement(previousPlayerX) {

        const player = this.game.player;

        if (!player || player.isDead) return;

        const halfWidth = player.width / 2;

        const direction = Math.sign(
            player.x - previousPlayerX
        );

        if (direction === 0) return;

        for (const enemy of this.enemies) {

            if (!enemy.active) continue;

            // Check vertical overlap
            const verticalOverlap =
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y;

            if (!verticalOverlap) continue;

            const enemyLeft = enemy.x;
            const enemyRight = enemy.x + enemy.width;

            const playerLeft = player.x - halfWidth;
            const playerRight = player.x + halfWidth;

            // Moving right
            if (
                direction > 0 &&
                player.x <= enemy.x + enemy.width / 2 &&
                playerRight > enemyLeft
            ) {

                player.x = Math.min(
                    player.x,
                    enemyLeft - halfWidth
                );

            }

            // Moving left
            else if (
                direction < 0 &&
                player.x >= enemy.x + enemy.width / 2 &&
                playerLeft < enemyRight
            ) {

                player.x = Math.max(
                    player.x,
                    enemyRight + halfWidth
                );

            }

        }

    }


    // =====================================
    // ENEMY-ENEMY COLLISION
    // =====================================

    resolveEnemyCollisions() {

        const enemies = this.enemies;

        const player = this.game.player;

        if (!player || player.isDead) return;

        // Multiple passes improve separation
        for (let pass = 0; pass < 3; pass++) {

            for (let i = 0; i < enemies.length; i++) {

                const enemyA = enemies[i];

                if (!enemyA.active) continue;

                for (
                    let j = i + 1;
                    j < enemies.length;
                    j++
                ) {

                    const enemyB = enemies[j];

                    if (!enemyB.active) continue;

                    // Check vertical overlap
                    const verticalOverlap =
                        enemyA.y < enemyB.y + enemyB.height &&
                        enemyA.y + enemyA.height > enemyB.y;

                    if (!verticalOverlap) continue;

                    // Calculate centers
                    const centerA =
                        enemyA.x + enemyA.width / 2;

                    const centerB =
                        enemyB.x + enemyB.width / 2;

                    // Calculate horizontal overlap
                    const overlap =
                        (enemyA.width + enemyB.width) / 2 -
                        Math.abs(centerA - centerB);

                    if (overlap <= 0) continue;

                    // Determine separation direction
                    let direction;

                    if (centerA < centerB) {

                        direction = -1;

                    } else if (centerA > centerB) {

                        direction = 1;

                    } else {

                        direction =
                            centerA <= player.x ? -1 : 1;

                    }

                    // Separate enemies equally
                    const separation = (overlap + 0.1) / 2;

                    enemyA.x += direction * separation;

                    enemyB.x -= direction * separation;

                }

            }

        }

        // =====================================
        // PREVENT ENEMY-PLAYER OVERLAP
        // =====================================

        const playerLeft =
            player.x - player.width / 2;

        const playerRight =
            player.x + player.width / 2;

        for (const enemy of enemies) {

            if (!enemy.active) continue;

            const enemyCenter =
                enemy.x + enemy.width / 2;

            if (enemyCenter < player.x) {

                const maximumX =
                    playerLeft -
                    enemy.attackRange -
                    enemy.width;

                enemy.x = Math.min(
                    enemy.x,
                    maximumX
                );

            } else {

                const minimumX =
                    playerRight +
                    enemy.attackRange;

                enemy.x = Math.max(
                    enemy.x,
                    minimumX
                );

            }

        }

    }


    // =====================================
    // SELECT RANDOM ENEMY TYPE
    // =====================================


    updateDifficulty() {

        const playerX = this.game.player.x;
        const worldWidth = this.game.worldWidth;

        const progress = playerX / worldWidth;

        if (progress < 0.25) {

            this.difficultyLevel = 1;
            this.difficultyName = "Easy";

        } else if (progress < 0.50) {

            this.difficultyLevel = 2;
            this.difficultyName = "Medium";

        } else if (progress < 0.75) {

            this.difficultyLevel = 3;
            this.difficultyName = "Hard";

        } else {

            this.difficultyLevel = 4;
            this.difficultyName = "Very Hard";

        }

    }



    getRandomEnemyType() {

        let enemyTypes;

        switch (this.difficultyLevel) {

            case 1:
                enemyTypes = [
                    { type: "normal", weight: 70 },
                    { type: "fast", weight: 20 },
                    { type: "tank", weight: 10 }
                ];
                break;

            case 2:
                enemyTypes = [
                    { type: "normal", weight: 60 },
                    { type: "fast", weight: 25 },
                    { type: "tank", weight: 15 }
                ];
                break;

            case 3:
                enemyTypes = [
                    { type: "normal", weight: 50 },
                    { type: "fast", weight: 30 },
                    { type: "tank", weight: 20 }
                ];
                break;

            case 4:
                enemyTypes = [
                    { type: "normal", weight: 40 },
                    { type: "fast", weight: 35 },
                    { type: "tank", weight: 25 }
                ];
                break;

            default:
                enemyTypes = [
                    { type: "normal", weight: 70 },
                    { type: "fast", weight: 20 },
                    { type: "tank", weight: 10 }
                ];

        }

        const totalWeight = enemyTypes.reduce(
            (total, enemy) => total + enemy.weight,
            0
        );

        let random = Math.random() * totalWeight;

        for (const enemy of enemyTypes) {

            random -= enemy.weight;

            if (random < 0) {
                return enemy.type;
            }

        }

        return "normal";

    }



    // =====================================
    // GET RANDOM SPAWN POSITION
    // =====================================

    getSpawnPosition() {

        const player = this.game.player;

        const worldWidth = this.game.worldWidth;

        const camera = this.game.camera;

        const margin = 100;

        const leftEdge = camera.x - margin;

        const rightEdge =
            camera.x + this.game.width + margin;

        const canSpawnLeft = leftEdge >= 0;

        const canSpawnRight =
            rightEdge <= worldWidth;

        // Choose a valid side of camera
        let direction;

        if (canSpawnLeft && canSpawnRight) {

            direction = Math.random() < 0.5 ? -1 : 1;

        } else if (canSpawnLeft) {

            direction = -1;

        } else if (canSpawnRight) {

            direction = 1;

        } else {

            direction =
                player.x < worldWidth / 2 ? 1 : -1;

        }

        // Calculate distance
        const distance =
            this.minSpawnDistance +
            Math.random() * (
                this.maxSpawnDistance -
                this.minSpawnDistance
            );

        let x = player.x + direction * distance;

        // Keep enemy inside world
        x = Math.max(
            0,
            Math.min(
                x,
                worldWidth - 65
            )
        );

        return x;

    }


    // =====================================
    // SPAWN ENEMY
    // =====================================

    spawnEnemy() {

        const player = this.game.player;

        if (!player || player.isDead) return;

        // Count active enemies
        const activeEnemies = this.enemies.filter(
            enemy => enemy.active
        ).length;

        // Respect maximum enemy limit
        if (activeEnemies >= this.maxEnemies) return;

        // Generate enemy
        const x = this.getSpawnPosition();

        const type = this.getRandomEnemyType();

        this.addEnemy(x, type);

    }


    // =====================================
    // ADD ENEMY
    // =====================================

    addEnemy(x, type = "normal") {

        const enemy = new Enemy(
            this.game,
            x,
            type
        );

        this.enemies.push(enemy);

        return enemy;

    }


    // =====================================
    // UPDATE ENEMIES
    // =====================================

    update(dt) {

        const player = this.game.player;

        if (!player || player.isDead) return;

        this.updateDifficulty();

        // =====================================
        // AUTOMATIC ENEMY SPAWNING
        // =====================================

        this.spawnTimer -= dt;

        if (this.spawnTimer <= 0) {

            const activeEnemies = this.enemies.filter(
                enemy => enemy.active
            ).length;

            if (activeEnemies < this.maxEnemies) {

                this.spawnEnemy();

            }

            // Reset spawning timer
            this.spawnTimer = this.spawnInterval;

        }

        // =====================================
        // UPDATE ENEMY MOVEMENT
        // =====================================

        for (const enemy of this.enemies) {

            enemy.update(dt);

        }

        // =====================================
        // RESOLVE COLLISIONS
        // =====================================

        this.resolveEnemyCollisions();

        // =====================================
        // ENEMY ATTACKS
        // =====================================

        for (const enemy of this.enemies) {

            enemy.attackPlayer(dt);

        }

        // =====================================
        // COLLECT AMMO PICKUPS
        // =====================================

        this.updateAmmoPickups();

        // =====================================
        // REMOVE DEAD ENEMIES
        // =====================================

        this.enemies = this.enemies.filter(
            enemy => enemy.active
        );

    }


    // =====================================
    // AMMO PICKUPS
    // =====================================

    addAmmoPickup(x, groundY) {

        this.ammoPickups.push({
            x,
            y: groundY - 22,
            width: 28,
            height: 22,
            amount: 30,
            collected: false
        });

    }


    updateAmmoPickups() {

        const player = this.game.player;

        if (!player || player.isDead) return;

        const weapon = player.weaponSystem;
        const reserveCap = weapon.maxReserveAmmo || 300;

        for (const pickup of this.ammoPickups) {

            if (pickup.collected) continue;

            // Leave the pickup available while reserve ammo is full.
            if (weapon.reserveAmmo >= reserveCap) continue;

            const playerLeft = player.x - player.width / 2;
            const playerRight = player.x + player.width / 2;
            const pickupLeft = pickup.x - pickup.width / 2;
            const pickupRight = pickup.x + pickup.width / 2;

            const horizontalOverlap =
                playerRight >= pickupLeft &&
                playerLeft <= pickupRight;

            const verticalOverlap =
                player.y < pickup.y + pickup.height &&
                player.y + player.height > pickup.y;

            if (!horizontalOverlap || !verticalOverlap) continue;

            weapon.reserveAmmo = Math.min(
                reserveCap,
                weapon.reserveAmmo + pickup.amount
            );

            pickup.collected = true;
            player.syncWeaponStats();

        }

        this.ammoPickups = this.ammoPickups.filter(
            pickup => !pickup.collected
        );

    }


    // =====================================
    // RENDER ENEMIES AND AMMO PICKUPS
    // =====================================

    render(ctx) {

        for (const enemy of this.enemies) {
            enemy.render(ctx);
        }

        // Placeholder magazine graphic.
        for (const pickup of this.ammoPickups) {

            ctx.save();

            ctx.fillStyle = "#c49a35";
            ctx.fillRect(
                pickup.x - pickup.width / 2,
                pickup.y,
                pickup.width,
                pickup.height
            );

            ctx.fillStyle = "#3b3020";
            ctx.fillRect(
                pickup.x - pickup.width / 2 + 4,
                pickup.y + 3,
                pickup.width - 8,
                5
            );

            ctx.fillStyle = "#f4d36b";
            ctx.fillRect(pickup.x - 7, pickup.y + 9, 3, 10);
            ctx.fillRect(pickup.x - 1, pickup.y + 9, 3, 10);
            ctx.fillRect(pickup.x + 5, pickup.y + 9, 3, 10);

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 14px Arial";
            ctx.textAlign = "center";
            ctx.fillText("+30", pickup.x, pickup.y - 7);

            ctx.restore();

        }

    }

}
