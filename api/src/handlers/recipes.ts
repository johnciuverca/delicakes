import { type Request, type Response } from "express";
import { addRecipe, deleteRecipes, getAllRecipes } from "../data/dbStorage.js";
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

export const deleteRecipesHandler = (req: Request, res: Response) => {
    const ids = Array.isArray(req.body.ids) ? req.body.ids as Array<string> : null;
    
    if (!ids) {
        res.status(400).json({ error: "IDs must be an array of strings" });
        return;
    }

    const normalizedIds = ids
        .map(id => Number(id))
        .filter((id) => !isNaN(id) && id > 0);

    if( normalizedIds.length === 0) {
        res.status(400).json({ error: "No valid IDs provided" });
        return;
    }

    deleteRecipes(normalizedIds)
        .then((deletedIds) => {   
            res.json({ deletedIds });
        })
        .catch((err) => {
            const error = new Error("Failed to delete recipes", {
                cause: err,
            });
            console.error(error);
            res.status(500).json({ error: error.message });
        });
}

