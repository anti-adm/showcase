import HeroStory from "@/components/home/sections/hero-story";
import StoryBlock from "@/components/home/sections/story-block";

export default function HomePage() {
  return (
    <>
      <HeroStory />

      <StoryBlock
        eyebrow="ПРОДУКЦИЯ"
        title="Йогурты, молоко и другие продукты SOFIN"
        description="Мы развиваем линейку молочных продуктов с акцентом на свежесть, понятный состав и стабильное качество в ежедневном выборе."
        cta={{label: "Смотреть продукцию", href: "/products"}}
      />

      <StoryBlock
        eyebrow="РЕЦЕПТЫ"
        title="Идеи для завтрака, десертов и повседневных блюд"
        description="В следующих разделах сайт будет развиваться как бренд-платформа: не только продукт, но и рецепты, истории и визуальная подача бренда."
        cta={{label: "Перейти к рецептам", href: "/recipes"}}
      />
    </>
  );
}