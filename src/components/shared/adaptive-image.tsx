'use client';

import Image, {type ImageProps} from 'next/image';
import {useState} from 'react';
import {cn} from '@/lib/utils';

type Props = ImageProps & {fallbackClassName?: string};

export function AdaptiveImage({className, alt, fallbackClassName, src, onError, ...props}: Props) {
  const [failedSrc, setFailedSrc] = useState<ImageProps['src'] | null>(null);
  const failed = failedSrc === src;
  if (failed) {
    return <div role={alt ? 'img' : undefined} aria-label={alt || undefined} className={cn('image-fallback', fallbackClassName, className)}>
      <span aria-hidden="true">SOFIN</span>
    </div>;
  }
  return <Image {...props} src={src} alt={alt} className={className} onError={(event) => {setFailedSrc(src); onError?.(event);}} />;
}
export default AdaptiveImage;
