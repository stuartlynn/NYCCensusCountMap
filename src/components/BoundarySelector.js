import React from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

export default function BoundarySelector({
  boundaries,
  selectedBoundary,
  onSelect,
  defaultValue
}) {
  const options = Object.entries(boundaries).map(([id, layer]) => ({
    value: id,
    label: layer.datasetName,
  }));

  const dv = defaultValue ? defaultValue : {value: 'tracts', label: 'Census Tracts'}
  return (
    <section className="boundary-selector">
      <h3>Boundaries</h3>

      {boundaries && (
        <Dropdown
          options={[dv, ...options]}
          onChange={a => onSelect(a.value)}
          value={selectedBoundary}
          placeholder="Select a boundary"
        />
      )}
    </section>
  );
}
