import React from "react";
import { Link } from "react-router-dom";
import HeroImage from "../../assets/HomePage/HeroImages/HeroMainImage.avif";
import { Button } from "@/components/UI/button";

function Hero() {
  const logos = [
    "Lexus",
    "Bentley",
    "Land Rover",
    "Mercedes",
    "Maserati",
    "Bugatti",
    "Porsche",
    "Infiniti",
    "Lamborghini",
    "BMW",
    "Ferrari",
    "Rolls‑Royce",
  ];

  return (
    <section className="relative isolate">
      <div className="relative h-dvh w-full overflow-hidden">
        <img
          src={HeroImage}
          alt="Hero background luxury car"
          className="absolute inset-0 size-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl/tight font-extrabold sm:text-6xl/tight md:text-7xl/tight">
              The largest luxury cars
              <br />
              marketplace
            </h1>
            <p className="mt-6 max-w-2xl text-base/7 text-white/85 sm:text-xl/8">
              Our team offering you a wide selection of high-end cars for
              purchase, lease, or rent.
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="bg-white text-black hover:bg-white/90"
              >
                <Link to="/cars">Explore all cars</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 -mt-6 w-full bg-black/50 py-6 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl overflow-hidden px-4 sm:px-6 lg:px-8">
          <div className="relative flex gap-12 overflow-hidden">
            <div className="flex min-w-max items-center gap-12 pr-12 grayscale hover:grayscale-0 animate-marquee">
              {logos.concat(logos).map((name, idx) => (
                <span
                  key={`r1-${idx}`}
                  className="text-white/90 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-widest uppercase whitespace-nowrap"
                >
                  {name}
                </span>
              ))}
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center gap-16 min-w-max pr-16 grayscale animate-marquee animate-marquee-fast"
              style={{ left: "100%" }}
            >
              {logos.concat(logos).map((name, idx) => (
                <span
                  key={`r1d-${idx}`}
                  className="text-white/90 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-widest uppercase whitespace-nowrap"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
          {/* row 2 opposite direction */}
          <div className="relative mt-4 overflow-hidden">
            <div
              className="flex min-w-max items-center gap-16 pr-16 grayscale hover:grayscale-0 animate-marquee animate-marquee-slow"
              style={{ transform: "translateX(-50%)" }}
            >
              {logos
                .concat(logos)
                .reverse()
                .map((name, idx) => (
                  <span
                    key={`r2-${idx}`}
                    className="text-white/80 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-[0.35em] uppercase whitespace-nowrap"
                  >
                    {name}
                  </span>
                ))}
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center gap-16 min-w-max pr-16 grayscale animate-marquee animate-marquee-slow"
              style={{ left: "100%", transform: "translateX(-50%)" }}
            >
              {logos
                .concat(logos)
                .reverse()
                .map((name, idx) => (
                  <span
                    key={`r2d-${idx}`}
                    className="text-white/80 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-[0.35em] uppercase whitespace-nowrap"
                  >
                    {name}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
