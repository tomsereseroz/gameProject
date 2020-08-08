export default function sound(src) {
  this.sound = new Audio(src);
  this.play = function(){
      this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}