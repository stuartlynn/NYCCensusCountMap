import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircle} from '@fortawesome/free-solid-svg-icons';

export default function CategoryLegend({categories}) {
  return (
    <section className="category-layer">
      <ul>
        {categories.map(category => (
          <li className="category-entry">
            <div
              className="category-marker"
              style={{backgroundColor: category.color}}
            />
            {category.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
