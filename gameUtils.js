import Vector from './physics/vector.js';

export default {

createPlayerGradient(player,context,time){
  let playergrd = context.createRadialGradient(player.position.x, player.position.y, 5, player.position.x, player.position.y,40);
  playergrd.addColorStop(0, "purple");
  playergrd.addColorStop(.4+.3*Math.sin(2*time*Math.PI/2000), "black");
  playergrd.addColorStop(.8+.1*Math.sin(2*time*Math.PI/3000), "red");
  playergrd.addColorStop(.95+.05*Math.sin(2*time*Math.PI/600), "pink");
  return playergrd;
},

getHPStyle(entity,context){
  let grd = context.createRadialGradient(entity.position.x, entity.position.y, 2,entity.position.x,entity.position.y,entity.shape.radius);
  grd.addColorStop(0, "white");
  grd.addColorStop(entity.health/101, "red");
  grd.addColorStop(1, "black");
  return grd;
},

createBGgradient(context,width){
  let grd = context.createLinearGradient(0, 0, width, 0);
  grd.addColorStop(0, "#afe569");
  grd.addColorStop(.8, "#207cca");
  grd.addColorStop(1, "#3b5b83");
  return grd;
},

aimAtCoords(entity,position){
  let dist = Vector.differenceVector(entity.position,position);
  let factor = dist.magnitude;
  factor = Math.min(factor/500, 1);
  dist = dist.unitVector;
  entity.aim = dist.scale(factor);
},

aMoveAtB(a,b){
  let look = Vector.differenceVector(a.position,b.position).unitVector;
  a.velocity.x += look.x;
  a.velocity.y += look.y;
},

moveApart(first, second){
  let dist = Vector.differenceVector(first.position,second.position);
  let distrad = dist.magnitude;
  let diff = (first.shape.radius + second.shape.radius) - distrad;
  if(diff > 0){
    let factor = diff/distrad;
    dist.scale(factor);
    second.position.x += dist.x;
    second.position.y += dist.y;
  }
},

drawAimIndicator(entity,context,strokeStyle='pink'){
  context.beginPath();
  context.strokeStyle = strokeStyle;
  context.moveTo(entity.position.x,entity.position.y);
  context.lineWidth = 10;
  context.lineTo(entity.position.x+entity.aim.x*40,entity.position.y+entity.aim.y*40);
  context.stroke();
},

screenWrap(object,width,height){
  if( object.position.x < 0 ){object.position.x += width;}
  if( object.position.y < 0 ){object.position.y += height;}
  if( object.position.x > width ){object.position.x -= width;}
  if( object.position.y > height ){object.position.y -= height;}
},

drawButton(button, index){//this is to see where a button maps with a certain gamepad/. use buttons.forEach(drawButton)
  context.fillStyle = "black";
  if(button.value){context.fillStyle = "white";}
  var xval = Math.floor(index/5)*100+20;
  var yval = (index*100+20)%height;
  context.fillRect(xval,yval,60,60);
  a
},

setStyleBasedOnType(entity,type,time,context){
  if(type == 9999)return this.createPlayerGradient(entity,context,time);
  return this.getHPStyle(entity,context);
},

}