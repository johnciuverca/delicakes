import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type SlideState = {
  currentPhotoIndex: number;
};

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

function clampIndex(index: number, maxIndex: number): number {
  if (index < 0) return 0;
  if (index > maxIndex) return maxIndex;
  return index;
}

export function HomePage(): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<SlideState>({ currentPhotoIndex: 0 });

  const repeatingImages = useMemo(() => {
    const images: string[] = [];
    for (let i = 0; i < 100; i++) images.push(...imageFiles);
    return images;
  }, []);

  const showCurrentPhotos = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const parent = container.parentElement;
    if (!parent) return;

    const containerWidth = parent.offsetWidth;
    const photoWidth = (containerWidth + 2 * 16) / 3;
    const offset = -(state.currentPhotoIndex * photoWidth);
    container.style.transform = `translateX(${offset}px)`;
  }, [state.currentPhotoIndex]);

  useEffect(() => {
    showCurrentPhotos();
  }, [showCurrentPhotos]);

  useEffect(() => {
    const onResize = () => showCurrentPhotos();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [showCurrentPhotos]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setState((prev) => ({ ...prev, currentPhotoIndex: prev.currentPhotoIndex + 1 }));
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  const maxIndex = Math.max(0, repeatingImages.length - 3);

  const nextSlide = () => {
    setState((prev) => ({
      ...prev,
      currentPhotoIndex: clampIndex(prev.currentPhotoIndex + 1, maxIndex),
    }));
  };

  const previousSlide = () => {
    setState((prev) => ({
      ...prev,
      currentPhotoIndex: clampIndex(prev.currentPhotoIndex - 1, maxIndex),
    }));
  };

  return (
    <div className="slideshow-container">
      <button className="carousel-btn prev" onClick={previousSlide}>
        &#10094;
      </button>
      <div className="photo-sections" id="photo-sections" ref={containerRef}>
        {repeatingImages.map((file, index) => (
          <div className="photo-item" key={`${file}-${index}`}>
            <img src={`/assets/images/${file}`} alt={`Photo ${(index % imageFiles.length) + 1}`} />
          </div>
        ))}
      </div>
      <button className="carousel-btn next" onClick={nextSlide}>
        &#10095;
      </button>
    </div>
  );
}
