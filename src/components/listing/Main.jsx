import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const projects = [
  // { href: "/earth", imageSrc: "/assets/listing/earth-listing.png", title: "Earth", width: "80vw", height: "40vw" },
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
  { href: "/route-color-change", imageSrc: "/assets/listing/route-color-listing.png", title: "Route Color Changing Background", width: "40vw", height: "40vw" },
  // { href: "/earth", imageSrc: "/assets/listing/earth-listing.png", title: "Earth", width: "80vw", height: "40vw" },
];

const Main = () => {

  return (
    <section id="main" className="h-full w-screen">
      <div className="flex flex-col items-center justify-center">
        <div className="h-screen flex items-center justify-center">
        <Link href={"/earth"}>
              <div className="relative group card" style={{ width: "80vw", height: "40vw" }}>
                <Image
                  src={"/assets/listing/earth-listing.png"}
                  fill
                  alt={"jaal"}
                  className="rounded-[2vw] object-cover saturate-0 group-hover:saturate-100 duration-500 ease transition-all"
                />
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h2 className="text-3xl font-bold">Earth</h2>
                </div>
              </div>
            </Link>
            </div>
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
          <div className="h-screen flex items-center justify-center">
            <Link href={"/earth"}>
                <div className="relative group card" style={{ width: "80vw", height: "40vw" }}>
                  <Image
                    src={"/assets/listing/earth-listing.png"}
                    fill
                    alt={"kaks"}
                    className="rounded-[2vw] object-cover saturate-0 group-hover:saturate-100 duration-500 ease transition-all"
                  />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h2 className="text-3xl font-bold">Earth</h2>
                  </div>
                </div>
              </Link>
          </div>
          
      </div>
    </section>
  );
};

export default Main;

