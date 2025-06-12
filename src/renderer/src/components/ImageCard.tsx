import { useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import { Card, CardContent } from '@/components/ui/card'

interface ImageCardProps {
  src: string
  alt?: string
}

const ImageCard: React.FC<ImageCardProps> = ({ src, alt }) => {
  const { ref, focused } = useFocusable()

  return (
    <Card
      ref={ref}
      className={`transition-all duration-150 overflow-hidden outline-none border-2 ${focused ? 'border-blue-500 scale-105 shadow-lg' : 'border-transparent'}`}
      tabIndex={-1}
    >
      <CardContent className="p-0">
        <img src={src} alt={alt || 'image'} className="w-full h-48 object-cover" />
      </CardContent>
    </Card>
  )
}

export default ImageCard
