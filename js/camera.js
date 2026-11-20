
// ==========================================
// ZOMBIE ASSAULT
// CAMERA SYSTEM
// ==========================================

class Camera {

    constructor(game) {

        this.game = game;

        // Camera position in world
        this.x = 0;
        this.y = 0;

        // Camera dimensions
        this.width = game.width;
        this.height = game.height;

        // Camera movement
        this.smoothness = 5;

        // World boundaries
        this.worldWidth = 5000;
        this.worldHeight = game.height;

    }

    // Update camera
    update(dt) {

        const player = this.game.player;

        // Follow player horizontally
        const targetX = player.x - this.width / 2;

        // Smooth camera movement
        const smoothing = 1 - Math.exp(
            -this.smoothness * dt
        );

        this.x += (targetX - this.x) * smoothing;

        // Prevent camera leaving world
        this.x = Math.max(
            0,
            Math.min(
                this.worldWidth - this.width,
                this.x
            )
        );

        // Vertical camera remains fixed
        this.y = 0;

    }

    // Convert world position to screen position
    worldToScreenX(worldX) {

        return worldX - this.x;

    }

    worldToScreenY(worldY) {

        return worldY - this.y;

    }

}
