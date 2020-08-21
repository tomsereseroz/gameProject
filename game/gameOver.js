export default function gameOver(contextArray){
  let wastedAudio = new Audio('../assets/wasted.mp3');
  wastedAudio.play();
  let svgObj = document.getElementById("svg-object");
  svgObj.setAttribute("style", "opacity: 1");
  let monoArray = getMonochromeArray(contextArray);
  fadeToMonochrome(contextArray,monoArray);
  setTimeout(displayWasted,2250);
}

function fadeToMonochrome(contextArray,imgDataArray,iteration=0){
  //console.log("starting, iteration: ",iteration);
  contextArray.forEach((context,index) => {
    let imgData = context.getImageData(0,0,context.canvas.width,context.canvas.height);
    let pixels = imgData.data;
    let monochromePixels = imgDataArray[index].data;
    for(var i=0,n=pixels.length;i<n;i+=4){
      for(var j = 0;j<3;j++){
        let sample = pixels[i+j];
        sample = sample*9 + monochromePixels[i+j];
        sample = sample/10
        pixels[i+j] = sample;
      }
    }
    context.putImageData(imgData,0,0);
  });
  if(iteration<200)
    requestAnimationFrame(()=>{fadeToMonochrome(contextArray,imgDataArray,++iteration)})
  else jumpToMonochrome(contextArray);
}

function getMonochromeArray(contextArray){
  let imgDataArray = [];
  contextArray.forEach((context,index) => {
    imgDataArray[index] = context.getImageData(0,0,context.canvas.width,context.canvas.height);
    let pixels = imgDataArray[index].data;
    for(var i=0,n=pixels.length;i<n;i+=4){
      var greyScale = pixels[i]*0.3+pixels[i+1]*0.59+pixels[i+2]*0.11;
      pixels[i] = greyScale;
      pixels[i+1] = greyScale;
      pixels[i+2] = greyScale;
    }
  });
  return imgDataArray;
}

function jumpToMonochrome(contextArray){
  contextArray.forEach((context) => {
    let imgData = context.getImageData(0,0,context.canvas.width,context.canvas.height);
    let pixels = imgData.data;
    for(var i=0,n=pixels.length;i<n;i+=4){
      var greyScale = pixels[i]*0.3+pixels[i+1]*0.59+pixels[i+2]*0.11;
      pixels[i] = greyScale;
      pixels[i+1] = greyScale;
      pixels[i+2] = greyScale;
    }
    context.putImageData(imgData,0,0);
  });
}

function displayWasted(){
  var a = document.createElement("p");
  a.className = "wasted";
  a.style = "position:absolute; top:50%; right:50%; z-index:4; font-size: 80px; color: red; -webkit-text-stroke: 3px black; transform: translate(50%, -50%); font-family: Impact; ";
  var node = document.createTextNode("Game Over");
  a.appendChild(node);
  var stage = document.getElementById("stage");
  stage.appendChild(a);
}