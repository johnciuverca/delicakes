import React from "react";

type RecipeSlot = {
    id: number;
    title: string;
    category: string;
    description: string;
    imageSrc: string;
};

const recipeSlots: RecipeSlot[] = [
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
    return (
    <section className="recipes-page">
      <div className="recipes-header">
        <p className="recipes-eyebrow">Delicakes Collection</p>
        <h2>Our recipes</h2>
        <p className="recipes-subtitle">
          Discover some of our cakes, pastries and dessert ideas.
        </p>
      </div>

        <div className="recipes-grid">
            {recipeSlots.map((recipe) => (
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