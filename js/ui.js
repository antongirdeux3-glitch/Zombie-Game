
class UI {

    constructor(game) {

        this.game = game;

        this.missionTime = 0;

    }

    // =====================================
    // UPDATE
    // =====================================

    update(dt) {

        this.missionTime += dt;

    }

    // =====================================
    // RENDER
    // =====================================

    render(ctx) {

        this.drawTopPanel(ctx);
        this.drawPlayerStatus(ctx);
        this.drawCombatStats(ctx);
        this.drawWeaponPanel(ctx);
        this.drawMissionInfo(ctx);
        this.drawXP(ctx);

    }

    // =====================================
    // PANEL
    // =====================================

    drawPanel(ctx, x, y, width, height) {

        ctx.fillStyle = "rgba(10, 14, 16, 0.88)";
        ctx.fillRect(x, y, width, height);

        ctx.strokeStyle = "#69747a";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

    }

    // =====================================
    // PROGRESS BAR
    // =====================================

    drawBar(ctx, x, y, width, height, value, maxValue, color) {

        const percentage = maxValue > 0
            ? Math.max(0, Math.min(1, value / maxValue))
            : 0;

        ctx.fillStyle = "#252a2d";
        ctx.fillRect(x, y, width, height);

        ctx.fillStyle = color;
        ctx.fillRect(x, y, width * percentage, height);

        ctx.strokeStyle = "#aab0b3";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width, height);

    }

    // =====================================
    // PLAYER HEALTH AND ARMOR
    // =====================================

    drawTopPanel(ctx) {

        const player = this.game.player;

        this.drawPanel(ctx, 20, 15, 340, 105);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 19px Arial";
        ctx.fillText("PLAYER STATUS", 35, 42);

        // Health
        ctx.fillStyle = "#e8e8e8";
        ctx.font = "bold 13px Arial";
        ctx.fillText("HEALTH", 35, 65);

        this.drawBar(
            ctx,
            105, 53, 220, 15,
            player.health,
            player.maxHealth,
            "#36c957"
        );

        ctx.fillStyle = "#ffffff";
        ctx.font = "11px Arial";

        ctx.fillText(
            `${player.health}/${player.maxHealth}`,
            270, 65
        );

        // Armor
        ctx.fillStyle = "#e8e8e8";
        ctx.fillText("ARMOR", 35, 94);

        this.drawBar(
            ctx,
            105, 82, 220, 15,
            player.armor,
            player.maxArmor,
            "#3498db"
        );

        ctx.fillStyle = "#ffffff";

        ctx.fillText(
            `${player.armor}/${player.maxArmor}`,
            270, 94
        );

    }

    // =====================================
    // PLAYER RANK AND GRENADES
    // =====================================

    drawPlayerStatus(ctx) {

        const player = this.game.player;

        this.drawPanel(ctx, 375, 15, 210, 105);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 17px Arial";
        ctx.fillText("RANK", 390, 43);

        ctx.fillStyle = "#f0c34e";
        ctx.font = "bold 22px Arial";
        ctx.fillText(player.rank, 390, 75);

        ctx.fillStyle = "#cccccc";
        ctx.font = "13px Arial";

        ctx.fillText(
            "GRENADES: " + player.grenades,
            390, 101
        );

    }

    // =====================================
    // COMBAT STATISTICS
    // =====================================

    drawCombatStats(ctx) {

        const player = this.game.player;

        this.drawPanel(ctx, 610, 15, 300, 105);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 16px Arial";

        ctx.fillText("COMBAT STATISTICS", 625, 43);

        // Score
        ctx.fillStyle = "#f0c34e";
        ctx.font = "bold 22px Arial";

        ctx.fillText(
            player.score.toLocaleString(),
            625, 80
        );

        ctx.fillStyle = "#cccccc";
        ctx.font = "12px Arial";

        ctx.fillText("SCORE", 625, 103);

        // Zombie kills
        ctx.fillStyle = "#e45b4f";
        ctx.font = "bold 22px Arial";

        ctx.fillText(
            player.kills.toString(),
            770, 80
        );

        ctx.fillStyle = "#cccccc";
        ctx.font = "12px Arial";

        ctx.fillText("ZOMBIE KILLS", 770, 103);

    }

    // =====================================
    // WEAPON AND AMMUNITION
    // =====================================

    drawWeaponPanel(ctx) {

        const player = this.game.player;

        this.drawPanel(ctx, 970, 15, 290, 105);

        ctx.fillStyle = "#cccccc";
        ctx.font = "bold 13px Arial";

        ctx.fillText("CURRENT WEAPON", 985, 40);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 18px Arial";

        ctx.fillText(
            player.weapon,
            985, 65
        );

        ctx.fillStyle = "#f0c34e";
        ctx.font = "bold 25px Arial";

        ctx.fillText(
            `${player.ammo} / ${player.reserveAmmo}`,
            985, 100
        );

    }

    // =====================================
    // MISSION TIMER
    // =====================================

    drawMissionInfo(ctx) {

        this.drawPanel(ctx, 520, 630, 240, 70);

        const minutes = Math.floor(this.missionTime / 60);
        const seconds = Math.floor(this.missionTime % 60);

        const timeText =
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0");

        ctx.fillStyle = "#cccccc";
        ctx.font = "bold 13px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            "MISSION TIME",
            640, 652
        );

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 25px monospace";

        ctx.fillText(
            timeText,
            640, 683
        );

        ctx.textAlign = "left";

    }

    // =====================================
    // EXPERIENCE
    // =====================================

    drawXP(ctx) {

        const player = this.game.player;

        this.drawPanel(ctx, 20, 630, 340, 70);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 13px Arial";

        ctx.fillText(
            "EXPERIENCE",
            35, 651
        );

        ctx.fillStyle = "#cccccc";
        ctx.font = "12px Arial";

        ctx.fillText(
            `${player.xp} / ${player.maxXP} XP`,
            35, 681
        );

        this.drawBar(
            ctx,
            145, 663, 195, 13,
            player.xp,
            player.maxXP,
            "#e6b83f"
        );

    }

}
