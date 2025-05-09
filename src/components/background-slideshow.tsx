"use client";

import Image from "next/image";
import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const slideImages = [
  "https://images.pexels.com/photos/8282292/pexels-photo-8282292.jpeg",
  "https://images.pexels.com/photos/8193334/pexels-photo-8193334.jpeg",
  "https://images.pexels.com/photos/163726/belgium-antwerp-shipping-container-163726.jpeg",
];

export const BackgroundSlideshow = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Fade
        duration={5000}
        transitionDuration={1000}
        infinite
        arrows={false}
        indicators={false}
      >
        {slideImages.map((url, index) => (
          <div key={index} className="w-full h-screen relative">
            <div className="relative w-full h-full">
              <Image
                src={url}
                alt={`Slide ${index + 1}`}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        ))}
      </Fade>
    </div>
  );
};
