import React from 'react';
import {colors} from '../colors';
import {PieChart, Pie, Sector, Cell} from 'recharts';

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 4 / 100) {
    return '';
  }
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const RADIAN = Math.PI / 180;
export default function PieCard({data, title}) {
  const colData = data.map((d, i) => ({...d, color: colors[i % 5]}));
  return (
    <div className="pie-card">
      <h2>{title}</h2>
      <div className="pie-card-content">
        <PieChart width={140} height={140} data={colData}>
          <Pie
            data={colData}
            cx={60}
            cy={60}
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={60}
            fill="#8884d8">
            {colData.map((entry, index) => (
              <Cell fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
        <ul className="labels">
          {colData.map((entry, index) => (
            <li className="label">
              <span className="bar" style={{backgroundColor: colors[index]}} />
              <span className="label-text">{entry.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
