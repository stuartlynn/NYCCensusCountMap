import React from 'react';
import ContactTypeLegend from './ContactTypeLegend';
import BoundarySelector from './BoundarySelector';

export default function Legend({
  selectedBoundary,
  boundaries,
  onSelectBoundary,
}) {
  return (
    <div className="Legend">
      <section className="thematic-layer">
        <ContactTypeLegend />
        <BoundarySelector
          selectedBoundary={selectedBoundary}
          onSelect={onSelectBoundary}
          boundaries={boundaries}
        />
      </section>
    </div>
  );
}
