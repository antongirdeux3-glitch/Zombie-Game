
class HUD {

    constructor(game) {

        this.game = game;

        this.health = 100;
        this.maxHealth = 100;

        this.armor = 100;
        this.maxArmor = 100;

        this.ammo = 30;
        this.maxAmmo = 30;
        this.reserveAmmo = 120;

        this.score = 0;
        this.kills = 0;

    }

    render(ctx) {

        this.drawHealth(ctx);
        this.drawArmor(ctx);
        this.drawAmmo(ctx);
        this.drawScore(ctx);
        this.drawKills(ctx);
        this.drawPause(ctx);

    }

    drawPanel(ctx, x, y, width, height) {

        ctx.fillStyle = "rgba(10, 15, 12, 0.85)";
        ctx.fillRect(x, y, width, height);

        ctx.strokeStyle = "#59645A";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width, height);

    }

    drawBar(ctx, x, y, width, height, value, max, color) {

        const percentage = Math.max(0, Math.min(1, value / max));

        ctx.fillStyle = "#252A27";
        ctx.fillRect(x, y, width, height);

        ctx.fillStyle = color;
        ctx.fillRect(x, y, width * percentage, height);

    }

    drawHealth(ctx) {

        this.drawPanel(ctx, 20, 20, 190, 55);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 13px Arial";
        ctx.fillText("HEALTH", 32, 39);

        this.drawBar(
            ctx, 32, 47, 165, 12,
            this.health, this.maxHealth, "#C83232"
        );

    }

    drawArmor(ctx) {

        this.drawPanel(ctx, 220, 20, 190, 55);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 13px Arial";
        ctx.fillText("ARMOR", 232, 39);

        this.drawBar(
            ctx, 232, 47, 165, 12,
            this.armor, this.maxArmor, "#368BCB"
        );

    }

    drawAmmo(ctx) {

        this.drawPanel(ctx, 20, 85, 190, 55);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 13px Arial";
        ctx.fillText("AMMUNITION", 32, 105);

        ctx.font = "bold 17px Arial";
        ctx.fillStyle = "#F5D76E";

        ctx.fillText(
            `${this.ammo} / ${this.reserveAmmo}`,
            32, 128
        );

    }

    drawScore(ctx) {

        this.drawPanel(ctx, 220, 85, 190, 55);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 13px Arial";
        ctx.fillText("SCORE", 232, 105);

        ctx.font = "bold 18px Arial";
        ctx.fillStyle = "#F5D76E";
        ctx.fillText(this.score.toString(), 232, 128);

    }

    drawKills(ctx) {

        this.drawPanel(ctx, 20, 150, 190, 45);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 13px Arial";

        ctx.fillText(`ZOMBIE KILLS: ${this.kills}`, 32, 178);

    }

    drawPause(ctx) {

        const width = this.game.width;

        this.drawPanel(ctx, width - 90, 20, 70, 40);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 13px Arial";
        ctx.fillText("PAUSE", width - 80, 45);

    }

}
