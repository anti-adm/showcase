import Image from 'next/image';
import {assetUrl} from '@/lib/assets';
import {cn} from '@/lib/utils';

export function Logo({className, compact = false}: {className?: string; compact?: boolean}) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('relative overflow-hidden rounded-[20px] border border-white/40 bg-white/65 shadow-[0_12px_28px_rgba(10,32,71,0.12)]', compact ? 'h-11 w-11' : 'h-12 w-12 sm:h-14 sm:w-14')}>
        <Image alt="SOFIN logo" className="object-cover" fill priority sizes="56px" src={assetUrl("/logo/sofin-logo.webp")} />
      </div>
      {!compact ? (
        <div className="min-w-0">
          <div className="text-sm font-semibold uppercase tracking-[0.28em] text-[color:var(--text)] sm:text-base">SOFIN</div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--muted)] sm:text-[11px]">From farm to shelf</div>
        </div>
      ) : null}
    </div>
  );
}
