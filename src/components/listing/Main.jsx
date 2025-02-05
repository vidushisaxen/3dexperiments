import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const projects = [
  { href: "/earth", imageSrc: "/assets/listing/earth-listing.png", title: "Earth", width: "80vw", height: "40vw" },
  { href: "/nightEarth", imageSrc: "/assets/listing/night-earth-listing.png", title: "Night Earth", width: "40vw", height: "40vw" },
  { href: "/arrows", imageSrc: "/assets/listing/arrows-listing.png", title: "Arrows", width: "40vw", height: "40vw" },
  { href: "/cars", imageSrc: "/assets/listing/cars-listing.png", title: "Cars", width: "80vw", height: "40vw" },
  { href: "/chroma", imageSrc: "/assets/listing/chroma-listing.png", title: "Chroma", width: "40vw", height: "40vw" },
  { href: "/curveplane", imageSrc: "/assets/listing/curve-plane-listing.png", title: "Curve Plane", width: "80vw", height: "40vw" },
  { href: "/noise", imageSrc: "/assets/listing/noise-listing.png", title: "Noise", width: "40vw", height: "40vw" },
  { href: "/mouse-pixelation", imageSrc: "/assets/listing/mouse-pixelation-listing.png", title: "Mouse Pixelation", width: "40vw", height: "40vw" },
  { href: "/glowingorbs", imageSrc: "/assets/listing/glowing-orbs-listing.png", title: "Glowing Orbs", width: "80vw", height: "40vw" },
  { href: "/blurspheremoving", imageSrc: "/assets/listing/blur-sphere-listing.png", title: "Blur Sphere", width: "40vw", height: "40vw" },
  { href: "/furniverse", imageSrc: "/assets/listing/furniverse-listing.png", title: "Furniverse", width: "80vw", height: "40vw" },
  { href: "/modelrotation", imageSrc: "/assets/listing/model-rotation-listing.png", title: "Model Rotation", width: "40vw", height: "40vw" },
  { href: "/color-changing-background", imageSrc: "/assets/listing/color-changing-listing.png", title: "Color Changing Background", width: "40vw", height: "40vw" },
  { href: "/route-color-change", imageSrc: "/assets/listing/route-color-listing.png", title: "Route Color Changing Background", width: "40vw", height: "40vw" }

];

const Main = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Select all cards
    const cards = document.querySelectorAll('.card');
    
    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          scale: 0.8,
          y: 300,
          filter: "blur(5px)",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          scrollTrigger: {
            trigger: card,
            start: "top bottom", 
            end: "bottom top", 
            toggleActions: "play none none none", // Triggers animation every time the card enters the viewport
            onEnter: () => {
              gsap.to(card, {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 1.5,
                ease: "power3.out",
              });
            },
            onLeaveBack: () => {
              gsap.to(card, {
                opacity: 0,
                y: 300,
                scale: 0.8,
                filter: "blur(5px)",
                duration: 1.5,
                ease: "power3.out",
              });
            },
          },
        }
      );
    });

    // Ensure scroll triggers are refreshed when new content is added
    ScrollTrigger.refresh();

  }, []); // Run only once when the component is mounted

  return (
    <section id="main" className="h-full w-screen bg-[#000000] pt-[3vw] pb-[6vw]">
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-center flex-wrap gap-[10vw]">
          {projects.map((project, index) => (
            <Link key={index} href={project.href}>
              <div className="relative group card" style={{ width: project.width, height: project.height }}>
                <Image
                  src={project.imageSrc}
                  fill
                  alt={project.title}
                  className="rounded-[2vw] object-cover saturate-0 group-hover:saturate-100 duration-500 ease transition-all"
                />
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h2 className="text-3xl font-bold">{project.title}</h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Main;

