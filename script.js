

const panels = document.querySelectorAll('.panel');
const container = document.querySelector('.container');
const themeToggle = document.querySelector('.theme-toggle');
let currentIndex = 0;
let rotationInterval;
let isRotationPaused = false;

// Theme functions
function setTheme(isDark) {
  document.body.classList.toggle('dark', isDark);
  document.body.classList.toggle('light', !isDark);
  localStorage.setItem('themePreference', isDark ? 'dark' : 'light');
}
// Add this after your existing code
function handleResize() {
  const isMobile = window.innerWidth <= 480;
  panels.forEach((panel, index) => {
    if (isMobile && index >= 3) {
      panel.style.display = 'none';
    } else {
      panel.style.display = 'flex';
    }
  });
}

// Initial call and event listener
handleResize();
window.addEventListener('resize', handleResize);


// Initialize theme
const savedTheme = localStorage.getItem('themePreference') || 'light';
setTheme(savedTheme === 'dark');

// Theme toggle
themeToggle.addEventListener('click', () => {
  setTheme(!document.body.classList.contains('dark'));
});

// Hammer.js initialization
const hammer = new Hammer(container);
hammer.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });

// Swipe handlers
hammer.on('swipeleft', () => {
  navigate(1);
});

hammer.on('swiperight', () => {
  navigate(-1);
});

function navigate(direction) {
  clearInterval(rotationInterval);
  currentIndex = (currentIndex + direction + panels.length) % panels.length;
  removeActiveClasses();
  panels[currentIndex].classList.add('active');
  resetRotationTimer();
}

function resetRotationTimer() {
  clearTimeout(window.rotationTimeout);
  window.rotationTimeout = setTimeout(startRotation, 10000);
}

function removeActiveClasses() {
  panels.forEach(panel => panel.classList.remove('active'));
}

function rotatePanels() {
  navigate(1);
}

function startRotation() {
  if (!isRotationPaused) {
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
  if (e.key === 'ArrowRight') navigate(1);
  if (e.key === 'ArrowLeft') navigate(-1);
});

// Initialize
startRotation();