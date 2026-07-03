import Image from 'next/image';
import {cn} from '@/lib/utils';

export function Logo({className, compact = false}: {className?: string; compact?: boolean}) {
  return (
    <div className={cn('flex items-center gap-2.5 sm:gap-3', className)}>
      <div className={cn('relative overflow-hidden rounded-[16px] border border-white/40 bg-white/65 shadow-[0_12px_28px_rgba(10,32,71,0.12)] sm:rounded-[20px]', compact ? 'h-10 w-10 sm:h-11 sm:w-11' : 'h-10 w-10 sm:h-14 sm:w-14')}>
        <Image alt="SOFIN logo" className="object-cover" fill priority sizes="56px" src="/logo/sofin-logo.webp" />
      </div>
      {!compact ? (
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--text)] sm:text-base sm:tracking-[0.28em]">SOFIN</div>
          <div className="text-[9px] uppercase tracking-[0.24em] text-[color:var(--muted)] sm:text-[11px] sm:tracking-[0.28em]">From farm to shelf</div>
        </div>
      ) : null}
    </div>
  );
}
