import React, { FormEvent, useState } from "react";
import { useUserState } from "../state/AppContext";

type RecipeSlot = {
    id: number;
    title: string;
    category: string;
    description: string;
    imageSrc: string;
};

const initialRecipes: RecipeSlot[] = [
    {
        id: 1,
        title: "Chocolate Cake",
        category: "Dessert",
        description: "A rich and moist chocolate cake perfect for any occasion.",
        imageSrc: "/images/chocolate_cake.jpg",
    },
    {
        id: 2,
        title: "Chocolate Delight",
        category: "Dessert",
        description: "A delightful chocolate treat for all chocolate lovers.",
        imageSrc: "/images/chocolate_delight.jpg",
    },  
    {
        id: 3,
        title: "Chocolate Mousse",
        category: "Dessert",
        description: "A light and airy chocolate mousse that melts in your mouth.",
        imageSrc: "/images/chocolate_mousse.jpg",
    },
    {
        id: 4,
        title: "Chocolate Brownies",
        category: "Dessert",
        description: "Fudgy and delicious chocolate brownies with a crispy top.",
        imageSrc: "/images/chocolate_brownies.jpg",
    },
    {
        id: 5,
        title: "Chocolate Chip Cookies",
        category: "Dessert",
        description: "Crispy on the outside, chewy on the inside, these chocolate chip cookies are a classic treat.",
        imageSrc: "/images/chocolate_chip_cookies.jpg",
    },
    {  
        id: 6,
        title: "Chocolate Ice Cream",
        category: "Dessert",
        description: "Creamy and rich chocolate ice cream, perfect for a hot day.",
        imageSrc: "/images/chocolate_ice_cream.jpg",
    },
];

export function RecipesPage() {

const [loggedInUser] = useUserState();
const isAdmin = loggedInUser?.role === "admin";

const [recipes, setRecipes] = useState<RecipeSlot[]>(initialRecipes);
const [showAddForm, setShowAddForm] = useState(false);
const[title, setTitle] = useState("");
const[category, setCategory] = useState("");
const[description, setDescription] = useState("");
const[imageSrc, setImageSrc] = useState("");
const[formError, setFormError] = useState("");

const resetForm = () => {
    setTitle("");
    setCategory("");
    setDescription("");
    setImageSrc("");
    setFormError("");
};

const handleAddRecipe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if(!isAdmin) {
        setFormError("Only admin users can add recipes.");
        return;
    }

    if(!title.trim() || !category.trim() || !description.trim() || !imageSrc.trim()) {
        setFormError("All fields are required.");
        return;
    }

    const nextId = recipes.length > 0 ? Math.max(...recipes.map(r => r.id)) + 1 : 1;
    
    const newRecipe: RecipeSlot = {
        id: nextId,
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
        imageSrc: imageSrc.trim(),
    };

    setRecipes((currentRecipes) => [newRecipe, ...currentRecipes]);
    resetForm();
    setShowAddForm(false);
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
                    setShowAddForm((current) => !current);
                }}
            >
                {showAddForm ? "Close Form" : "Add Recipe"}
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
        <div className="recipes-grid">
            {recipes.map((recipe) => (
            <article className="recipe-card" key={recipe.id}>
                <div className="recipe-image-wrap">
                <img
                    className="recipe-image"
                    src={recipe.imageSrc}
                    alt={recipe.title}
                />
                <span className="recipe-category">{recipe.category}</span>
                </div>
                <div className="recipe-body">
                <h3>{recipe.title}</h3>
                <p>{recipe.description}</p>
                <button type="button" className="recipe-btn">
                    View Recipe
                </button>
                </div>
            </article>
            ))}
        </div>
    </section>
     );
}   