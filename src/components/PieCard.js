import React from 'react';
import PieChart from 'react-minimal-pie-chart';
import {colors} from '../colors';

export default function PieCard({data, title}) {
  const colData = data.map((d, i) => ({...d, color: colors[i % 5]}));
  return (
    <div className="pie-card">
      <h2>{title}</h2>
      <div className="pie-card-content">
        <PieChart
          style={{width: '100px', height: '100px'}}
          viewBoxSize={[100, 100]}
          data={colData}
        />
        <ul className="labels">
          {colData.map((entry, index) => (
            <li className="label">
              <span className="bar" style={{backgroundColor: colors[index]}} />
              <span className="label-text">{entry.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
