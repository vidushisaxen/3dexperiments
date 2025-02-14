"use client";
import { Environment} from "@react-three/drei";
import { Canvas,} from "@react-three/fiber";
import React, { Suspense, useMemo ,useEffect} from "react";

import Lights from "./Lights";
import { animated } from "@react-spring/web";
import { BlobSetting } from "./utils/blobSetting";
import { pages } from "./Text/data";
import useUsefulHooks from "./hooks/useWheel";
import GalleryBlob from "./GalleryBlob";


const GallerySphere = ({ current, setCurrent }) => {
  const { prevPage, nextPage, lastAction } = useUsefulHooks();

  const {bg, ambient, lights, ...setting } = useMemo(
    () => BlobSetting[pages[0].name],
    [nextPage, prevPage, current],
    
  );
 


  return (
    <animated.div
      className="w-full h-full !"
      style={{ background: bg, transition: "ease-out 0.5s" }} >
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }} className="blobifyCanvas " style={{height:"100vh", width:"100vw", position:"fixed", top:"0", left:"0"}}>
        <ambientLight intensity={ambient} />
        <Lights lights={lights} />
        <Suspense fallback={null}>
          <GalleryBlob {...setting} geometry={{scale:1.1}} />
        </Suspense>
        <Environment files={"/assets/blobify/empty.hdr"} />
      </Canvas>
    </animated.div>
  );
};


export default GallerySphere;
