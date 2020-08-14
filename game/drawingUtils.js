export default{
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
  
  drawAimIndicator(entity,context,strokeStyle='pink'){
    context.beginPath();
    context.strokeStyle = strokeStyle;
    context.moveTo(entity.position.x,entity.position.y);
    context.lineWidth = 10;
    context.lineTo(entity.position.x+entity.aim.x*40,entity.position.y+entity.aim.y*40);
    context.stroke();
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