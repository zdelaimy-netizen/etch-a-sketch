const DEFAULT_GRID_SIZE = 16;
const MAX_GRID_SIZE = 100;

const canvas = document.querySelector('.canvas');
const resizeButton = document.querySelector('#resize-btn');
const sizeDisplay = document.querySelector('[data-size-display]');

if (!canvas || !resizeButton || !sizeDisplay) {
  throw new Error('Etch-a-Sketch markup is missing required elements.');
}

initializeSketchpad();

function initializeSketchpad() {
  createGrid(DEFAULT_GRID_SIZE);
  resizeButton.addEventListener('click', handleResizeRequest);
}

function handleResizeRequest() {
  const message = `Enter grid size (1-${MAX_GRID_SIZE}).\nThe board will always stay the same total size.`;
  const userValue = prompt(message, String(DEFAULT_GRID_SIZE));

  if (userValue === null) {
    return; // user cancelled
  }

  const parsedValue = Number.parseInt(userValue, 10);

  if (!Number.isFinite(parsedValue) || parsedValue < 1 || parsedValue > MAX_GRID_SIZE) {
    alert(`Please enter a whole number between 1 and ${MAX_GRID_SIZE}.`);
    return;
  }

  createGrid(parsedValue);
}

function createGrid(size) {
  canvas.replaceChildren();
  canvas.style.setProperty('--grid-size', size);
  sizeDisplay.textContent = `${size} × ${size}`;

  const fragment = document.createDocumentFragment();
  const totalCells = size * size;

  for (let i = 0; i < totalCells; i += 1) {
    const cell = document.createElement('div');
    cell.className = 'canvas-cell';
    cell.dataset.shade = '0';
    cell.addEventListener('pointerenter', handlePaint);
    cell.addEventListener('pointerdown', handlePaint);
    fragment.appendChild(cell);
  }

  canvas.appendChild(fragment);
}

function handlePaint(event) {
  if (event.type === 'pointerdown') {
    if (event.pointerType === 'mouse') {
      return;
    }
    event.preventDefault();
  }

  const cell = event.currentTarget;

  if (!cell.dataset.red) {
    const { r, g, b } = generateRandomColor();
    cell.dataset.red = r;
    cell.dataset.green = g;
    cell.dataset.blue = b;
  }

  const nextShade = Math.min(10, Number(cell.dataset.shade || '0') + 1);
  cell.dataset.shade = String(nextShade);

  const shadeRatio = getShadeRatio(nextShade);
  const red = Number(cell.dataset.red);
  const green = Number(cell.dataset.green);
  const blue = Number(cell.dataset.blue);

  const shadedColor = shadeRatio === 0
    ? 'rgb(0, 0, 0)'
    : `rgb(${Math.round(red * shadeRatio)}, ${Math.round(green * shadeRatio)}, ${Math.round(blue * shadeRatio)})`;

  cell.style.backgroundColor = shadedColor;
}

function generateRandomColor() {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  };
}

function getShadeRatio(shadeStep) {
  if (shadeStep <= 1) {
    return 1;
  }

  const normalized = (shadeStep - 1) / 9; // 0 (no shade) -> 1 (fully shaded)
  return Math.max(0, 1 - normalized);
}
