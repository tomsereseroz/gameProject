import GameInterface from './game_interface/game_interface.js'
import Position from '../game_interface/physics/position.js.js';
import Vector from '../game_interface/physics/vector.js';
import Entity from './game_objects/entity.js';
import Gun from './game_objects/gun.js';
import EntityArray from './game_objects/arrays/entity_array.js.js';
import ProjectileArray from './game_objects/arrays/projectile_array.js';
import CollisionType from '../game_interface/physics/enums/collisionType.js';


export default class ShooterInterface extends GameInterface {

    //OVERRIDE
    init() {
        this.projArray = ProjectileArray();
        this.entArray = EntityArray();

        let gun = Gun(projectileArry, 60);
        this.player = Entity(
            Position(3 * width / 4, 3 * height / 4),
            null,
            1000,
            .05,
            CollisionType.player,
            40,
            null,
            gun
        )
        this.entArray.add(this.player);

        this.playergrd = utils.createPlayerGradient(player, time);
        this.heartImg = document.getElementById("heart");
        this.emptyheartImg = document.getElementById("emptyheart");

        this.playergun = Gun();
        player.setGun(playergun);
    }

    //OVERRIDE
    createBackground() {
        let gradient = this.context.createLinearGradient(0, 0, this.width, 0);
        gradient.addColorStop(0, "#afe569");
        gradient.addColorStop(.8, "#207cca");
        gradient.addColorStop(1, "#3b5b83");
        return gradient;
    }

    //OVERRIDE
    keyDownHandler(event) {
        if (event.keyCode >= 37 && event.keyCode <= 40) {
            keysdown[event.keyCode - 37] = 1;
        } else
            switch (event.keyCode) {
                case 65:
                    keysdown[0] = 1;
                    break;
                case 87:
                    keysdown[1] = 1;
                    break;
                case 68:
                    keysdown[2] = 1;
                    break;
                case 83:
                    keysdown[3] = 1;
                    break;
                default:
                    break;
            }
    }

    //OVERRIDE
    keyUpHandler(event) {
        if (event.keyCode >= 37 && event.keyCode <= 40) {
            keysdown[event.keyCode - 37] = 0;
        } else
            switch (event.keyCode) {
                case 65:
                    keysdown[0] = 0;
                    break;
                case 87:
                    keysdown[1] = 0;
                    break;
                case 68:
                    keysdown[2] = 0;
                    break;
                case 83:
                    keysdown[3] = 0;
                    break;
                default:
                    break;
            }
    }

    //OVERRIDE
    handleGamepadEvents(axes, buttons) {
        this.player.velocity.x += axes[0];
        this.player.velocity.y += axes[1];
        this.player.aim.x = axes[2];
        this.player.aim.y = axes[3];

        buttons.forEach(checkButton);

    }

    checkButton(button, index) {
        if (button.value) {
            switch (index) {
                case 7: player.shootGun();//7 = trigger
                default:
            }
        }
    }

    //OVERRIDE
    handleKeyEvents(keysDown) {
        this.player.velocity.x += this.keysdown[2] - this.keysdown[0];
        this.player.velocity.y += this.keysdown[3] - this.keysdown[1];
    }

    //OVERRIDE
    handleMouseEvents() {
        player.aimAtCoords(this.mousePosition);

        if (this.mousedown) {
            player.shootGun();
        }
    }

    //OVERRIDE
    drawFrame() {
        entArray.draw();
        projArray.draw();
        projArray.tick();
        entArray.tick();

        screenWrap(player);
        if (entArray.array.length < 5) {
            let enemy = Entity(
                Position(Math.random() * this.width, Math.random() * this.height),
                Vector(0, 0),
                30,
                null,
                CollisionType.enemy,
                null,
                70,
                null,
                100,
                null
            );

            entArray.add(enemy);
            while (this.player.position.distanceTo(other.position) < 300) {
                enemy.position(Position(Math.random() * width, Math.random() * height));
            };

        }

        this.context.drawImage(heartImg, 10, 10);
        this.context.drawImage(heartImg, 55, 10);
        this.context.drawImage(emptyheartImg, 100, 10);
    }

    drawButton(button, index) {
        context.fillStyle = "black";
        if (button.value) { context.fillStyle = "white"; }
        var xval = Math.floor(index / 5) * 100 + 20;
        var yval = (index * 100 + 20) % height;
        context.fillRect(xval, yval, 60, 60);

    }

    createPlayerGradient(player, time) {
        let playerGradient = this.context.createRadialGradient(player.postion.x, player.postion.y, 5, player.postion.x, player.postion.y, 40);
        playerGradient.addColorStop(0, "purple");
        playerGradient.addColorStop(.4 + .3 * Math.sin(2 * time * Math.PI / 2000), "black");
        playerGradient.addColorStop(.8 + .1 * Math.sin(2 * time * Math.PI / 3000), "red");
        playerGradient.addColorStop(.95 + .05 * Math.sin(2 * time * Math.PI / 600), "pink");
        return playerGradient;
    }

    getHPStyle(entity) {
        let gradient = this.context.createRadialGradient(entity.postion.x, entity.postion.y, 2, entity.postion.x, entity.postion.y, entity.postion.x);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(entity.health / 101, "red");
        gradient.addColorStop(1, "black");
        return gradient;
    }

    moveApart(circle1, circle2) {
        let v = Vector(first.position, second.position);
        let distance = v.magnitude;
        let diff = (circle1.radius + circle2.radius) - distance;
        if (diff > 0) {
            let factor = diff / distance;
            v.scale(factor);
            second.addVector(v);
        }
    }

    drawAimIndicator(entity) {
        this.context.beginPath();
        this.context.strokeStyle = "pink";
        this.context.moveTo(entity.position.x, entity.position.y);
        this.context.lineWidth = 10;
        this.context.lineTo(entity.position.x + entity.aim.x * 40, entity.position.y + entity.aim.y * 40);
        this.context.stroke();
    }

    screenWrap(object) {
        if (object.position.x < 0) { object.position.x += this.width; }
        if (object.position.y < 0) { object.position.y += this.height; }
        if (object.position.x > this.width) { object.position.x -= this.width; }
        if (object.position.y > this.height) { object.position.y -= this.height; }
    }
}