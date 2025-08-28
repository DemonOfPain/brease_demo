import React, { useState } from 'react'
import { Avatar, AvatarFallback } from '../shadcn/ui/avatar'
import { stringtoHexColor } from '@/lib/helpers/stringtoHexColor'
import Image, { StaticImageData } from 'next/image'

interface GenericAvatarInterface {
  image: string | StaticImageData | null
  alt?: string
  fallbackInitials: string
  size?: number
  className?: string
}

export const GenericAvatar = React.memo(
  ({ image, alt, fallbackInitials, size = 30, className }: GenericAvatarInterface) => {
    const fallbackColor = stringtoHexColor(fallbackInitials)
    const [imgError, setImgError] = useState<boolean>(false)
    const dimensions = `w-[${size}px] h-[${size}px]`
    return (
      <Avatar className={dimensions + ' ' + className}>
        {image && !imgError ? (
          <Image
            key={typeof image === 'string' ? image : image.src}
            src={image}
            alt={alt || fallbackInitials}
            width={size}
            height={size}
            onError={() => setImgError(true)}
          />
        ) : (
          <AvatarFallback
            style={{ backgroundColor: `${fallbackColor}` }}
            className="text-white font-golos-medium !text-t-xs"
          >
            {fallbackInitials}
          </AvatarFallback>
        )}
      </Avatar>
    )
  }
)

GenericAvatar.displayName = 'GenericAvatar'
