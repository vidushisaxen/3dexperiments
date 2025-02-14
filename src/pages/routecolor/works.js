import AnimatedBlobs from '@/components/Dmp/AnimatedBlobs'
import Header from '@/components/Dmp/Header'
import React from 'react'

const works = () => {
  return (
    <>
    <Header/>
    <AnimatedBlobs/>
    <div className='w-screen h-full'>
    <div className="h-screen flex justify-center items-center border-b border-black">
      <h1 className="text-[4vw] text-black">WORKS</h1>
    </div>
    <div className="h-screen flex justify-center items-center border-b border-black">
      <h1 className="text-xl">Section 2</h1>
    </div>
    <div className="h-screen flex justify-center items-center">
      <h1 className="text-xl">Section 3</h1>
    </div>
  </div>
  </>
  )
}

export default works