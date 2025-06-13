import React, { useState, useEffect } from 'react'
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface ImageCardProps {
  src: string
  alt?: string
}

const ImageCard: React.FC<ImageCardProps> = ({ src, alt }) => {
  const { ref, focused } = useFocusable()
  const [isLoading, setIsLoading] = useState(true)

  // Wait until the image loads
  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => setIsLoading(false)
  }, [src])

  return (
    <Card
      ref={ref}
      className={`transition-all duration-200 overflow-hidden outline-none border-0 p-0 ${
        focused ? 'scale-110 z-10 ring-4 ring-blue-400 shadow-xl' : 'scale-100 z-0 ring-0'
      }`}
      tabIndex={-1}
    >
      <CardContent className="p-0 w-full h-48">
        {isLoading ? (
          <Skeleton className="w-full h-full rounded-md" />
        ) : (
          <img src={src} alt={alt || 'image'} className="w-full h-full object-cover rounded-md" />
        )}
      </CardContent>
    </Card>
  )
}

export default ImageCard
