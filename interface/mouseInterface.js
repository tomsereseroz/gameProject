import Position from "../physics/position.js";

export default class mouseInterface{
  constructor(canvasID){
    this.boundingRectangle = document.getElementById(canvasID).getBoundingClientRect();
    this.mousePosition = new Position(0,0);
    this.mouseDown = false;
    document.onmousedown = () => {this.mouseDown = true;};
    document.onmouseup = () => {this.mouseDown = false;};
    document.onmousemove = event => {
      this.mousePosition.x = event.clientX - this.boundingRectangle.x;
      this.mousePosition.y = event.clientY - this.boundingRectangle.y;
    };
  }
}