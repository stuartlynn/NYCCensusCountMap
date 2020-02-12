import React, {useState} from 'react';
import ContactTypeLegend from './ContactTypeLegend';
import RangeLegend from './RangeLegend';
import BoundarySelector from './BoundarySelector';
import FacilitiesSelector from './FacilitiesSelector';
import HelpTab from './HelpTab';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
  faLayerGroup,
  faQuestionCircle,
  faList,
} from '@fortawesome/free-solid-svg-icons';

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
  selectedFacilityTypes,
  onSelectFacilityType,
}) {
  const [tab, setTab] = useState('layers');
  console.log('Tab is ', tab);
  return (
    <div className="Legend overlay">
      <div className="tabs">
        <div
          className={tab === 'layers' ? 'selected' : ''}
          onClick={() => setTab('layers')}>
          <FontAwesomeIcon icon={faLayerGroup} />
        </div>
        <div
          className={tab === 'legend' ? 'selected' : ''}
          onClick={() => setTab('legend')}>
          <FontAwesomeIcon icon={faList} />
        </div>
        <div
          className={tab === 'info' ? 'selected' : ''}
          onClick={() => setTab('info')}>
          <FontAwesomeIcon icon={faInfoCircle} />
        </div>
        <div
          className={tab === 'questions' ? 'selected' : ''}
          onClick={() => setTab('questions')}>
          <FontAwesomeIcon icon={faQuestionCircle} />
        </div>
      </div>
      <div className="content">
        {tab === 'layers' && (
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
            <FacilitiesSelector
              selected={selectedFacilityTypes}
              onSelected={onSelectFacilityType}
            />
          </section>
        )}
        {tab === 'questions' && <HelpTab />}
      </div>
    </div>
  );
}
