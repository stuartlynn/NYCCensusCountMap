import React from 'react';

export default function DetailsSelector({selected, onSelect}) {
  const isSelected = name => (name === selected ? 'selected' : '');
  return (
    <div className="details-selector">
      <ul>
        <li
          onClick={() => onSelect('barriers')}
          className={isSelected('barriers')}>
          Barriers
        </li>
        <li
          onClick={() => onSelect('demographics')}
          className={isSelected('demographics')}>
          Demographics
        </li>
        <li
          onClick={() => onSelect('census2020')}
          className={isSelected('census2020')}>
          Census 2020 info
        </li>
        <li onClick={() => onSelect('assets')} className={isSelected('assets')}>
          Assets
        </li>
      </ul>
    </div>
  );
}
