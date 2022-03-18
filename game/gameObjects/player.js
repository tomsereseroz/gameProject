import {Entity} from '../../physics/objects.js';
import { circle, arc} from '../../physics/shapes.js';
import {gun, shotgun} from './guns.js';
import drawingUtils from '../drawingUtils.js';

export default class Player extends Entity{
  constructor(projArray,position){
    super();
    this.gun = new shotgun(projArray);
    this.mass = 10;
    this.friction = 0.05;
    this.health = 490;
    this.position = position;
    this.shape = new circle(40,this.position);
    this.hurtSound = new Audio("../../assets/Oof.mp3");
    this.shieldSound = new Audio('../../assets/shieldLoop.mp3');
    this.shieldSound.loop = true;
    this.shieldEnergy = 200;
    this.shieldActivated = false;
    this.shieldBottomedOut = false;
    this.shield = undefined;
    this.invulnerableTime = 0;
  }
  Tick(time,context){
    super.Tick();
    let playergrd = this.generatePlayerGradient(time,context);
    this.shape.style = playergrd;
    this.stayInBounds(context);
    if(this.shieldActivated)
      this.shieldEnergy--;
    else{
      this.shieldSound.pause();
      if(this.shield){
        this.shield.health = 0;
        this.shield = undefined;
      }
      if(this.shieldEnergy < 200)
        this.shieldEnergy++;
    }
    this.shieldActivated = false;
    if(this.invulnerableTime)
      this.invulnerableTime--;
    if(this.shieldEnergy > 100)
    this.shieldBottomedOut = false;
  }
  Draw(context){
    super.Draw(context);
    drawingUtils.drawAimIndicator(this,context);
    this.displayShieldBar();
  }
  generatePlayerGradient(time,context){
    let playergrd = context.createRadialGradient(this.position.x, this.position.y, 5, this.position.x, this.position.y,40);
    playergrd.addColorStop(0, "purple");
    playergrd.addColorStop(.4+.3*Math.sin(2*time*Math.PI/2000), "black");
    playergrd.addColorStop(.8+.1*Math.sin(2*time*Math.PI/3000), "red");
    playergrd.addColorStop(.95+.05*Math.sin(2*time*Math.PI/600), "pink");
    return playergrd;
  }
  applyDamage(source){
    if(!this.invulnerableTime){
      this.health-=source.damage; 
      this.hurtSound.play();
      drawingUtils.drawHPBar(this);
      this.invulnerableTime = 2;
    }
    if(this.health<=0){
      let shieldEnergy = document.getElementById('shieldEnergy');
      shieldEnergy.style.display = 'none';
    }
    return this;
  }
  setVolume(volume){
    this.hurtSound.volume = volume;
    this.gun.setVolume(volume);
    this.shieldSound.volume = volume;
  }
  activateShield(objectHandler){
    if(this.shieldEnergy == 0 ){
      this.shieldBottomedOut = true;
      this.shield.health = 0;//objects with 0 health are deleted. maybe just delete from object array to clean this up
    }
    if(!this.shieldBottomedOut){
      if(!this.shield){
        let shield = new Shield(this);
        this.shield = shield;
        objectHandler.addPlayer(shield);
      }
      this.shieldActivated = true;
      this.shieldSound.play();
    }
  }
  displayShieldBar(){
    let shieldEnergy = document.getElementById('shieldEnergy');
    shieldEnergy.style.width = (this.shieldEnergy).toString() + 'px';
    if(this.shieldBottomedOut)
      shieldEnergy.style.backgroundColor = 'yellow';
    else
      shieldEnergy.style.backgroundColor = 'cyan';
  }
}

class Shield extends Entity{
  constructor(player){
    super();
    this.hurtSound = new Audio('../../assets/shieldHit.mp3');
    this.velocity = player.velocity;
    this.aim = player.aim;
    this.health = 3000;
    this.mass = 200;
    this.width = 10;
    this.radius = 60;
    this.position = player.position;
    this.midpointAngle = Math.atan2(-this.aim.y,this.aim.x);
    this.player = player;
    this.shape = new arc(this.radius,this.position,'black',this.midpointAngle-Math.PI/2,this.midpointAngle+Math.PI/2,this.width.toString());
    let size = Math.PI*this.player.shieldEnergy/400;
    this.shape.startAngle = this.midpointAngle-size;
    this.shape.endAngle = this.midpointAngle+size
  }
  Draw(context){
    this.midpointAngle = Math.atan2(-this.aim.y,this.aim.x);
    let size = Math.PI*this.player.shieldEnergy/400;
    this.shape.startAngle = this.midpointAngle-size;
    this.shape.endAngle = this.midpointAngle+size
    this.generateShieldGradient(context);
    super.Draw(context);
  }
  Tick(){
    if(this.health)
      this.health = 3000;
  }
  generateShieldGradient(context){
    let shieldGrd = context.createRadialGradient(this.position.x,this.position.y,this.radius-this.width/2,this.position.x,this.position.y,this.radius+this.width/2);
    shieldGrd.addColorStop(0,'rgba(0,0,255,0.5)');
    shieldGrd.addColorStop(0.5,'rgba(0,255,255,0.5)');
    shieldGrd.addColorStop(1,'rgba(255,255,255,0.5)');
    this.shape.style = shieldGrd;
  }
  setVolume(volume){
    this.hurtSound.volume = volume;
  }
}