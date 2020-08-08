import mouseInterface from './interface/mouseInterface.js';
import keyboardInterface from './interface/keyboardInterface.js';
import utils from './gameUtils.js';

export default class inputHandler{
  constructor(player,canvasID){
    this.player = player;
    this.gamePaused = false;
    this.kI = new keyboardInterface();
    this.mI = new mouseInterface(canvasID);
    this.kI.addWatcher('KeyW').addWatcher('KeyA').addWatcher('KeyS').addWatcher('KeyD');
    this.kI.addWatcher('ArrowUp').addWatcher('ArrowDown').addWatcher('ArrowLeft').addWatcher('ArrowRight');
    this.kI.addCallback('Escape',[togglePause,this]);
    document.getElementById("pauseMenu").children[0].addEventListener("click", () => {this.gamePaused = false;} );
    document.getElementById("pauseMenu").children[1].addEventListener("click", () => {location.reload();} );

  }
  handleKeyboardAndMouseInput(){//maybe have this method take player as an input instead of the constructor
    utils.aimAtCoords(this.player,this.mI.mousePosition);
    if(this.kI.codeMap['KeyW']||this.kI.codeMap['ArrowUp'])//returns true if key is pressed
      this.player.velocity.y -= this.player.acceleration;
    if(this.kI.codeMap['KeyS']||this.kI.codeMap['ArrowDown'])//might need to add codeMap['S'],['A'] etc.
      this.player.velocity.y += this.player.acceleration;
    if(this.kI.codeMap['KeyA']||this.kI.codeMap['ArrowLeft'])
      this.player.velocity.x -= this.player.acceleration;
    if(this.kI.codeMap['KeyD']||this.kI.codeMap['ArrowRight'])
      this.player.velocity.x += this.player.acceleration;
    if(this.mI.mouseDown)
      this.player.shootGun();
  }
  handleGamepadInput(){
  //follows 'standard gamepad input' and assumes player is using gamepad[0]
    let cutoff = 0.05;
    let gamepads = navigator.getGamepads();
    let axes = gamepads[0].axes.slice();//this copies the array so the elements may be changed
    let buttons = gamepads[0].buttons;
    for(let i = 0; i<4; i++)
        if(Math.abs(axes[i]) < cutoff)
          axes[i] = 0;
    this.player.velocity.x += axes[0]*this.player.acceleration;
    this.player.velocity.y += axes[1]*this.player.acceleration;
    this.player.aim.x = axes[2];
    this.player.aim.y = axes[3];
    buttons.forEach( (button,index) => {checkButton(this.player,button,index) });
  }
}

function checkButton(player,button,index){
  if(button.value){
    switch(index){
      case 7: player.shootGun();//7 = trigger
      default:
    }
  }
}

function togglePause(inputHandler){
  inputHandler.gamePaused = !inputHandler.gamePaused;
  if(inputHandler.gamePaused)
    document.getElementById("pauseMenu").style = "display: flex"
  else
  document.getElementById("pauseMenu").style = "display: none"
}