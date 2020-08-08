export default class keyboardInterface{
  constructor(){
    this.codeMap = [];//map at 'code' = true if key with matching code is pressed down
    this.callbackMap = {};//kinda fucked up implementation but callbackmap is an object with named arrays.
    //current usage is callbackmap."code" = [callbackFunction, firstArgument]
    window.onkeydown = (event)=>{
      if(this.codeMap[event.code] != undefined)
        this.codeMap[event.code] = true;
      if(this.callbackMap[event.code]!=undefined)
        this.callbackMap[event.code][0](this.callbackMap[event.code][1]);
    };
    window.onkeyup = (event)=>{
      if(this.codeMap[event.code] != undefined)
        this.codeMap[event.code] = false;
    };
  }
  addCallback(code,callbackObject){//adds a keypress event that calls a given function
    this.callbackMap[code] = callbackObject;
    return this;
  }
  addWatcher(code){
    this.codeMap[code] = false;
    return this;
  }
  removeCallback(code){//adds a keypress event that calls a given function
    delete this.callbackMap[code];
    return this;
  }
  removeWatcher(code){
    delete this.codeMap[code];
    return this;
  }
}

/*
common keycodes: ArrowUp, ArrowDown, ... w, a, s, d ... 
*/