export default class eventListeners{
  constructor(contextArray){
    this.clientBox = {height:document.documentElement.clientHeight, width:document.documentElement.clientWidth};
    this.contextArray = contextArray;//context at index 0 should be background context
    this.contextArray.forEach((context)=>{ 
      context.canvas.height = this.clientBox.height;
      context.canvas.width = this.clientBox.width;
     });
    this.numberofConnectedGamepads = 0;
    drawBackground(this.contextArray[0],this.clientBox);//draws background on init

    window.addEventListener("gamepadconnected", (e) => { console.log(e); this.numberofConnectedGamepads++ });
    window.addEventListener("gamepaddisconnected", (e) => { console.log(e); this.numberofConnectedGamepads-- });
    window.addEventListener("resize",(e) =>{
      this.clientBox.height = document.documentElement.clientHeight;
      this.clientBox.width = document.documentElement.clientWidth;
      let grd = createBGgradient(this.contextArray[0],this.clientBox.width);
      this.contextArray.forEach((context) => {
        context.canvas.height = this.clientBox.height;
        context.canvas.width = this.clientBox.width;
      });
      this.contextArray[0].fillStyle = grd;//"linear-gradient(to right, #afe569 0%, #207cca 78%, #3b5b83 100%)";
      this.contextArray[0].fillRect(0,0,this.clientBox.width,this.clientBox.height);
    });
    window.addEventListener("contextmenu",(e)=>{e.preventDefault();},false);//this cancels the normal right-click menu
    
  }
}

function drawBackground(context,clientBox){
  let grd = createBGgradient(context,clientBox.width);
  context.fillStyle = grd;//"linear-gradient(to bottom right, #afe569 0%, #207cca 78%, #3b5b83 100%)";
  context.fillRect(0,0,clientBox.width,clientBox.height);
}

function createBGgradient(context,width){
  let grd = context.createLinearGradient(0, 0, width, 0);
  grd.addColorStop(0, "#afe569");
  grd.addColorStop(.8, "#207cca");
  grd.addColorStop(1, "#3b5b83");
  return grd;
}