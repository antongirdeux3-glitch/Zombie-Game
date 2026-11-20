
class Environment {

    constructor(game) {
        this.game = game;
        this.objects = [];

        this.barrelImage = new Image();
        this.barrelImage.src = "assets/environment/barrel.png";

        this.createObjects();
    }

    createObjects() {
        this.objects = [
            // Wooden crates
            {
                x: 550,
                y: 550,
                width: 50,
                height: 50,
                type: "crate",
                solid: true
            },
            {
                x: 1100,
                y: 550,
                width: 50,
                height: 50,
                type: "crate",
                solid: true
            },
            {
                x: 1900,
                y: 550,
                width: 50,
                height: 50,
                type: "crate",
                solid: true
            },
            {
                x: 3000,
                y: 550,
                width: 50,
                height: 50,
                type: "crate",
                solid: true
            },

            // Metal barrels
            {
                x: 850,
                y: 540,
                width: 40,
                height: 60,
                type: "barrel",
                solid: true
            },
            {
                x: 1450,
                y: 540,
                width: 40,
                height: 60,
                type: "barrel",
                solid: true
            },
            {
                x: 2400,
                y: 540,
                width: 40,
                height: 60,
                type: "barrel",
                solid: true
            },
            {
                x: 3500,
                y: 540,
                width: 40,
                height: 60,
                type: "barrel",
                solid: true
            }
        ];
    }

    render(ctx) {
        for (const object of this.objects) {

            if (object.type === "crate") {
                this.drawCrate(ctx, object);
            }

            if (object.type === "barrel") {

                if (this.barrelImage.complete &&
                    this.barrelImage.naturalWidth > 0) {

                    ctx.drawImage(
                        this.barrelImage,
                        object.x,
                        object.y,
                        object.width,
                        object.height
                    );

                } else {
                    this.drawBarrel(ctx, object);
                }
            }
        }
    }

    drawCrate(ctx, object) {

        // Crate body
        ctx.fillStyle = "#79502e";
        ctx.fillRect(
            object.x,
            object.y,
            object.width,
            object.height
        );

        // Outer frame
        ctx.strokeStyle = "#d0a16b";
        ctx.lineWidth = 4;

        ctx.strokeRect(
            object.x + 3,
            object.y + 3,
            object.width - 6,
            object.height - 6
        );

        // Wooden cross
        ctx.beginPath();

        ctx.moveTo(
            object.x + 5,
            object.y + 5
        );

        ctx.lineTo(
            object.x + object.width - 5,
            object.y + object.height - 5
        );

        ctx.moveTo(
            object.x + object.width - 5,
            object.y + 5
        );

        ctx.lineTo(
            object.x + 5,
            object.y + object.height - 5
        );

        ctx.stroke();
    }

    drawBarrel(ctx, object) {

        // Barrel body
        ctx.fillStyle = "#555d61";

        ctx.fillRect(
            object.x,
            object.y + 5,
            object.width,
            object.height - 10
        );

        // Top rim
        ctx.fillStyle = "#879095";

        ctx.fillRect(
            object.x,
            object.y + 12,
            object.width,
            5
        );

        // Bottom rim
        ctx.fillRect(
            object.x,
            object.y + object.height - 18,
            object.width,
            5
        );

        // Barrel top
        ctx.fillStyle = "#25292c";

        ctx.fillRect(
            object.x + 5,
            object.y,
            object.width - 10,
            6
        );
    }

}
