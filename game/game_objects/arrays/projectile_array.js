import GameObjectArray from './game_object_array.js';

export default class ProjectileArray extends GameObjectArray {

    tick() {
        var deleted = false;

        for (var i = 0; i < this.array.length; i++) {
            deleted = false;

            if (this.array[i].hasTimedOut || this.array[i].isOffScreen) {
                deleted = true;

            } else {
                for (var j = 0; j < entArray.array.length; j++) {
                    if (this.array[i].collidesWith(entArray.array[j]) && this.array[i].collisionType != entArray.array[j].collisionType) {
                        projectile = this.array[i];
                        entity = entArray.array[j];
                        entity.damage(projectile).conserveMomentum(projectile);

                        if (entity.healthIsDepleted()) {
                            entArray.array.splice(j, 1);
                            j--

                        }

                        deleted = true;
                        break;
                    }
                }

            }

            if (deleted) {
                this.array.splice(i, 1);
                i--;

            } else this.array[i].tick();
        }
    }
    
}