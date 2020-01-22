import React from 'react';
import ContactTypeLegend from './ContactTypeLegend';
import RangeLegend from './RangeLegend';
import BoundarySelector from './BoundarySelector';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

export default function Legend({
  selectedBoundary,
  boundaries,
  onSelectBoundary,
  showFacilities,
  onShowFacilitiesChange,
  onSelectMetric,
  metric,
}) {
  return (
    <div className="Legend">
      <section className="thematic-layer">
        <h3>Metric</h3>
        <Dropdown
          options={[
            {value: 'strategy', label: 'Mail Strategy'},
            {value: 'returnCount', label: '2020 Mail Return Rate'},
          ]}
          onChange={a => onSelectMetric(a.value)}
          value={metric}
          placeholder="Select a metric"
        />
        {metric == 'strategy' ? (
          <ContactTypeLegend />
        ) : (
          <RangeLegend
            name="2020 Mail Return %"
            min={0}
            max={100}
            colStart="#309dae"
            colEnd="#ebf7f9"
          />
        )}
        <BoundarySelector
          selectedBoundary={selectedBoundary}
          onSelect={onSelectBoundary}
          boundaries={boundaries}
        />
        <div className="facilitesToggle">
          <p>
            Show Facilities{' '}
            <input
              type="checkbox"
              checked={showFacilities}
              onChange={e => onShowFacilitiesChange(e.target.checked)}
            />
          </p>
        </div>
      </section>
    </div>
  );
}
