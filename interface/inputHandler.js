import mouseInterface from './mouseInterface.js';
import keyboardInterface from './keyboardInterface.js';
import physicsUtils from '../physics/physicsUtils.js';

export default class inputHandler{
  constructor(player,canvasID){
    this.player = player;//I dont really like how player has to be a member here
    this.gamePaused = false;
    this.kI = new keyboardInterface();
    this.mI = new mouseInterface(canvasID);
    this.kI.addWatcher('KeyW').addWatcher('KeyA').addWatcher('KeyS').addWatcher('KeyD');
    this.kI.addWatcher('ArrowUp').addWatcher('ArrowDown').addWatcher('ArrowLeft').addWatcher('ArrowRight');
    this.kI.addCallback('Escape',[togglePause,this]);//todo: make this available only once game has started
    document.getElementById("pauseMenu").children[0].addEventListener("click", () => {this.gamePaused = false;} );
    document.getElementById("pauseMenu").children[1].addEventListener("click", () => {
      if(confirm("Are you sure you want to return to the main menu? your progress will be lost."))
        location.reload();
      else document.getElementById("pauseMenu").style = "display: flex";
    } );
    this.pauseButton = [0,0];
  }
  handleKeyboardAndMouseInput(){//maybe have this method take player as an input instead of the constructor
    physicsUtils.aimAtCoords(this.player,this.mI.mousePosition);
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
    buttons.forEach( (button,index) => {checkButton(this,button,index) });
  }
  checkPauseButton(){
    this.pauseButton[0] = this.pauseButton[1];
    let gamepads = navigator.getGamepads();
    let buttons = gamepads[0].buttons;
    this.pauseButton[1] = buttons[9].value;
    if(!this.pauseButton[0] && this.pauseButton[1])
      togglePause(this);
  }
}

function checkButton(inputHandler,button,index){
  inputHandler.checkPauseButton();
  if(button.value){
    switch(index){
      case 7: inputHandler.player.shootGun(); break;//7 = trigger
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