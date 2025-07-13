const searchBar = document.getElementById("search-bar");
const suggestions = document.getElementById("suggestions");
const storeMap = document.getElementById("store-map");
const mapOverlay = document.getElementById("map-overlay");

const highlightPoint = document.createElement("div");
highlightPoint.className = "highlight-point";
mapOverlay.appendChild(highlightPoint);

function rotate180(x, y, image) {
  const displayedWidth = image.clientWidth;
  const displayedHeight = image.clientHeight;
  
  const naturalWidth = image.naturalWidth || displayedWidth;
  const naturalHeight = image.naturalHeight || displayedHeight;
  
  const scaleX = displayedWidth / naturalWidth;
  const scaleY = displayedHeight / naturalHeight;
  
  const rotatedX = naturalWidth - x;
  const rotatedY = naturalHeight - y;
  
  return {
    x: rotatedX * scaleX,
    y: rotatedY * scaleY
  };
}

function highlightUnit(x, y) {
  const coords = rotate180(x, y, storeMap);
  
  highlightPoint.style.left = `${coords.x}px`;
  highlightPoint.style.top = `${coords.y}px`;
  highlightPoint.classList.add("active");
  
  console.log(`Highlighting at: ${coords.x}, ${coords.y}`);
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
  if (storeMap.clientWidth === 0 || storeMap.clientHeight === 0) return;
  
  const searchTerm = searchBar.value.trim();
  if (searchTerm && storeData[searchTerm]) {
    const location = storeData[searchTerm];
    highlightUnit(location.x, location.y);
  }
}

function waitForImageLoad() {
  if (storeMap.complete && storeMap.naturalWidth !== 0) {
    handlePositionUpdate();
  } else {
    storeMap.addEventListener('load', handlePositionUpdate);
    storeMap.addEventListener('error', () => console.error('Image failed to load'));
  }
}

waitForImageLoad();
window.addEventListener("resize", handlePositionUpdate);
