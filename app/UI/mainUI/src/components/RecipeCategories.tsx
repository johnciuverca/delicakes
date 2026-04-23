import { useEffect, useState } from "react";
import { apiBaseUrl, defaultCategory } from "../shared/shared";

export interface RecipeCategoriesProps {
	onCategoryChange?: (category: string) => void;
}

export default function RecipeCategories(props: RecipeCategoriesProps): React.JSX.Element {

    const [categories , setCategories] = useState<string[]>([defaultCategory]);
    const [category, setCategory] = useState(defaultCategory);
    

    // const selectedCategories = [
    //         defaultCategory, ...Array.from(new Set(recipes.map((r) => r.category))),
    //     ]

    useEffect(() => {
        fetch(`${apiBaseUrl}/api/recipes/categories`)
			.then((res) => res.json())
			.then((data) => {
				setCategories([defaultCategory, ...data]);
			});
    }, []);

    return (
	    <select
            value={category}
            onChange={(e) => {
				setCategory(e.target.value);
				props.onCategoryChange?.(e.target.value);
			}}
            className='recipes-category-select'
            aria-label='Filter recipes by category'
        >
            {categories.map((cat) => (
                <option key={cat} value={cat}>
                    {cat}
                </option>
            ))}
        </select>
	);
}