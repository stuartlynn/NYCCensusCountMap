import React, {useState} from 'react';
import {RadialChart} from 'react-vis';
import FacilityCard from './FacilityCard';
import SimpleBarChart from './SimpleBarChart';
import PieCard from './PieCard';
import AssetCategoryCard from './AssetCategoryCard';

export default function Details({feature, facilities, onSelectFacility}) {
  console.log(feature);

  console.log(facilities);

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
      title: col,
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
      title: col,
    }));
    return data;
  };

  return (
    <div className="feature">
      {feature ? (
        <React.Fragment>
          <div className="overview">
            <h2>Census Tract: {feature.properties.GEOID}</h2>
            <h2>General Info</h2>
            <p>
              Population: <span>{feature.properties.TotPopACS17}</span>
            </p>
            <p>
              Mail return rate 2010: <span>{feature.properties.MRR2010}%</span>
            </p>
            <p>
              Inital Contact Strategy:
              <span>{contactStrategy(feature.properties)}</span>
            </p>
          </div>
          <div className="cards">
            <div className="card demographics">
              <PieCard
                title="Demographics"
                data={[
                  {
                    title: 'white',
                    value:
                      feature.properties.WhiteAloneOrCombo /
                      feature.properties.TotPopACS17,
                  },
                  {
                    title: 'black',
                    value:
                      feature.properties.BlackAloneOrCombo /
                      feature.properties.TotPopACS17,
                  },
                  {
                    title: 'asian',
                    value:
                      feature.properties.AsianAloneOrCombo /
                      feature.properties.TotPopACS17,
                  },
                  {
                    title: 'hispanic',
                    value:
                      feature.properties.Hispanic /
                      feature.properties.TotPopACS17,
                  },
                ]}
              />
            </div>
            <div className="card english_proficency">
              <PieCard
                title="English Proficency"
                data={makeLEP(feature)}
                norm={true}
              />
            </div>
            <div className="card internet">
              <PieCard
                title="Internet Access"
                data={makeInternetData(feature)}
                norm={true}
                style={{width: '500px'}}
              />
            </div>
            <AssetCategoryCard title={'Medical'} assets={facilities} />
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
