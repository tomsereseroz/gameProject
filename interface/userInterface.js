export function showPauseMenu(){
  let pauseMenu = document.getElementById('pauseMenu');
  pauseMenu.style.display = 'grid';
}

export function hidePauseMenu(){
  let pauseMenu = document.getElementById('pauseMenu');
  pauseMenu.style.display = 'none';
}

export function initializeUI(){
  createPauseMenu();
  createShieldBar();
}

function createPauseMenu(){
  let pauseMenuDiv = document.createElement('div');
  pauseMenuDiv.setAttribute('id','pauseMenu');
  pauseMenuDiv.style.display = 'none';
  pauseMenuDiv.style.position = 'absolute';
  pauseMenuDiv.style.zIndex = '4';
  pauseMenuDiv.style.top = '50%';
  pauseMenuDiv.style.right = '50%';
  pauseMenuDiv.style.transform = 'translate(50%, -50%)';
  pauseMenuDiv.style.backgroundColor = 'rgba(0,0,0,0.1)';
  pauseMenuDiv.style.padding = '5px';
  pauseMenuDiv.style.borderRadius = '15px';
  pauseMenuDiv.style.gridTemplateColumns = 'auto auto';
  pauseMenuDiv.style.gridTemplateRows = 'auto auto';

  let resumeButton = document.createElement('button');
  resumeButton.setAttribute('id','resumeButton');
  resumeButton.innerHTML = 'Resume';
  resumeButton.style.fontSize = '40px';
  resumeButton.style.margin = '5px';
  resumeButton.style.padding = '5px';
  resumeButton.onclick = hidePauseMenu;

  let mainMenuButton = document.createElement('button');
  mainMenuButton.setAttribute('id','mainMenuButton');
  mainMenuButton.innerHTML = "Main Menu";
  mainMenuButton.style.fontSize = '40px';
  mainMenuButton.style.margin = '5px';
  mainMenuButton.style.padding = '5px';
  mainMenuButton.onclick = ()=> { 
    if(confirm("Are you sure you want to return to the main menu? your progress will be lost.")) 
      location.reload();
  }

  let volumeControlDiv = document.createElement('div');
  volumeControlDiv.innerHTML = "Volume:";
  volumeControlDiv.style.display = 'flex';
  volumeControlDiv.style.flexDirection = 'column';
  volumeControlDiv.style.textAlign = 'center';
  volumeControlDiv.style.margin = '5px';
  volumeControlDiv.style.fontSize = '1.5em';

  let volumeSlider = document.createElement('input');
  volumeSlider.setAttribute('id','volumeSlider');
  volumeSlider.setAttribute('type','range');
  volumeSlider.style.position = 'relative';
  volumeSlider.style.top = '10px';
  volumeSlider.value = 100;
  volumeControlDiv.appendChild(volumeSlider);
  
  pauseMenuDiv.appendChild(resumeButton);
  pauseMenuDiv.appendChild(volumeControlDiv);
  pauseMenuDiv.appendChild(mainMenuButton);

  document.body.appendChild(pauseMenuDiv);
}

function createShieldBar(){
  let shieldDiv = document.createElement('div');
  shieldDiv.style.position = 'absolute';
  shieldDiv.style.top = "10px";
  shieldDiv.style.right = '30px';
  shieldDiv.style.backgroundColor = 'black';
  shieldDiv.style.zIndex = '4';
  shieldDiv.style.width = '220px';
  shieldDiv.style.height = '50px';
  shieldDiv.style.borderRadius = '15px';
  let shieldEnergy = document.createElement('div');
  shieldEnergy.setAttribute('id','shieldEnergy');
  shieldEnergy.style.backgroundColor = 'cyan';
  shieldEnergy.style.width = '200px';
  shieldEnergy.style.height = '30px';
  shieldEnergy.style.borderRadius = '10px';
  shieldEnergy.style.padding = '5px';
  shieldEnergy.style.transform = 'translate(5px,5px)';

  shieldDiv.appendChild(shieldEnergy);
  document.body.appendChild(shieldDiv);
}