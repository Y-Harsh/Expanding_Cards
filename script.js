const panels = document.querySelectorAll('.panel');
let currentIndex = 0;
let rotationInterval;
let isRotationPaused = false;

function removeActiveClasses() {
  panels.forEach(panel => {
    panel.classList.remove('active');
  });
}

function rotatePanels() {
  removeActiveClasses();
  currentIndex = (currentIndex + 1) % panels.length;
  panels[currentIndex].classList.add('active');
}

function startRotation() {
  if (!isRotationPaused) {
    clearInterval(rotationInterval);
    rotationInterval = setInterval(rotatePanels, 5000);
  }
}

// Hover controls
panels.forEach(panel => {
  panel.addEventListener('mouseenter', () => {
    isRotationPaused = true;
    clearInterval(rotationInterval);
  });
  
  panel.addEventListener('mouseleave', () => {
    isRotationPaused = false;
    startRotation();
  });
});

// Click controls
panels.forEach((panel, index) => {
  panel.addEventListener('click', () => {
    clearTimeout(window.rotationTimeout);
    removeActiveClasses();
    panel.classList.add('active');
    currentIndex = index;
    clearInterval(rotationInterval);
    startRotation();
  });
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
  if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
  
  e.preventDefault();
  clearInterval(rotationInterval);
  clearTimeout(window.rotationTimeout);
  
  if (e.key === 'ArrowRight') {
    currentIndex = (currentIndex + 1) % panels.length;
  } else {
    currentIndex = (currentIndex - 1 + panels.length) % panels.length;
  }
  
  removeActiveClasses();
  panels[currentIndex].classList.add('active');
  
  window.rotationTimeout = setTimeout(() => {
    startRotation();
  }, 10000);
});

// Initialize
startRotation();