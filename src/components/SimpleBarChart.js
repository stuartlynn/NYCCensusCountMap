import React from 'react';

export default function SimpleBarChart({data, title, norm, style}) {
  let sortedData = data.sort((a, b) => (a.value < b.value ? 1 : -1));
  if (norm) {
    const total = data.reduce((t, d) => t + d.value, 0);
    sortedData = sortedData.map(a => ({...a, value: a.value / total}));
  }
  const max = Math.max(...sortedData.map(d => d.value));
  const min = Math.min(...sortedData.map(d => d.value));

  return (
    <div style={style} className="simple-bar-chart">
      <h3>{title}</h3>
      <div className="bar-chart">
        {sortedData.map(datum => (
          <React.Fragment>
            <span>{datum.label} </span>
            <span
              className="bar"
              style={{
                backgroundColor: 'blue',
                width: `${((datum.value - min) * 100.0) / (max - min)}%`,
              }}></span>
            <span className="label">{datum.value.toPrecision(2)}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
