import Main from '@/components/listing/Main'
import React from 'react'
import { ReactLenis, useLenis } from "lenis/react";
import Scrollbar from '@/components/Scrollbar';


const index = () => {
  return (
    <>
      <ReactLenis root options={{ infinite: true }}>
        <Scrollbar />
        <Main />
      </ReactLenis>
    </>
  )
}

export default index