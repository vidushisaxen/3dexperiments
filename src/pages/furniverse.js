import Archive from '@/components/Furniverse/Archive';
import Blur from '@/components/Furniverse/Blur';
import { paraAnim } from '@/components/Furniverse/gsapAnimations';
import Header from '@/components/Furniverse/Header';
import Hero from '@/components/Furniverse/Hero';
import Outro from '@/components/Furniverse/Outro';
import React, { useState } from 'react'

const furniverse = () => {
  const [modelType, setModelType] = useState('/assets/furniverse/double-chair.glb'); 

  const handleHeadingClick = (model) => {
    setModelType(model); 
  };
paraAnim();
  return (
    <>
    <section className='w-screen h-full bg-[#111111] text-[#fefefe]'>
    <Blur modelType={modelType}/> 
    <Header/>
    <main>
      <Hero/>
      <Archive onHeadingClick={handleHeadingClick}/>
      <Outro/>
    </main>
    </section>
    </>
  )
}

export default furniverse