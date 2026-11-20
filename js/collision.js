
// ==========================================
// ZOMBIE ASSAULT
// COLLISION SYSTEM
// ==========================================

class Collision {

    // Axis-aligned bounding box collision
    static checkAABB(a, b) {

        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );

    }

    // Check horizontal overlap
    static horizontalOverlap(a, b) {

        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x
        );

    }

    // Check vertical overlap
    static verticalOverlap(a, b) {

        return (
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );

    }

}
