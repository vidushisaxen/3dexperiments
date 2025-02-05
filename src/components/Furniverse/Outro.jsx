import React from 'react'

const Outro = () => {
  return (
   <section id='outro' className='relative'>
    <div className='flex flex-col items-start justify-between gap-[22vw] px-[2vw]'>
        <div>
        <div>
            <p className='text-[4vw] leading-[1] w-[75%] uppercase para overflow-hidden'>We're an Italian, Spanish and Swiss Multidisciplinary Design Studio focused on Interior Design , installations, Digital Imagery and Meta-Space Research.</p>
        </div>
        <div className='flex items-start justify-between w-[40%] pt-[2vw] pb-[1vw]'>
            <p className='text-[1.1vw] font-[700] uppercase para overflow-hidden'>Studio</p>
            <p className='text-[1.1vw] uppercase para overflow-hidden'>Studio(AT)OFFICESTUD(DOT)IO</p>

        </div>
        <div className='flex items-start justify-between w-[40%]'>
            <p className='text-[1.1vw] font-[700] uppercase para overflow-hidden'>Press</p>
            <p className='text-[1.1vw] uppercase para overflow-hidden'>Press(AT)OFFICESTUD(DOT)IO</p>

        </div>
        </div>
        <div>
            <p className='text-[1vw] uppercase'>We do not collect data  and do not use cookies. you can find more information on how we handle this as well as ...</p>
        </div>

    </div>

   </section>
  )
}

export default Outro