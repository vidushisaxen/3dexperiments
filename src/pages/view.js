import React from 'react'
import dynamic from 'next/dynamic'
import { ReactLenis} from "lenis/react";

const ViewScene = dynamic(() => import('../components/listing/ViewScene'), {
  ssr: false
})


const view = () => {
  return (
    <>
     <ReactLenis root options={{ infinite: true }}>
    <ViewScene/>
    </ReactLenis>
    </>
  )
}

export default view