import React from 'react';
import AssetCategoryCard from './AssetCategoryCard';

export default function Assets({assetCategories}) {
  return (
    <div className="assets card">
      {Object.keys(assetCategories).map(category => (
        <AssetCategoryCard
          assets={assetCategories[category]}
          title={category}
        />
      ))}
    </div>
  );
}
