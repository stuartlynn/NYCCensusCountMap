import React from 'react';

export default function RangeLegend({name, min, max, colStart, colEnd}) {
  const gradient = `linear-gradient(90deg, ${colStart} 0%, ${colEnd} 100%)`;

  console.log('gradient is ', gradient);
  return (
    <div className="range-legend">
      <h4 className="range-legend-title">{name}</h4>
      <div
        className="range-legend-bar"
        style={{
          background: gradient,
        }}
      />
      <div className="range-legend-labels">
        <p>{min}</p> <p>{max}</p>
      </div>
    </div>
  );
}
