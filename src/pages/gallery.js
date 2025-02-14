import React from 'react'
import BlobScene from '@/components/listing/BlobScene'
import GalleryScene from '@/components/listing/GalleryScene'
import SphereCanvas from '@/components/Blobify/SphereCanvas'
import { Providers } from '@/components/Blobify/providers'
import GallerySphere from '@/components/Blobify/GallerySphere'

const gallery = () => {
  return (
    <>
        {/* <GalleryScene/> */}
        <BlobScene/>
        {/* <Providers>
        <GallerySphere/>
        </Providers> */}
    </>
  )
}

export default gallery