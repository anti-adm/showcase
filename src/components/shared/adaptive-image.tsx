'use client';

import Image, {type ImageProps} from 'next/image';
import {useState} from 'react';
import {cn} from '@/lib/utils';

type Props = ImageProps & {
  fallbackClassName?: string;
};

export function AdaptiveImage({className, alt, fallbackClassName, ...props}: Props) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        aria-label={alt}
        className={cn(
          'h-full w-full bg-[radial-gradient(circle_at_top_left,_rgba(196,220,255,0.65),_transparent_24%),linear-gradient(135deg,_#eff6ff_0%,_#b8cff6_42%,_#0d2d68_100%)]',
          fallbackClassName,
          className
        )}
        role="img"
      />
    );
  }

  return <Image {...props} alt={alt} className={className} onError={() => setError(true)} />;
}
