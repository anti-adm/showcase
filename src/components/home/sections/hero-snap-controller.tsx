"use client";

import {useEffect} from "react";

type Props = {
  selector?: string;
  rootId?: string;
};

export default function HeroSnapController({
  selector = "[data-scene-index]",
  rootId = "hero-story-root"
}: Props) {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(selector)
    );

    const root = document.getElementById(rootId);

    if (!nodes.length || !root) return;

    let currentIndex = 0;
    let locked = false;
    let wheelAccumulator = 0;
    let touchStartY = 0;
    let touchLocked = false;

    const clamp = (value: number, min: number, max: number) =>
      Math.max(min, Math.min(value, max));

    const getNearestIndex = () => {
      let nearest = 0;
      let smallest = Number.POSITIVE_INFINITY;

      nodes.forEach((node, index) => {
        const rect = node.getBoundingClientRect();
        const distance = Math.abs(rect.top);

        if (distance < smallest) {
          smallest = distance;
          nearest = index;
        }
      });

      return nearest;
    };

    const isHeroActiveZone = () => {
      const rect = root.getBoundingClientRect();

      return rect.top <= 8 && rect.bottom >= window.innerHeight * 0.82;
    };

    const goTo = (index: number) => {
      const next = clamp(index, 0, nodes.length - 1);
      currentIndex = next;
      locked = true;
      wheelAccumulator = 0;

      nodes[next].scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      window.setTimeout(() => {
        locked = false;
      }, 940);
    };

    const syncCurrentIndex = () => {
      currentIndex = getNearestIndex();
    };

    const onWheel = (event: WheelEvent) => {
      if (!isHeroActiveZone()) return;
      if (locked) {
        event.preventDefault();
        return;
      }

      const delta = event.deltaY;

      if (Math.abs(delta) < 1) return;

      syncCurrentIndex();

      if ((delta > 0 && currentIndex >= nodes.length - 1) || (delta < 0 && currentIndex <= 0)) {
        wheelAccumulator = 0;
        return;
      }

      event.preventDefault();
      wheelAccumulator += delta;

      if (wheelAccumulator >= 82) {
        goTo(currentIndex + 1);
        return;
      }

      if (wheelAccumulator <= -82) {
        goTo(currentIndex - 1);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!isHeroActiveZone() || locked) return;

      if (event.key === "ArrowDown" || event.key === "PageDown") {
        syncCurrentIndex();
        if (currentIndex >= nodes.length - 1) return;

        event.preventDefault();
        goTo(currentIndex + 1);
      }

      if (event.key === "ArrowUp" || event.key === "PageUp") {
        syncCurrentIndex();
        if (currentIndex <= 0) return;

        event.preventDefault();
        goTo(currentIndex - 1);
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      if (!isHeroActiveZone()) return;
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!isHeroActiveZone()) return;
      if (locked || touchLocked) {
        event.preventDefault();
        return;
      }

      const currentY = event.touches[0]?.clientY ?? 0;
      const delta = touchStartY - currentY;

      if (Math.abs(delta) < 78) return;

      syncCurrentIndex();

      if ((delta > 0 && currentIndex >= nodes.length - 1) || (delta < 0 && currentIndex <= 0)) {
        return;
      }

      event.preventDefault();
      touchLocked = true;

      if (delta > 0) {
        goTo(currentIndex + 1);
      } else {
        goTo(currentIndex - 1);
      }

      window.setTimeout(() => {
        touchLocked = false;
      }, 980);
    };

    const onScroll = () => {
      syncCurrentIndex();
    };

    window.addEventListener("wheel", onWheel, {passive: false});
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, {passive: true});
    window.addEventListener("touchmove", onTouchMove, {passive: false});
    window.addEventListener("scroll", onScroll, {passive: true});

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [selector, rootId]);

  return null;
}
