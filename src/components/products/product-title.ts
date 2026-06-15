export function getProductDisplayTitle(title: string) {
  return title
    .replace(
      /\s*(?:[-–—]\s*)?\d+(?:[.,]\d+)?(?:\s*[-–—]\s*\d+(?:[.,]\d+)?)*\s*(?:kg|кг|ml|мл|g|г|l|л)(?=$|[\s,.;:)\]])\.?/giu,
      ""
    )
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/\s*[-–—]\s*$/g, "")
    .trim();
}
