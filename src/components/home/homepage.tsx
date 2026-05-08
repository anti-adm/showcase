import {ContactPanel} from '@/components/home/sections/contact-panel';
import HeroStory from '@/components/home/sections/hero-story';
import {LargeStoryPanel} from '@/components/home/sections/large-story-panel';

export function HomePage() {
  return (
    <main>
      <HeroStory />
      <LargeStoryPanel panel="brand" image="/images/hero/hero3.jpeg" accentImage="/images/brand/pack-line.jpg" />
      <LargeStoryPanel panel="categories" image="/images/hero/hero2.jpeg" accentImage="/images/products/yogurt-cherry.jpg" secondaryImage="/images/products/yogurt-banana.jpg" />
      <LargeStoryPanel panel="quality" image="/images/hero/hero1.jpeg" accentImage="/logo/sofin-logo.png" />
      <LargeStoryPanel panel="recipes" image="/images/hero/hero3.jpeg" accentImage="/images/recipes/recipe-1.jpeg" secondaryImage="/images/recipes/recipe-2.jpeg" tertiaryImage="/images/recipes/recipe-3.jpeg" />
      <ContactPanel />
    </main>
  );
}
