import React, {useState} from 'react';
import {RadialChart} from 'react-vis';
import FacilityCard from './FacilityCard';

export default function Details({feature, facilities, onSelectFacility}) {
  console.log(feature);

  const [showFacilities, setShowFacilities] = useState(false);

  const makeInternetData = feature => {
    const cols = [
      'NoInternet',
      'Internet_NoSub',
      'Internet',
      'DialUpOnly',
      'Broadband_Any',
      'Cellular',
      'CellularOnly',
      'Broadband_CableFiberOpticDSL',
      'Broadband_CableFiberOpticDSLOnly',
      'Satellite',
      'SatelliteOnly',
      'OtherOnly',
    ];
    const data = cols.map(col => ({
      angle: feature.properties[col],
      label: col,
    }));
    return data;
  };

  const makeLEP = feature => {
    const cols = [
      'LEPHHs',
      'LEPspanHHs',
      'LEPindoeurHHs',
      'LEPapacHHs',
      'LEPotherHHs',
    ];
    const data = cols.map(col => ({
      angle: feature.properties[col],
      label: col,
    }));
    return data;
  };

  return (
    <div className="feature">
      {feature ? (
        <React.Fragment>
          <div className="details-header">
            <h2>Census Tract: {feature.properties.GEOID}</h2>
            <p>
              <span
                onClick={() => setShowFacilities(false)}
                className={!showFacilities ? 'selected' : ''}>
                Stats
              </span>{' '}
              /{' '}
              <span
                onClick={() => setShowFacilities(true)}
                className={showFacilities ? 'selected' : ''}>
                Facilities
              </span>
            </p>
          </div>
          <div className="cards">
            {showFacilities ? (
              facilities.map(f => <FacilityCard facility={f} />)
            ) : (
              <React.Fragment>
                <div className="card basic">
                  <h3>Basic Info</h3>
                  <p>Population {feature.properties.TotPopACS17}</p>
                  <p>Mail return rate 2010 :{feature.properties.MRR2010}%</p>
                </div>
                <div className="card demographics">
                  <h3>Demographics</h3>
                  <p>
                    White :{' '}
                    {feature.properties.WhiteAloneOrCombo /
                      feature.properties.TotPopACS17}{' '}
                    %
                  </p>
                  <p>
                    Black:{' '}
                    {feature.properties.BlackAloneOrCombo /
                      feature.properties.TotPopACS17}{' '}
                    %
                  </p>
                  <p>
                    Asian:{' '}
                    {feature.properties.AsianAloneOrCombo /
                      feature.properties.TotPopACS17}{' '}
                    %
                  </p>
                  <p>
                    Hispanic:{' '}
                    {feature.properties.Hispanic /
                      feature.properties.TotPopACS17}{' '}
                    %
                  </p>
                </div>
                <div className="card english_proficency">
                  <h3>English Proficency</h3>
                  <RadialChart
                    width={200}
                    height={200}
                    data={makeLEP(feature)}
                    showLabels
                    labelsRadiusMultiplier={1.1}
                    labelsStyle={{
                      fontSize: 12,
                    }}
                    innerRadius={80}
                    radius={100}
                  />
                </div>
                <div className="card internet">
                  <h3>Internet</h3>
                  <RadialChart
                    width={200}
                    height={200}
                    data={makeInternetData(feature)}
                    showLabels
                    labelsRadiusMultiplier={1.1}
                    labelsStyle={{
                      fontSize: 12,
                      color: 'white',
                    }}
                  />
                </div>
              </React.Fragment>
            )}
          </div>
        </React.Fragment>
      ) : (
        <h2>Click to see details of feature</h2>
      )}
    </div>
  );
}
