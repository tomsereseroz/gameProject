import d2 from './2DUtils.js';
import Vector from './physics/vector.js';
export default {

createPlayerGradient(player,context,time){
  let playergrd = context.createRadialGradient(player.pos.x, player.pos.y, 5, player.pos.x, player.pos.y,40);
  playergrd.addColorStop(0, "purple");
  playergrd.addColorStop(.4+.3*Math.sin(2*time*Math.PI/2000), "black");
  playergrd.addColorStop(.8+.1*Math.sin(2*time*Math.PI/3000), "red");
  playergrd.addColorStop(.95+.05*Math.sin(2*time*Math.PI/600), "pink");
  return playergrd;
},

getHPStyle(entity,context){
  let grd = context.createRadialGradient(entity.pos.x, entity.pos.y, 2,entity.pos.x,entity.pos.y,entity.props[0]);
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

aimAtCoords(entity,pos){
  let dist = Vector.fromPositions(entity.pos,pos);
  let factor = dist.magnitude;
  factor = Math.min(factor/500, 1);
  dist = dist.unitVector;
  entity.aim = dist.scale(factor);
},

aMoveAtB(a,b){
  let look = d2.makeUnitVector(d2.distance(a.pos,b.pos));
  a.vel[0] += look[0];
  a.vel[1] += look[1];
},

moveApart(first, second){
  let dist = d2.distance(first.pos,second.pos);
  let distrad = d2.toRadius(dist);
  let diff = (first.props[0] + second.props[0]) - distrad;
  if(diff > 0){
    let factor = diff/distrad;
    dist = dist.map(x => x*factor);
    second.pos[0] += dist[0];
    second.pos[1] += dist[1];
  }
},

drawAimIndicator(entity,context){
  context.beginPath();
  context.strokeStyle = "pink";
  context.moveTo(entity.pos.x,entity.pos.y);
  context.lineWidth = 10;
  context.lineTo(entity.pos.x+entity.aim.dx*40,entity.pos.y+entity.aim.dy*40);
  context.stroke();
},

screenWrap(object,width,height){
  if( object.pos[0] < 0 ){object.pos[0] += width;}
  if( object.pos[1] < 0 ){object.pos[1] += height;}
  if( object.pos[0] > width ){object.pos[0] -= width;}
  if( object.pos[1] > height ){object.pos[1] -= height;}
},

}