import React from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

export default function BoundarySelector({
  boundaries,
  selectedBoundary,
  onSelect,
}) {
  return (
    <section className="boundary-selector">
      <h4>Boundaries</h4>

      {boundaries && (
        <Dropdown
          options={Object.entries(boundaries).map(([id, layer]) => ({
            value: id,
            label: layer.datasetName,
          }))}
          onChange={a => onSelect(a.value)}
          value={selectedBoundary}
          placeholder="Select a boundary"
        />
      )}
    </section>
  );
}
