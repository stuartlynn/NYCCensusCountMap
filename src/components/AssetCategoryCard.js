import React from 'react';

export default function AssetCategoryCard({assets, title}) {
  console.log('assets', assets);
  return (
    <div className="asset-card">
      <h2>{title}</h2>
      <ul>
        {assets.map(asset => (
          <li className="asset">
            <h3>{asset.name}</h3>
            <p>
              {[asset.address, asset.boro, asset.city, asset.zipcode].join(',')}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
