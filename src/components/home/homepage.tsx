import {ContactPanel} from '@/components/home/sections/contact-panel';
import HeroStory from '@/components/home/sections/hero-story';
import {LargeStoryPanel} from '@/components/home/sections/large-story-panel';

export function HomePage() {
  return (
    <main>
      <HeroStory />
      <LargeStoryPanel panel="brand" image="/images/hero/hero3.jpeg" accentImage="/images/brand/pack-line.jpg" />
      <LargeStoryPanel panel="categories" image="/images/hero/hero2.jpeg" accentImage="/images/products/yogurt/YOGURT_BOTTLE_OLCHA.webp" secondaryImage="/images/products/yogurt/YOGURT_BOTTLE_ANANAS.webp" />
      <LargeStoryPanel panel="quality" image="/images/hero/hero1.png" accentImage="/logo/sofin-logo.png" />
      <LargeStoryPanel panel="recipes" image="/images/hero/hero3.jpeg" accentImage="/images/recipes/cheesecake-cups.jpg" secondaryImage="/images/recipes/syrniki.jpg" tertiaryImage="/images/recipes/bliny.jpg" />
      <ContactPanel />
    </main>
  );
}
