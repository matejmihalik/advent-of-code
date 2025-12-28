// --- Day 15: Science for Hungry People ---
// https://adventofcode.com/2015/day/15
// https://www.reddit.com/r/adventofcode/comments/3wwj84/day_15_solutions

import { type Combination, type EvaluationFunction, Knapsack } from '#src/algorithms';
import { InputReader } from '#src/input';

type Property = 'capacity' | 'durability' | 'flavor' | 'texture' | 'calories';

type Ingredient = Map<Property, number>;

const INGREDIENT_SEPARATOR = ': ';
const PROPERTY_SEPARATOR = ', ';
const PROPERTY_MODIFIER_SEPARATOR = ' ';

const SCORING_PROPERTIES: Property[] = ['capacity', 'durability', 'flavor', 'texture'];
const CALORIE_PROPERTY: Property = 'calories';
const INGREDIENT_LIMIT = 100;

function parsePropertyModifiers(
    propertyModifiers: string,
): [property: Property, modifier: number][] {
    return propertyModifiers.split(PROPERTY_SEPARATOR).map((propertyModifier) => {
        const [property, modifier] = propertyModifier.split(PROPERTY_MODIFIER_SEPARATOR);
        return [property as Property, Number(modifier)];
    });
}

function parseIngredient(ingredient: string): Ingredient {
    const [, propertyModifiers] = ingredient.split(INGREDIENT_SEPARATOR);
    return new Map(parsePropertyModifiers(propertyModifiers));
}

const INGREDIENTS = new InputReader(import.meta.dirname).readAsLines(parseIngredient);
const INGREDIENT_WEIGHTS = Array(INGREDIENTS.length).fill(1);

function calculatePropertyScore(recipe: Combination, property: Property): number {
    return recipe.reduce((propertyScore, ingredientAmount, ingredientIndex) => {
        const ingredient = INGREDIENTS[ingredientIndex];
        const ingredientPropertyModifier = ingredient.get(property) ?? 0;
        return propertyScore + ingredientAmount * ingredientPropertyModifier;
    }, 0);
}

const calculateCookieScore: EvaluationFunction = (recipe) =>
    SCORING_PROPERTIES.reduce((cookieScore, property) => {
        const propertyScore = calculatePropertyScore(recipe, property);
        return cookieScore * Math.max(propertyScore, 0);
    }, 1);

export function partOne(): number {
    const knapsack = new Knapsack(INGREDIENT_WEIGHTS, INGREDIENT_LIMIT, INGREDIENT_LIMIT);
    return knapsack.findBestValue(calculateCookieScore);
}

export function partTwo(): number {
    const calorieTarget = 500;

    const knapsack = new Knapsack(INGREDIENT_WEIGHTS, INGREDIENT_LIMIT, INGREDIENT_LIMIT);
    return knapsack.findBestValue(calculateCookieScore, (recipe) =>
        calculatePropertyScore(recipe, CALORIE_PROPERTY) === calorieTarget);
}
