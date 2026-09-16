export function formatMeasure(value: string, locale: string) {
  if (locale !== "ru") return value;
  return value.replace(/\bkg\b/g, "кг").replace(/\bml\b/g, "мл").replace(/\bg\b/g, "г").replace(/\bL\b/g, "л").replace(/\bdilim\b/g, "ломтики");
}
