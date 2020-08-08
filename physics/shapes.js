import Position from './position.js';

class shape{
  constructor(position=new Position(10,10),style='black'){
    this.position = position;
    this.style = style;
  }
  //setters
  setPosition(position){
    this.position = position;
    return this;
  }
  setStyle(style){
    this.style = style;
    return this;
  }
  collidesWith(other){
    if (Object.getPrototypeOf(this) == Object.getPrototypeOf(other))//type checking
      return this.homogenousCollision(other);
    else{
      if(this instanceof circle)
        return RectangleAndCircleCollide(other,this);
      else
        return RectangleAndCircleCollide(this,other);
    }
  }
}

export class circle extends shape{
  constructor(radius=10,position=new Position(10,10),style='black'){
    super(position,style);
    this.radius = radius;
  }
  //setter
  setRadius(r){
    this.radius = r;
    return this;
  }
  //utility
  draw(context){
    context.fillStyle = this.style;
    context.beginPath();
    context.arc(this.position.x,this.position.y,this.radius,0,2*Math.PI);
    context.fillStyle = this.style;
    context.fill();
  }
  isOnScreen(context){
    // this code runs faster in one line because of the logical && operator
    return (this.position.x + this.radius > 0 && this.position.x - this.radius < context.canvas.width && this.position.y + this.radius > 0 && this.position.y - this.radius < context.canvas.height)
  }
  homogenousCollision(other){
    let xDistance = Math.abs(this.position.x-other.position.x);
    let yDistance = Math.abs(this.position.y - other.position.y);
    let combinedRadii = this.radius + other.radius;
    return (xDistance*xDistance + yDistance*yDistance) < combinedRadii*combinedRadii
  }
}

export class rectangle extends shape{
  constructor(width=10,height=10,position,style){
    super(position,style);
    this.width = width;
    this.halfWidth = width/2;
    this.height = height;
    this.halfHeight = height/2;
  }
  //getter
  get center(){
    return {x:(this.position.x+this.halfWidth), y:(this.position.y+this.halfHeight)}
  }
  //setters
  setWidth(w){
    this.width = w;
    this.halfWidth = w/2;
    return this;
  }
  setHeight(h){
    this.height = h;
    this.halfHeight = h/2;
    return this;
  }
  //utility
  draw(context){
    context.fillStyle = this.style;
    context.fillRect(this.position.x,this.position.y,this.width,this.height);
  }
  isOnScreen(context){
    // this code runs faster in one line because of the logical && operator
    return (this.position.x + this.width> 0 && this.position.x - this.width < context.canvas.width && this.position.y + this.height > 0 && this.position.y - this.height < context.canvas.height)
  }
  homogenousCollision(other){
    if (this.position.x < other.position.x + other.width &&
        this.position.x + this.width > other.position.x &&
        this.position.y < other.position.y + other.height &&
        this.position.y + this.height > other.position.y)
          return true;
    return false;
  }
}

function RectangleAndCircleCollide(rectangle,circle){
  let rectangleCenter = rectangle.center;
  let xDistance = Math.abs(circle.position.x - rectangleCenter.x);
  let yDistance = Math.abs(circle.position.y - rectangleCenter.y);

  if (xDistance > rectangle.halfWidth + circle.radius) return false;
  if (yDistance > rectangle.halfHeight + circle.radius) return false;

  if (xDistance <= rectangle.halfWidth) return true;
  if (yDistance <= rectangle.halfHeight) return true;

  let edgeCase_Distance = (xDistance - rectangle.halfWidth)*(xDistance - rectangle.halfWidth) + (yDistance - rectangle.halfHeight)*(yDistance - rectangle.halfHeight);
  return edgeCase_Distance <= circle.radius*circle.radius;
}
