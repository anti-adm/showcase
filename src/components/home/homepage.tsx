import {ContactPanel} from '@/components/home/sections/contact-panel';
import HeroStory from '@/components/home/sections/hero-story';
import {LargeStoryPanel} from '@/components/home/sections/large-story-panel';

export function HomePage() {
  return (
    <main>
      <HeroStory />
      <LargeStoryPanel panel="brand" image="/images/hero/hero3.webp" accentImage="/images/brand/pack-line.webp" />
      <LargeStoryPanel panel="categories" image="/images/hero/hero2.webp" accentImage="/images/products/yogurt/YOGURT_BOTTLE_OLCHA.webp" secondaryImage="/images/products/yogurt/YOGURT_BOTTLE_ANANAS.webp" />
      <LargeStoryPanel panel="quality" image="/images/hero/hero1.webp" accentImage="/logo/sofin-logo.webp" />
      <LargeStoryPanel panel="recipes" image="/images/hero/hero3.webp" accentImage="/images/recipes/cheesecake-cups.webp" secondaryImage="/images/recipes/syrniki.webp" tertiaryImage="/images/recipes/bliny.webp" />
      <ContactPanel />
    </main>
  );
}
