//import hslWalker from '../coolStuff/colorWalk.js';

export default class eventListeners{
  constructor(contextArray,hslWalker){
    this.hslWalker = hslWalker;
    this.clientBox = {height:document.documentElement.clientHeight, width:document.documentElement.clientWidth};
    this.contextArray = contextArray;//context at index 0 should be background context
    this.contextArray.forEach((context)=>{ 
      context.canvas.height = this.clientBox.height;
      context.canvas.width = this.clientBox.width;
    });
    this.hslWalker.updateSize(this.contextArray[0]);
    this.numberofConnectedGamepads = 0;
    window.addEventListener("gamepadconnected", (e) => { console.log(e); this.numberofConnectedGamepads++ });
    window.addEventListener("gamepaddisconnected", (e) => { console.log(e); this.numberofConnectedGamepads-- });
    window.addEventListener("resize",() =>{
      this.clientBox.height = document.documentElement.clientHeight;
      this.clientBox.width = document.documentElement.clientWidth;
      this.contextArray.forEach((context) => {
        context.canvas.height = this.clientBox.height;
        context.canvas.width = this.clientBox.width;
      });
      this.hslWalker.updateSize(this.contextArray[0]);
    });
    window.addEventListener("contextmenu",(e)=>{e.preventDefault();},false);
  }
}