import { onReady, setActiveNavLink } from "./common";
const assetsPath = "../assets";
const imagesPath = `${assetsPath}/images`;
const imageFiles = [
    "1.jpeg",
    "2.jpeg",
    "3.jpeg",
    "4.jpeg",
    "5.jpeg",
    "6.jpeg",
    "7.jpeg",
    "8.jpeg",
    "9.jpeg",
    "10.jpeg",
    "11.jpeg",
    "12.jpeg",
    "WhatsApp Image 2025-10-06 at 13.10.37.jpeg",
    "maria1.jpeg",
    "maria2.jpeg",
];
function createSlideshow(container, state) {
    container.innerHTML = "";
    const repeatingImages = [];
    for (let i = 0; i < 100; i++) {
        repeatingImages.push(...imageFiles);
    }
    for (const [index, file] of repeatingImages.entries()) {
        const div = document.createElement("div");
        div.className = "photo-item";
        const img = document.createElement("img");
        img.src = `${imagesPath}/${file}`;
        img.alt = `Photo ${(index % imageFiles.length) + 1}`;
        div.appendChild(img);
        container.appendChild(div);
    }
    state.currentPhotoIndex = 0;
}
function showCurrentPhotos(container, state) {
    const parent = container.parentElement;
    if (!parent)
        return;
    const containerWidth = parent.offsetWidth;
    const photoWidth = (containerWidth + 2 * 16) / 3;
    const offset = -(state.currentPhotoIndex * photoWidth);
    container.style.transform = `translateX(${offset}px)`;
}
function startSlideshow(container, state) {
    stopSlideshow(state);
    state.slideIntervalId = window.setInterval(() => {
        state.currentPhotoIndex++;
        showCurrentPhotos(container, state);
    }, 5000);
}
function stopSlideshow(state) {
    if (state.slideIntervalId !== null) {
        clearInterval(state.slideIntervalId);
        state.slideIntervalId = null;
    }
}
function resetAutoSlide(container, state) {
    startSlideshow(container, state);
}
onReady(() => {
    setActiveNavLink();
    const container = document.getElementById("photo-sections");
    if (!container)
        return;
    const state = {
        currentPhotoIndex: 0,
        slideIntervalId: null,
    };
    createSlideshow(container, state);
    showCurrentPhotos(container, state);
    startSlideshow(container, state);
    window.nextSlide = () => {
        state.currentPhotoIndex++;
        showCurrentPhotos(container, state);
        resetAutoSlide(container, state);
    };
    window.previousSlide = () => {
        state.currentPhotoIndex--;
        if (state.currentPhotoIndex < 0) {
            state.currentPhotoIndex = 0;
        }
        showCurrentPhotos(container, state);
        resetAutoSlide(container, state);
    };
});
//# sourceMappingURL=index.js.map