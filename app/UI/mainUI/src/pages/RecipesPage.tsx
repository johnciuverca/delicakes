import { FormEvent, useEffect, useState } from "react";
import { useUserState } from "../state/AppContext";

const localApiBaseUrl = "http://localhost:3100";
const apiBaseUrl = localApiBaseUrl;

type RecipeSlot = {
    id: number;
    title: string;
    category: string;
    description: string;
    imageSrc: string;
};

type RecipeFormValues = Omit<RecipeSlot, "id">;

type RecipesResponse = {
    recipes: RecipeSlot[];
};

type AddRecipeResponse = {
    newRecipe: RecipeSlot;
};

type DeleteRecipesResponse = {
    deletedIds: number[];
};

export function RecipesPage() {
    const [loggedInUser] = useUserState();
    const isAdmin = loggedInUser?.role === "admin";

    const [recipes, setRecipes] = useState<RecipeSlot[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showDeleteMode, setShowDeleteMode] = useState(false);

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [imageSrc, setImageSrc] = useState("");

    const [formError, setFormError] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [selectedRecipeIds, setSelectedRecipeIds] = useState<number[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);

    const resetForm = () => {
        setTitle("");
        setCategory("");
        setDescription("");
        setImageSrc("");
        setFormError("");
    };

    const resetDeleteState = () => {
        setSelectedRecipeIds([]);
        setDeleteError("");
        setShowDeleteMode(false);
    };

    const handleToggleRecipeSelection = (recipeId: number) => {
        setDeleteError("");
        setSelectedRecipeIds((current) =>
            current.includes(recipeId)
                ? current.filter((id) => id !== recipeId)
                : [...current, recipeId],
        );
    };

    useEffect(() => {
        fetch(`${apiBaseUrl}/api/recipes`)
            .then((res) => res.json())
            .then((data: RecipesResponse) => {
                setRecipes(data.recipes);
            });
    }, []);

    const handleAddRecipe = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isAdmin) {
            setFormError("Only admin users can add recipes.");
            return;
        }

        if (!title.trim() || !category.trim() || !description.trim() || !imageSrc.trim()) {
            setFormError("All fields are required.");
            return;
        }

        const newRecipe: RecipeFormValues = {
            title: title.trim(),
            category: category.trim(),
            description: description.trim(),
            imageSrc: imageSrc.trim(),
        };

        fetch(`${apiBaseUrl}/api/recipes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newRecipe),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to add recipe");
                }
                return res.json();
            })
            .then((data: AddRecipeResponse) => {
                setRecipes((current) => [...current, data.newRecipe]);
                resetForm();
                setShowAddForm(false);
            })
            .catch(() => {
                setFormError("Failed to add recipe. Please try again.");
            });
    };

    const handleDeleteSelectedRecipes = () => {
        if (!isAdmin) {
            setDeleteError("Only admin users can delete recipes.");
            return;
        }

        if (selectedRecipeIds.length === 0) {
            setDeleteError("Please select at least one recipe to delete.");
            return;
        }

        setIsDeleting(true);

        fetch(`${apiBaseUrl}/api/recipes`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ids: selectedRecipeIds }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to delete recipes");
                }
                return res.json();
            })
            .then((data: DeleteRecipesResponse) => {
                setRecipes((current) =>
                    current.filter((recipe) => !data.deletedIds.includes(recipe.id)),
                );
                resetDeleteState();
            })
            .catch(() => {
                setDeleteError("Failed to delete recipes. Please try again.");
            })
            .finally(() => {
                setIsDeleting(false);
            });
    };

    return (
        <section className="recipes-page">
            <div className="recipes-header">
                <p className="recipes-eyebrow">Delicakes Collection</p>
                <h2>Our recipes</h2>
                <p className="recipes-subtitle">
                    Discover some of our cakes, pastries and dessert ideas.
                </p>

                {isAdmin && (
                    <div className="recipes-actions">
                        <button
                            type="button"
                            className="add-recipe-btn"
                            onClick={() => {
                                setFormError("");
                                resetDeleteState();
                                setShowAddForm((current) => !current);
                            }}
                        >
                            {showAddForm ? "Close Form" : "Add New Recipe"}
                        </button>

                        <button
                            type="button"
                            className="add-recipe-btn delete-recipe-btn"
                            onClick={() => {
                                resetForm();
                                setShowAddForm(false);
                                setDeleteError("");
                                setSelectedRecipeIds([]);
                                setShowDeleteMode((current) => !current);
                            }}
                        >
                            {showDeleteMode ? "Close Delete Mode" : "Delete Recipes"}
                        </button>
                    </div>
                )}
            </div>

            {isAdmin && showAddForm && (
                <form className="recipe-form" onSubmit={handleAddRecipe}>
                    <div className="recipe-form-row">
                        <label htmlFor="recipe-title">Title</label>
                        <input
                            id="recipe-title"
                            type="text"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="Chocolate Tart"
                        />
                    </div>

                    <div className="recipe-form-row">
                        <label htmlFor="recipe-category">Category</label>
                        <input
                            id="recipe-category"
                            type="text"
                            value={category}
                            onChange={(event) => setCategory(event.target.value)}
                            placeholder="Dessert"
                        />
                    </div>

                    <div className="recipe-form-row">
                        <label htmlFor="recipe-description">Description</label>
                        <textarea
                            id="recipe-description"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            placeholder="Describe the recipe..."
                        />
                    </div>

                    <div className="recipe-form-row">
                        <label htmlFor="recipe-image">Image URL</label>
                        <input
                            id="recipe-image"
                            type="text"
                            value={imageSrc}
                            onChange={(event) => setImageSrc(event.target.value)}
                            placeholder="/images/new_recipe.jpg"
                        />
                    </div>

                    {formError && <p className="recipe-form-error">{formError}</p>}

                    <div className="recipe-form-actions">
                        <button type="submit" className="add-recipe-btn">
                            Save Recipe
                        </button>
                        <button
                            type="button"
                            className="recipe-btn"
                            onClick={() => {
                                resetForm();
                                setShowAddForm(false);
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {isAdmin && showDeleteMode && (
                <div className="recipe-form recipe-delete-panel">
                    <p className="recipes-subtitle">
                        Select one or more recipes, then confirm deletion.
                    </p>

                    {deleteError && <p className="recipe-form-error">{deleteError}</p>}

                    <div className="recipe-form-actions">
                        <button
                            type="button"
                            className="add-recipe-btn delete-recipe-btn"
                            onClick={handleDeleteSelectedRecipes}
                            disabled={isDeleting}
                        >
                            {isDeleting
                                ? "Deleting..."
                                : `Delete Selected (${selectedRecipeIds.length})`}
                        </button>

                        <button
                            type="button"
                            className="recipe-btn"
                            onClick={resetDeleteState}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="recipes-grid">
                {recipes.map((recipe) => {
                    const isSelected = selectedRecipeIds.includes(recipe.id);

                    return (
                        <article
                            className={`recipe-card${isSelected ? " recipe-card-selected" : ""}`}
                            key={recipe.id}
                        >
                            <div className="recipe-image-wrap">
                                <img
                                    className="recipe-image"
                                    src={recipe.imageSrc}
                                    alt={recipe.title}
                                />
                                <span className="recipe-category">{recipe.category}</span>
                            </div>

                            <div className="recipe-body">
                                {isAdmin && showDeleteMode && (
                                    <label className="recipe-select-control">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleToggleRecipeSelection(recipe.id)}
                                        />
                                        Select for deletion
                                    </label>
                                )}

                                <h3>{recipe.title}</h3>
                                <p>{recipe.description}</p>

                                <button type="button" className="recipe-btn">
                                    View Recipe
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}