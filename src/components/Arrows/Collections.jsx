import React from 'react'
import Arrows from './Arrows'
import ArrowsOpacity from './ArrowsOpacity'
import ArrowsLimit from './ArrowsLimit'
import ArrowsPlay from './ArrowsPlay'
import Lines from './Lines'
import Points from './Points'
import Link from 'next/link'

const Collections = () => {
  return (
   <>
   <>
    <section className='w-screen h-full bg-white'>
      <div className='px-[3vw] py-[3vw] flex items-center justify-center gap-[5vw] h-[40vw]'>
        <div className='w-[40%]'>
        <h1 className='text-[5vw] font-medium text-[#414141] leading-[1.2]'>
          Welcome to Arrow Dynamics
        </h1>
        <p className='text-[2vw] text-[#818181] pt-[1vw]'>Experience Four Unique Arrow Effects Following Your Cursor</p>
        <button className='text-[1.3vw] rounded-[30px] bg-black/80 text-white px-[2.5vw] py-[1vw] mt-[3vw] relative group duration-500 transition-all ease'>
          <p>Explore</p>
          <span className='h-full w-full absolute bg-white/10 scale-0 group-hover:scale-[1] origin-center rounded-full top-0 left-0 duration-500 transition-all ease'/>
        </button>
        </div>
        <div className='w-[40%]'>
          <div className=' w-full'>
            <video src='/assets/arrows/arrows-video.mp4' playsInline muted loop autoPlay />
          </div>

        </div>

      </div>

    </section>

    <section className='w-screen h-[70vw] bg-white'>
      <div className='w-full flex items-center justify-center flex-col gap-[3vw]'>
        <div className='w-[35%] text-center flex flex-col items-center'>
          <h2 className='text-[3.5vw] text-center'>
            Glide Through Web
          </h2>
          <p className='text-[1.3vw] w-[80%]'>An elegant arrow effect that moves fluidly with your mouse, enhancing user experience with seamless transitions.</p>
        </div>
          <div className='w-[80%]'>
          <Arrows/>
          </div> 

      </div>
    </section>
    <section className='w-screen h-[45vw] bg-white px-[2vw]'>
      <div className='w-full items-center justify-center flex gap-[3vw]'>
        <div className='w-[30%]'>
          <h2 className='text-[3.5vw]  leading-[1.2]'>
          Dynamic Response Arrow
          </h2>
          <p className='text-[1.3vw] w-[80%]'>This arrow effect provides immediate feedback to user interactions, perfect for high-performance websites.</p>
        </div>
          <div className='w-[70%] border border-black'>
          <ArrowsOpacity/>
          </div> 

      </div>
    </section>
    <section className='w-screen h-full bg-white '>
    <div className='w-full flex items-center justify-center  py-[3vw]'>
          <h2 className='text-[3.5vw] text-center leading-[1.2]'>
          Smooth Response Arrow
          </h2>
          </div>
          <ArrowsLimit/>
    </section>
    <section className='flex items-center justify-center bg-white w-screen py-[5vw] gap-[5vw]'>
    <section className=' h-[50vw] bg-white pt-[3vw] border w-[45vw]'>
      <div className='w-full flex items-center justify-center flex-col gap-[3vw]'>
        <div className='w-[95%] text-center flex flex-col items-center'>
          <h2 className='text-[3.5vw] text-center'>
            Interactive Lines
          </h2>
          <p className='text-[1.3vw] w-[60%]'>An elegant arrow effect that moves fluidly with your mouse, enhancing user experience with seamless transitions.</p>
        </div>
          <div className='w-[80%] h-[30vw]'>
          <Lines/>
          </div> 

      </div>
    </section>
    <section className='h-[50vw] bg-white border w-[45vw] pt-[3vw]'>
      <div className='w-full flex items-center justify-center flex-col gap-[3vw]'>
        <div className='w-[95%] text-center flex flex-col items-center'>
          <h2 className='text-[3.5vw] text-center'>
           Particle Lines
          </h2>
          <p className='text-[1.3vw] w-[60%]'>Incorporate cutting-edge particle effects that create a visually stunning experience as users navigate.</p>
        </div>
          <div className='w-[80%] h-[30vw]'>
          <Points/>
          </div> 

      </div>
    </section>
    </section>
    <section className='w-screen h-full bg-white '>
    <div className='w-full flex items-center justify-center  py-[3vw]'>
          <h2 className='text-[3.5vw] text-center leading-[1.2]'>
          Playful Arrows
          </h2>
          </div>
          <ArrowsPlay/>
    </section>

    <footer className='w-screen bg-black text-white py-[1vw] px-[3vw] mt-[3vw]'>
      <div className='w-full flex items-center justify-between'>
        <div>
          <p className='text-[1.5vw]'>Arrow Dynamics</p>
        </div>
        <div>
          <ul className='flex items-center justify-center gap-[1vw]'>
            <Link href={"#"}>
            <li className='text-[1.2vw] hover:scale-105 hover:text-red-500 duration-300 ease transition-all'>Twitter</li>
            </Link>
            <Link href={"#"}>
            <li className='text-[1.2vw] hover:scale-105 hover:text-red-500 duration-300 ease transition-all'>Github</li>
            </Link>
            <Link href={"#"}>
            <li className='text-[1.2vw] hover:scale-105 hover:text-red-500 duration-300 ease transition-all'>Linkedin</li>
            </Link>
          </ul>
        </div>

      </div>
    </footer>
    </>
   </>
  )
}

export default Collections