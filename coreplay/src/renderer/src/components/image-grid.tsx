import React from 'react'
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import ImageCard from '@/components/image-card'

type ImageGridProps = {
  images: {
    src: string
    alt?: string
    title?: string
  }[]
}

const ImageGrid: React.FC<ImageGridProps> = ({ images }) => {
  const { ref, focusKey } = useFocusable({ focusable: false })

  return (
    <div
      ref={ref}
      data-focus-key={focusKey}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-h-[90vh] overflow-y-auto p-4"
    >
      {images.map((image, index) => (
        <ImageCard key={index} src={image.src} alt={image.alt} />
      ))}
    </div>
  )
}

export default ImageGrid
