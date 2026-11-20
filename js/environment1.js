
class Environment {

    constructor(game) {
        this.game = game;
        this.objects = [];
    }

    update(dt) {
        // No environmental objects.
    }

    render(ctx) {
        // Empty battlefield.
        // Buildings and scenery are rendered by game.js.
    }

}
