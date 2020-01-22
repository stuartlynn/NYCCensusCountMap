import React, {useState} from 'react';
import {RadialChart} from 'react-vis';
import FacilityCard from './FacilityCard';
import SimpleBarChart from './SimpleBarChart';

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
      value: feature.properties[col],
      label: col,
    }));
    return data;
  };
  const contactStrategy = feature => {
    switch (feature.strategy_code) {
      case 0:
        return 'Internet First, English';
      case 1:
        return 'Internet First, Bilingual';
      case 2:
        return 'Internet Choice, English';
      case 3:
        return 'Internet Choice, Bilingual';
    }
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
      value: feature.properties[col],
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
                  <p>
                    Population: <span>{feature.properties.TotPopACS17}</span>
                  </p>
                  <p>
                    Mail return rate 2010:{' '}
                    <span>{feature.properties.MRR2010}%</span>
                  </p>
                  <p>
                    Inital Contact Strategy:
                    <span>{contactStrategy(feature.properties)}</span>
                  </p>
                </div>
                <div className="card demographics">
                  <SimpleBarChart
                    title="Demographics"
                    data={[
                      {
                        label: 'white',
                        value:
                          feature.properties.WhiteAloneOrCombo /
                          feature.properties.TotPopACS17,
                      },
                      {
                        label: 'black',
                        value:
                          feature.properties.BlackAloneOrCombo /
                          feature.properties.TotPopACS17,
                      },
                      {
                        label: 'asian',
                        value:
                          feature.properties.AsianAloneOrCombo /
                          feature.properties.TotPopACS17,
                      },
                      {
                        label: 'hispanic',
                        value:
                          feature.properties.Hispanic /
                          feature.properties.TotPopACS17,
                      },
                    ]}
                  />
                </div>
                <div className="card english_proficency">
                  <SimpleBarChart
                    title="English Proficency"
                    data={makeLEP(feature)}
                    norm={true}
                  />
                </div>
                <div className="card internet">
                  <SimpleBarChart
                    title="Internet Access"
                    data={makeInternetData(feature)}
                    norm={true}
                    style={{width: '500px'}}
                  />
                </div>
              </React.Fragment>
            )}
          </div>
        </React.Fragment>
      ) : (
        <div className="placeholder">
          <h2>Click tract for details</h2>
        </div>
      )}
    </div>
  );
}
