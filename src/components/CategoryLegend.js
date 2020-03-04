import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

export default function CategoryLegend({ categories }) {
    return (
        <section className="category-layer">
            <ul>
                {categories.map(category => (
                    <li key={category.name} className="category-entry">
                        <div
                            className="category-marker"
                            style={{ backgroundColor: category.color }}
                        />
                        <div className="category-name">
                            {category.name}
                            {category.sub && (
                                <p className="category-sub">{category.sub}</p>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}
