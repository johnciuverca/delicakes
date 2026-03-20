import React from "react";

export function RecipesPage(): React.JSX.Element {
  return (
    <section className="recipes-page">
        <div className="recipes-header">
            <p className="recipes-eyebrow">Delicakes Collection</p>
            <h2>Our recipes</h2>
            <p className="recipes-subtitle">Deiscover some of our cakes, pastries and dessert ideas.</p>
        </div>
         <div className="recipes-grid">
            <article className="recipe-card">
                <div className="recipe-image-wrap">
                    <img
                        className="recipe-image"
                        src="/assets/images/1.jpeg"
                        alt="Recipe example"
                    />
                    <span className="recipe-category">Cake</span>
                </div>

                <div className="recipe-body">
                    <h3>Vanilla Berry Cake</h3>
                    <p>
                         Soft sponge layers with cream and fresh fruit for a light finish.
                    </p>
                    <button type="button" className="recipe-btn">
                         View Recipe
                    </button>
                </div>
            </article>
        </div>
    </section>
  );
}
