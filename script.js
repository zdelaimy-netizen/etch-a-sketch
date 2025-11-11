const container = document.querySelector("#container");
const resetBtn = document.querySelector("#reset-btn");

const DEFAULT_SIZE = 16;
const MAX_SIZE = 100;

// Create the grid
function createGrid(size) {
  container.innerHTML = ""; // Clear old grid
  const squareSize = 960 / size; // Keeps total area constant

  for (let i = 0; i < size * size; i++) {
    const square = document.createElement("div");
    square.classList.add("square");
    square.style.width = `${squareSize}px`;
    square.style.height = `${squareSize}px`;

    // Store opacity level for darkening
    square.dataset.opacity = 0;

    // Hover effect
    square.addEventListener("mouseenter", () => {
      // Random RGB color
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);

      // Darken progressively
      let opacity = parseFloat(square.dataset.opacity);
      if (opacity < 1) opacity += 0.1;
      square.dataset.opacity = opacity.toFixed(1);

      square.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    });

    container.appendChild(square);
  }
}

// Handle reset
resetBtn.addEventListener("click", () => {
  let newSize = parseInt(prompt("Enter new grid size (max 100):"), 10);
  if (Number.isNaN(newSize) || newSize < 1) {
    alert("Invalid input! Please enter a number between 1 and 100.");
    return;
  }
  if (newSize > MAX_SIZE) newSize = MAX_SIZE;
  createGrid(newSize);
});

// Initialize
createGrid(DEFAULT_SIZE);
