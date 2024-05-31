const accessKey = "LfJX1YXR2ivnAyUARlX41CGwfwtueJ1L2oXzKXiPK0U";

const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const searchResult = document.getElementById("search-result");
const showMoreBtn = document.getElementById("show-more-btn");
const showPreviousBtn = document.getElementById("show-previous-btn");

let keyword = "";
let page = 1;
let currentImageIndex = 0;
let results = [];

async function fetchRandomImage() {
    const url = `https://api.unsplash.com/photos/random?client_id=${accessKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const image = document.createElement("img");
        image.src = data.urls.small;
        const imageLink = document.createElement("a");
        imageLink.href = data.links.html;
        imageLink.target = "_blank";

        imageLink.appendChild(image);

        // Clear the existing images before appending new ones
        searchResult.innerHTML = "";
        searchResult.appendChild(imageLink);
    } catch (error) {
        console.error("Error fetching random image:", error);
    }
}

async function searchImages() {
    keyword = searchBox.value;
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accessKey}&per_page=9`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (page === 1) {
            searchResult.innerHTML = "";
        }

        results = data.results;
        currentImageIndex = 0;

        if (results.length > 0) {
            showNextImage();
        } else {
            showMoreBtn.style.display = "none";
        }
    } catch (error) {
        console.error("Error fetching images:", error);
        showMoreBtn.style.display = "none";
    }
}

function showNextImage() {
    if (currentImageIndex < results.length) {
        const result = results[currentImageIndex];
        const image = document.createElement("img");
        image.src = result.urls.small;
        const imageLink = document.createElement("a");
        imageLink.href = result.links.html;
        imageLink.target = "_blank";

        imageLink.appendChild(image);

        // Clear the existing images before appending new ones
        searchResult.innerHTML = "";
        searchResult.appendChild(imageLink);

        currentImageIndex++;

        if (currentImageIndex >= results.length && results.length < 9) {
            showMoreBtn.style.display = "none";
        }
    } else {
        page++;
        searchImages();
    }
}

function showPreviousImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;

        const result = results[currentImageIndex];
        const image = document.createElement("img");
        image.src = result.urls.small;
        const imageLink = document.createElement("a");
        imageLink.href = result.links.html;
        imageLink.target = "_blank";

        imageLink.appendChild(image);

        // Clear the existing images before appending new ones
        searchResult.innerHTML = "";
        searchResult.appendChild(imageLink);

        // Display the "Show More" button since we're not at the end
        showMoreBtn.style.display = "block";
    }
}

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    page = 1;
    searchImages();
});

showMoreBtn.addEventListener("click", () => {
    showNextImage();
});

showPreviousBtn.addEventListener("click", () => {
    showPreviousImage();
});

// Ensure the "Next" button is visible from the start
showMoreBtn.style.display = "block";

// Fetch and display a random image when the page loads
fetchRandomImage();
