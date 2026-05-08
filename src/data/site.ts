export type SceneKey = 'scene1' | 'scene2' | 'scene3' | 'scene4' | 'scene5';

export const heroSceneKeys: SceneKey[] = ['scene1', 'scene2', 'scene3', 'scene4', 'scene5'];

export const categoryIds = ['milk', 'kefir', 'yogurt', 'cheese', 'ayran'] as const;
export const qualityIds = ['freshness', 'farms', 'production', 'coldChain'] as const;
export const recipeIds = ['breakfast', 'dessert', 'family'] as const;
