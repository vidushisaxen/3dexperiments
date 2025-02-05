import React from 'react'
import Arrows from './Arrows'
import ArrowsOpacity from './ArrowsOpacity'
import ArrowsLimit from './ArrowsLimit'
import ArrowsPlay from './ArrowsPlay'
import Lines from './Lines'
import Points from './Points'

const Collections = () => {
  return (
   <>
   <>
    {/* <div className='w-screen h-screen bg-black'/> */}
    <Arrows/>
    <div className='w-screen h-[30vw] bg-black'/>
    <ArrowsOpacity/>
    <div className='w-screen h-[30vw] bg-black'/>
    <ArrowsLimit/>
    {/* <div className='w-screen h-[30vw] bg-black'/>
    <ArrowsPlay/> */}
    <div className='w-screen h-[30vw] bg-black'/>
    <Lines/>
    <div className='w-screen h-[30vw] bg-black'/>
    <Points/>
    <div className='w-screen h-[30vw] bg-black'/>
    </>
   </>
  )
}

export default Collections