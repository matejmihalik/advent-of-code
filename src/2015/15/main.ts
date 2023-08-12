// --- Day 15: Science for Hungry People ---
// https://adventofcode.com/2015/day/15

import { InputReader } from '#src/InputReader.ts';

const INGREDIENT_PROPERTIES = new InputReader(import.meta.url).readAsLines();

type IngredientMap = Map<string, Map<string, number>>;

type Recipe = Map<string, number>;

const INGREDIENT_LIMIT = 100;
const CALORIE_PROPERTY = 'calories';

const INGREDIENT_MAP = INGREDIENT_PROPERTIES.reduce<IngredientMap>((ingredientMap, description) => {
    const descriptionMatch = description.match(/^(?<ingredient>\w+): (?<properties>.*)$/);

    if (!descriptionMatch?.groups) {
        return ingredientMap;
    }

    const { ingredient, properties } = descriptionMatch.groups;

    const propertyMap = new Map(
        properties.split(', ').map((propertyString) => {
            const [name, value] = propertyString.split(' ');
            return [name, Number(value)];
        }),
    );

    ingredientMap.set(ingredient, propertyMap);

    return ingredientMap;
}, new Map());

const ALL_INGREDIENTS = Array.from(INGREDIENT_MAP.keys());

function getAllPossibleRecipes(ingredients: string[], ingredientLimit: number): Recipe[] {
    const recipes: Recipe[] = [];
    const [currentIngredient, ...otherIngredients] = ingredients;

    if (!otherIngredients.length) {
        return [new Map([[currentIngredient, ingredientLimit]])];
    }

    for (
        let currentIngredientAmount = 0;
        currentIngredientAmount <= ingredientLimit;
        currentIngredientAmount++
    ) {
        const possibleRecipes = getAllPossibleRecipes(
            otherIngredients,
            ingredientLimit - currentIngredientAmount,
        ).map((recipe) => recipe.set(currentIngredient, currentIngredientAmount));
        recipes.push(...possibleRecipes);
    }

    return recipes;
}

function calculateCookiePropertyScore(recipe: Recipe, property: string): number {
    return Array.from(recipe.entries()).reduce(
        (cookiePropertyValue, [ingredient, ingredientAmount]) =>
            cookiePropertyValue +
            ingredientAmount * (INGREDIENT_MAP.get(ingredient)?.get(property) ?? 0),
        0,
    );
}

function calculateCookieScore(recipe: Recipe): number {
    const allIngredientProperties = Array.from(
        INGREDIENT_MAP.get(ALL_INGREDIENTS[0])?.keys() ?? [],
    );
    const contributingProperties = allIngredientProperties.filter(
        (property) => property !== CALORIE_PROPERTY,
    );

    return contributingProperties.reduce((currentScore, property) => {
        const propertyScore = calculateCookiePropertyScore(recipe, property);
        return currentScore * Math.max(propertyScore, 0);
    }, 1);
}

function findHighestCookieScore(recipes: Recipe[]): number {
    return recipes
        .map(calculateCookieScore)
        .reduce(
            (highestCookieScore, currentCookieScore) =>
                currentCookieScore > highestCookieScore ? currentCookieScore : highestCookieScore,
            -Infinity,
        );
}

export function partOne(): number {
    const recipes = getAllPossibleRecipes(ALL_INGREDIENTS, INGREDIENT_LIMIT);
    return findHighestCookieScore(recipes);
}

export function partTwo(): number {
    const calorieTarget = 500;
    const recipes = getAllPossibleRecipes(ALL_INGREDIENTS, INGREDIENT_LIMIT);
    const calorieConsciousRecipes = recipes.filter(
        (recipe) => calculateCookiePropertyScore(recipe, CALORIE_PROPERTY) === calorieTarget,
    );

    return findHighestCookieScore(calorieConsciousRecipes);
}
