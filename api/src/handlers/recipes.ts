import { type Request, type Response } from "express";
import { addRecipe, getAllRecipes } from "../data/dbStorage.js";
import { Recipe } from "../model/recipe.js";

export const getRecipesHandler = (req: Request, res: Response) => {
    getAllRecipes()
        .then((recipes) => {
            res.json({ recipes });
        })
        .catch(() => {
            res.status(500).json({ error: "Failed to fetch recipes" });
        });
};

export const addRecipeHandler = (req: Request, res: Response) => {
    const { title, category, description, imageSrc } = req.body;

    if (!title || !category || !description || !imageSrc) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }
    const recipe: Omit<Recipe, "id"> = {
        title,
        category,
        description,
        imageSrc,
    };

    addRecipe(recipe)
        .then((newRecipe) => {
            res.status(201).json({ newRecipe });
        })
        .catch((err) => {
            const error = new Error("Failed to add recipe", {
                cause: err,
            });
            console.error(error);
            res.status(500).json({ error: error.message });
        });
    };

