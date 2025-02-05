import React from 'react';

const Hero = () => {
    return (
        <section id='hero' className='w-screen h-full px-[3vw] pt-[5vw]'>
            <div>
                <h1 className='text-[14vw] font-[500] leading-[0.9] uppercase overflow-hidden'>
                    <span className='para'><p className='overflow-hidden'>Office for</p></span>
                    <span className='flex items-center justify-between para overflow-hidden'>
                        future
                        <p className='text-[1vw] px-[2vw] leading-[1.2] font-normal w-[30%]'>
                            Future living design research studio. Installation, Commercial and Private SPaces.
                        </p>
                    </span>
                    <span className='para'><p className='overflow-hidden'>furnishing</p></span>
                </h1>
            </div>
        </section>
    );
}

export default Hero;
