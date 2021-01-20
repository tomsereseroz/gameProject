import Position from "../physics/position.js";//could potentially remove this reference if needed

export default class mouseInterface{
  constructor(canvasID){
    this.boundingRectangle = document.getElementById(canvasID).getBoundingClientRect();
    this.mousePosition = new Position(0,0);
    this.mouseDown = false;
    this.rightMouseDown = false;
    document.onmousedown = (e) => {
      if(e.button==0)this.mouseDown = true;
      if(e.button==2)this.rightMouseDown = true;
    };//button 0 is left click, 2 is right click
    document.onmouseup = (e) => {
      if(e.button==0)this.mouseDown = false;
      if(e.button==2)this.rightMouseDown = false;
    };
    document.onmousemove = event => {
      this.mousePosition.x = event.clientX - this.boundingRectangle.x;
      this.mousePosition.y = event.clientY - this.boundingRectangle.y;
    };
  }
}