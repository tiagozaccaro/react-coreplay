import React from 'react'
import ImageCard from '@/components/ImageCard'

type ImageGridProps = {
  images: {
    src: string
    alt?: string
    title?: string
  }[]
}

const ImageGrid: React.FC<ImageGridProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <ImageCard key={index} src={image.src} alt={image.alt} />
      ))}
    </div>
  )
}

export default ImageGrid
