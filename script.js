const values = [
  "place",
  "space",
  "interface",
  "vase",
  "grade",
  "grate",
  "graze",
  "grave",
  "amazing",
  "saving",
  "fall from",
  "state of",
  "period",
  "land",
  "ful",
  "less",
];
const categories = {
  rhyme: ["place", "space", "interface", "vase"],
  autocorrect: ["grade", "grate", "graze", "grave"],
  _grace: ["amazing", "saving", "fall from", "state of"],
  grace_: ["period", "land", "ful", "less"],
};
const categoryDisplayNames = {
  rhyme: "words that rhyme with grace",
  autocorrect: "words that grace often autocorrects to",
  grace_: "grace _____",
  _grace: "_____grace",
};
let triesLeft = 5;
let selectedItems = [];
let correctCategories = {
  rhyme: [],
  autocorrect: [],
  grace_: [],
  _grace: [],
};
// Function to shuffle values
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
// Display all values in the grid
function displayGrid() {
  const grid = document.getElementById("grid");
  grid.innerHTML = ""; 
  shuffleArray(values); 
  values.forEach((item) => {
    const div = document.createElement("div");
    div.textContent = item;
    div.addEventListener("click", () => toggleSelection(div, item));
    if (isItemSolved(item)) {
      div.classList.add("correct");
      div.style.cursor = "not-allowed"; 
    }
    grid.appendChild(div);
  });
}
// Toggle the selection of items when clicked
function toggleSelection(div, item) {
  if (selectedItems.length >= 4 && !div.classList.contains("selected")) {
    return; 
  }
  if (div.classList.contains("selected")) {
    div.classList.remove("selected");
    selectedItems = selectedItems.filter(
      (selectedItem) => selectedItem !== item
    );
  } else {
    div.classList.add("selected");
    selectedItems.push(item);
  }
}
// Check the user's guess
function checkAnswer() {
  const result = document.getElementById("result");
  const triesLeftSpan = document.getElementById("triesLeft");
  // Check if the user has selected exactly 4 items
  if (selectedItems.length !== 4) {
    result.textContent = "You need to select exactly 4 items!";
    return;
  }
  if (triesLeft <= 0) {
    result.textContent = "Game Over! You have no tries left.";
    return;
  }
  let correctCategory = null;
  // Check if selectedItems belong to any category
  for (let category in categories) {
    if (
      selectedItems.sort().join(",") === categories[category].sort().join(",")
    ) {
      correctCategory = category;
      correctCategories[category] = selectedItems;
      selectedItems.forEach((item) => markItemCorrect(item));
      showCategory(category);
      removeSolvedItems(category);
      triesLeftSpan.textContent = triesLeft;
      selectedItems = [];
      deselectAll();
      return;
    }
  }
  // If the guess was incorrect, reset selections and allow a new guess
  triesLeft--;
  result.textContent = `not quite... tries remaining: ${triesLeft}`;
  // Mark items as incorrect and allow them to be deselected
  selectedItems.forEach((item) => {
    markItemIncorrect(item);
  });
  // Deselect all after the incorrect guess, but keep items available for re-selection
  deselectAll();
  triesLeftSpan.textContent = triesLeft;
}
// Mark items as correct
function markItemCorrect(item) {
  const divs = document.querySelectorAll(".grid div");
  divs.forEach((div) => {
    if (div.textContent === item) {
      div.classList.add("correct");
      div.style.cursor = "not-allowed"; 
    }
  });
}
// Mark items as incorrect
function markItemIncorrect(item) {
  const divs = document.querySelectorAll(".grid div");
  divs.forEach((div) => {
    if (div.textContent === item) {
      div.classList.remove("selected");
      div.classList.add("incorrect"); 
      div.style.cursor = "pointer";
    }
  });
}
// Deselect all items and reset selection
function deselectAll() {
  const divs = document.querySelectorAll(".grid div");
  divs.forEach((div) => {
    div.classList.remove("selected"); 
    div.classList.remove("incorrect"); 
    div.style.cursor = "pointer"; 
  });
  selectedItems = [];
}
// Remove solved items from the grid
function removeSolvedItems(category) {
  categories[category].forEach((item) => {
    const divs = document.querySelectorAll(".grid div");
    divs.forEach((div) => {
      if (div.textContent === item) {
        div.remove(); 
      }
    });
  });
}
function showCategory(category) {
  const solvedCategoriesDiv = document.getElementById("solvedCategories");

  if (!solvedCategoriesDiv) {
    console.error("The solvedCategories div does not exist.");
    return; 
  }
  const categoryItem = document.createElement("div");
  categoryItem.classList.add("category-item");
  switch (category) {
    case "rhyme":
      categoryItem.classList.add("rhyme");
      break;
    case "autocorrect":
      categoryItem.classList.add("autocorrect");
      break;
    case "grace_":
      categoryItem.classList.add("grace_");
      break;
    case "_grace":
      categoryItem.classList.add("_grace");
      break;
    default:
      break;
  }
  const userFriendlyCategoryName = categoryDisplayNames[category] || category; 
  const categoryName = document.createElement("h3");
  categoryName.textContent = userFriendlyCategoryName; 
  const categoryValues = document.createElement("p");
  categoryValues.textContent = categories[category].join(", ");
  categoryItem.appendChild(categoryName);
  categoryItem.appendChild(categoryValues);
  solvedCategoriesDiv.appendChild(categoryItem);
}
function isItemSolved(item) {
  for (let category in correctCategories) {
    if (correctCategories[category].includes(item)) {
      return true;
    }
  }
  return false;
}
// Shuffle values and reset the game
function shuffle() {
  displayGrid();
  document.getElementById("result").textContent = "";
  selectedItems = [];
  document.getElementById("categories").innerHTML = "";
}
// Reset the game
function resetGame() {
  triesLeft = 5;
  selectedItems = [];
  correctCategories = {
    rhyme: [],
    autocorrect: [],
    grace_: [],
    _grace: [],
  };
  document.getElementById("result").textContent = "";
  document.getElementById("triesLeft").textContent = triesLeft;
  document.getElementById("categories").innerHTML = "";
  document.getElementById("solvedCategories").innerHTML = "";
  displayGrid();
}
document.getElementById("shuffleButton").addEventListener("click", shuffle);
document
  .getElementById("deselectButton")
  .addEventListener("click", deselectAll);
document.getElementById("enterButton").addEventListener("click", checkAnswer);
document.getElementById("resetButton").addEventListener("click", resetGame);
window.onload = displayGrid;

