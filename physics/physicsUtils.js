import Vector from './vector.js';

export default {

screenWrap(object,width,height){
  if( object.position.x < 0 ){object.position.x += width;}
  if( object.position.y < 0 ){object.position.y += height;}
  if( object.position.x > width ){object.position.x -= width;}
  if( object.position.y > height ){object.position.y -= height;}
},

aimAtCoords(entity,position){
  let dist = Vector.differenceVector(entity.position,position);
  let factor = dist.magnitude;
  factor = Math.min(factor/500, 1);
  dist = dist.unitVector;
  entity.aim = dist.scale(factor);
},

aimAtCoords2(entity,position){
  let dist = Vector.differenceVector(entity.position,position);
  dist = dist.unitVector;
  entity.aim = dist;
},

aMoveAtB(a,b){
  let look = Vector.differenceVector(a.position,b.position).unitVector;
  a.velocity.x += look.x;
  a.velocity.y += look.y;
},

moveApart(first, second){//assumes two circles. moves second object only
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

}