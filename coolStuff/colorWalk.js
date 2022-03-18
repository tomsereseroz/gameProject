import vector3 from '../physics/vector3.js';

function keepInbounds(hslColor,hslVelocity){
  if(hslColor.y < 25) hslVelocity.y += 25 - hslColor.y;
  if(hslColor.y > 100){ hslColor.y = 100; hslVelocity.y *= -1; }
  if(hslColor.z < 25) hslVelocity.z += 25 - hslColor.z;
  if(hslColor.z > 80) hslVelocity.z -= hslColor.z - 80;
  hslColor.x %= 360;
}

function writeAsHSL(hslColor){
  let h = hslColor.x.toString();
  let s = hslColor.y.toString();
  let l = hslColor.z.toString();
  return "hsl("+h+", "+s+"%, "+l+"%)";
}

export default class hslWalker{
  constructor(context){
    this.hslColor = new vector3(0,50,50);
    this.hslVelocity = new vector3(Math.random()*11+4,5,5);

    this.hslColorArray = [this.hslColor];
    this.circleCenter = {x:context.canvas.width/2, y:context.canvas.height/2};
    this.circleRadius = Math.hypot(this.circleCenter.x, this.circleCenter.y);
    this.circleAngle = Math.random()*2*Math.PI;
    this.angularVelocity = Math.random()*0.2-0.1;

    this.x0 = this.circleCenter.x + this.circleRadius*Math.cos(this.circleAngle);
    this.y0 = this.circleCenter.y + this.circleRadius*Math.sin(this.circleAngle);
    this.x1 = this.circleCenter.x*2 - this.x0;
    this.y1 = this.circleCenter.y*2 - this.y0;

    this.step = 0;
    this.step2 = 5;

    for(let i=0; i < 9; i++){
      let newHslColor = this.hslColorArray[0].copy();
      newHslColor.add(this.hslVelocity);
      keepInbounds(newHslColor,this.hslVelocity);
      this.hslColorArray.unshift(newHslColor);
    }

  }
  updateSize(context){
    this.circleCenter = {x:context.canvas.width/2, y:context.canvas.height/2};
    this.circleRadius = Math.hypot(this.circleCenter.x, this.circleCenter.y);
  }
  draw(context){
    this.x0 = this.circleCenter.x + this.circleRadius*Math.cos(this.circleAngle);
    this.y0 = this.circleCenter.y + this.circleRadius*Math.sin(this.circleAngle);
    this.x1 = this.circleCenter.x*2 - this.x0;
    this.y1 = this.circleCenter.y*2 - this.y0;

    let grd = context.createLinearGradient(this.x0,this.y0,this.x1,this.y1);
    for(let i = 0 ; i < this.hslColorArray.length; i++){
      grd.addColorStop(i*0.1+this.step*0.005,writeAsHSL(this.hslColorArray[i]));
    }
    context.fillStyle = grd;
    context.fillRect(0,0,context.canvas.width,context.canvas.height)
    
    if(++this.step == 20){
      let newHslColor = this.hslColorArray[0].copy();
      newHslColor.add(this.hslVelocity);
      keepInbounds(newHslColor,this.hslVelocity);
      this.hslColorArray.unshift(newHslColor);
      this.hslColorArray.splice(this.hslColorArray.length-1,1);
      this.step = 0;
      if(--this.step2 == 0){
        this.angularVelocity = Math.random()*0.03-0.015;
        this.step2 = Math.floor(Math.random()*10);
      }
    }
    this.circleAngle += this.angularVelocity;
    if(this.circleAngle > 2*Math.PI ) this.circleAngle -= 2*Math.PI;
    if(this.circleAngle < 0 ) this.circleAngle += 2*Math.PI;
  }
}