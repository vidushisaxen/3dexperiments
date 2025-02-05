import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <header className='w-screen h-full p-[2vw] pb-0 fixed top-0 left-0'>
        <div className='flex items-center justify-between'>
            <Link href={"/"}>
            <div className='text-[1.2vw] para overflow-hidden'> <span className='font-[700]'>furni</span>verse</div>
            </Link>
            <Link href={"/"}>
            <div className='font-[700] text-[1.2vw] para overflow-hidden'> GET IN TOUCH</div>
            </Link>

        </div>

    </header>
  )
}

export default Header