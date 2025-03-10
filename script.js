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
  grace_: ["amazing", "saving", "fall from", "state of"],
  _grace: ["period", "land", "ful", "less"],
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
  grid.innerHTML = ""; // Clear the grid

  shuffleArray(values); // Shuffle values before displaying

  values.forEach((item) => {
    const div = document.createElement("div");
    div.textContent = item;
    div.addEventListener("click", () => toggleSelection(div, item));

    // If the item is part of a solved category, disable it
    if (isItemSolved(item)) {
      div.classList.add("correct");
      div.style.cursor = "not-allowed"; // Disable selection for solved items
    }

    grid.appendChild(div);
  });
}

// Toggle the selection of items when clicked
function toggleSelection(div, item) {
  // Prevent selecting more than 4 items
  if (selectedItems.length >= 4 && !div.classList.contains("selected")) {
    return; // Do nothing if there are already 4 items selected and the user tries to select more
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
      selectedItems = []; // Reset selectedItems after correct guess
      deselectAll(); // Deselect all selected items after each guess
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
      div.classList.add("correct"); // Mark as correct
      div.style.cursor = "not-allowed"; // Disable clicking for correct items
    }
  });
}

// Mark items as incorrect
function markItemIncorrect(item) {
  const divs = document.querySelectorAll(".grid div");
  divs.forEach((div) => {
    if (div.textContent === item) {
      div.classList.remove("selected"); // Remove the 'selected' state
      div.classList.add("incorrect"); // Mark as incorrect
      div.style.cursor = "pointer"; // Allow re-selection if it was incorrect
    }
  });
}

// Deselect all items and reset selection
function deselectAll() {
  const divs = document.querySelectorAll(".grid div");
  divs.forEach((div) => {
    div.classList.remove("selected"); // Remove the 'selected' class from all
    div.classList.remove("incorrect"); // Also remove the 'incorrect' class
    div.style.cursor = "pointer"; // Reset the cursor, so they can be selected again
  });
  selectedItems = []; // Reset the selected items list after each guess
}

// Remove solved items from the grid
function removeSolvedItems(category) {
  categories[category].forEach((item) => {
    const divs = document.querySelectorAll(".grid div");
    divs.forEach((div) => {
      if (div.textContent === item) {
        div.remove(); // Remove solved items from the pool
      }
    });
  });
}
function showCategory(category) {
  const solvedCategoriesDiv = document.getElementById("solvedCategories");

  // Check if the solvedCategoriesDiv exists
  if (!solvedCategoriesDiv) {
    console.error("The solvedCategories div does not exist.");
    return; // Exit if the div doesn't exist
  }

  // Create a div for the category item
  const categoryItem = document.createElement("div");
  categoryItem.classList.add("category-item");

  // Add a specific class for each category to apply the unique background color
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

  // Get the user-friendly category name from the mapping
  const userFriendlyCategoryName = categoryDisplayNames[category] || category; // Default to original if not found

  // Create the category name element
  const categoryName = document.createElement("h3");
  categoryName.textContent = userFriendlyCategoryName; // Use the user-friendly name

  // Create the values list for this category
  const categoryValues = document.createElement("p");
  categoryValues.textContent = categories[category].join(", ");

  // Append the category name and values to the category item
  categoryItem.appendChild(categoryName);
  categoryItem.appendChild(categoryValues);

  // Append the category item to the solved categories row
  solvedCategoriesDiv.appendChild(categoryItem);
}

// Helper function to check if an item is already part of a solved category
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
  document.getElementById("categories").innerHTML = ""; // Reset categories display
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

  // Clear the result and tries left
  document.getElementById("result").textContent = "";
  document.getElementById("triesLeft").textContent = triesLeft;

  // Clear the categories display
  document.getElementById("categories").innerHTML = "";

  // Clear the solved categories display (this is the change)
  document.getElementById("solvedCategories").innerHTML = "";

  // Display the grid with shuffled values
  displayGrid();
}

document.getElementById("shuffleButton").addEventListener("click", shuffle);
document
  .getElementById("deselectButton")
  .addEventListener("click", deselectAll);
document.getElementById("enterButton").addEventListener("click", checkAnswer);
document.getElementById("resetButton").addEventListener("click", resetGame);

window.onload = displayGrid;
