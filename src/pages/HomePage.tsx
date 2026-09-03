import { useEffect, useState } from "react";

import bgLight from "../assets/images/bg_light.jpg";
import bgDark from "../assets/images/bg_dark.jpg";

import SearchBar from "@/components/common/SearchBar";

const slides = [bgLight, bgDark];

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const checkTheme = () => {
      const dark = document.documentElement.classList.contains("dark");
      setCurrentSlide(dark ? 1 : 0);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="px-6 py-7">
      {/* MOBILE SEARCH */}
      <div className="mb-6 md:hidden">
        <SearchBar />
      </div>

      {/* HEADER TRANG */}
      <div className="flex items-start justify-between">
        <h1 className="text-4xl font-bold text-text-primary">Trang chính</h1>

        {/* BANNER */}
        <div className="relative mt-1 w-[34%] max-w-140 overflow-hidden rounded-2xl border border-border bg-surface">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {slides.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Montra banner ${index + 1}`}
                className="block w-full shrink-0 object-cover"
              />
            ))}
          </div>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                aria-label={`Chuyển sang banner ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "w-5 bg-text-primary"
                    : "w-1.5 bg-text-secondary"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
