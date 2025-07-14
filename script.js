const searchBar = document.getElementById("search-bar");
const suggestions = document.getElementById("suggestions");
const storeMap = document.getElementById("store-map");
const mapOverlay = document.getElementById("map-overlay");

const highlightPoint = document.createElement("div");
highlightPoint.className = "highlight-point";
mapOverlay.appendChild(highlightPoint);

function highlightUnit(x, y) {
  const rect = storeMap.getBoundingClientRect();
  const scaleX = rect.width / storeMap.naturalWidth;
  const scaleY = rect.height / storeMap.naturalHeight;
  highlightPoint.style.left = `${x * scaleX}px`;
  highlightPoint.style.top = `${y * scaleY}px`;
  highlightPoint.classList.add("active");
}

function clearHighlight() {
  highlightPoint.classList.remove("active");
}

function showSuggestions(input) {
  suggestions.innerHTML = "";
  if (input.length < 1) {
    suggestions.style.display = "none";
    clearHighlight();
    return;
  }

  const matches = Object.keys(storeData).filter(name =>
    name.toLowerCase().includes(input.toLowerCase())
  );

  if (matches.length === 0) {
    suggestions.style.display = "none";
    return;
  }

  matches.slice(0, 5).forEach(match => {
    const div = document.createElement("div");
    div.className = "suggestion-item";
    div.textContent = match;
    div.addEventListener("click", () => {
      searchBar.value = match;
      suggestions.style.display = "none";
      const location = storeData[match];
      highlightUnit(location.x, location.y);
    });
    suggestions.appendChild(div);
  });

  suggestions.style.display = "block";
}

searchBar.addEventListener("input", () => {
  showSuggestions(searchBar.value);
});

searchBar.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const input = searchBar.value.trim();
    if (storeData[input]) {
      const location = storeData[input];
      highlightUnit(location.x, location.y);
    }
    suggestions.style.display = "none";
  }
});

document.addEventListener("click", (e) => {
  if (!searchBar.contains(e.target) && !suggestions.contains(e.target)) {
    suggestions.style.display = "none";
  }
});

function handlePositionUpdate() {
  const searchTerm = searchBar.value.trim();
  if (searchTerm && storeData[searchTerm]) {
    const location = storeData[searchTerm];
    highlightUnit(location.x, location.y);
  }
}

storeMap.addEventListener("load", handlePositionUpdate);
window.addEventListener("resize", handlePositionUpdate);
