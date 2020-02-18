import React, {useState} from 'react';
import {RadialChart} from 'react-vis';
import FacilityCard from './FacilityCard';
import SimpleBarChart from './SimpleBarChart';
import PieCard from './PieCard';
import FactCard from './FactCard';
import AssetCategoryCard from './AssetCategoryCard';
import DetailsSelector from './DetailsSelector';
import {useFilteredFacilities} from '../hooks/useFacilities';

export default function Details({
  feature,
  onSelectFacility,
  layer,
  facilityTypes,
}) {
  const [showFacilities, setShowFacilities] = useState(false);

  const [selectedDetails, setSelectedDetails] = useState('demographics');
  const facilities = useFilteredFacilities(
    feature ? feature.properties.geoid : null,
    layer,
    facilityTypes,
  );

  const makeRenting = feature => {
    const properties = feature.properties;
    return [
      {name: 'Reting', value: properties.own_vs_rent_rent},
      {name: 'Owned', value: properties.own_vs_rent_owner},
    ];
  };

  const featureNames = {
    tracts: 'Census Tract',
    cd: 'Community District',
    sd: 'School District',
    cc: 'City Council District',
    nat: 'Neighborhood Tablulation Area',
    NOCCs: 'NOCC',
    senate_districts: 'Senate District',
    police_precints: 'Police Precinct',
    congress_districts: 'Congress Assembly District',
  };
  const featureName = featureNames[layer];

  const makeAgeData = feature => {
    const properties = feature.properties;
    const data = [
      {
        name: '5 years or younger',
        value: properties.age_less_5,
      },
      {
        name: '6 yrs - 15 yrs',
        value: properties.age_6_15,
      },
      {
        name: '16 yrs - 64 yrs',
        value: properties.age_16_64,
      },
      {
        name: '65 yrs or older',
        value: properties.age_64_over,
      },
    ];
    return data;
  };
  const makeForeignData = feature => {
    const properties = feature.properties;
    return [
      {name: 'Native Born', value: properties.foreign_born_native},
      {name: 'Foreign Born', value: properties.foreign_born_foreign},
    ];
  };
  const makeEnglishData = feature => {
    const properties = feature.properties;

    return [
      {name: 'English', value: properties.english_english},
      {name: 'Asian Languages', value: properties.english_asian},
      {name: 'Spanish', value: properties.english_spanish},
      {name: 'European Languages', value: properties.english_european},
      {name: 'Other', value: properties.english_other},
    ];
  };
  const makeInternetData = feature => {
    const properties = feature.properties;
    const data = [
      {name: 'No Internet', value: properties.internet_no_access},
      {
        name: 'Full Subscription',
        value: properties.internet_subscription,
      },
      {
        name: 'Limited Subscription',
        value: properties.internet_no_subscription,
      },
    ];
    console.log(properties);
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
  const makeDemographicData = feature => {
    return [
      {
        name: 'white',
        value: feature.properties.race_white / feature.properties.race_total,
      },
      {
        name: 'black',
        value: feature.properties.race_black / feature.properties.race_total,
      },
      {
        name: 'asian',
        value: feature.properties.race_asian / feature.properties.race_total,
      },
      {
        name: 'latinx',
        value: feature.properties.race_hispanic / feature.properties.race_total,
      },
      {
        name: 'other',
        value: feature.properties.race_other / feature.properties.race_total,
      },
    ];
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

  return feature ? (
    <React.Fragment>
      <div className="overview">
        <h2>
          {featureName}:{' '}
          {layer === 'tracts'
            ? feature.properties.GEOID
            : feature.properties.geoid}
        </h2>
        <p>
          Population:{' '}
          <span style={{color: 'red'}}>
            {Math.floor(feature.properties.total_population).toLocaleString()}
          </span>
        </p>
        {layer === 'tracts' ? (
          <>
            <p>
              Mail return rate 2010:{' '}
              <span style={{color: 'red'}}>{feature.properties.MRR2010}%</span>
            </p>
            <p>
              Inital Contact Strategy:
              <span style={{color: 'red'}}>
                {contactStrategy(feature.properties)}
              </span>
            </p>
          </>
        ) : (
          <>
            <p>
              Population in HTC areas:{' '}
              <span style={{color: 'red'}}>
                {Math.floor(
                  (feature.properties.htc_pop * 100.0) /
                    feature.properties.total_population,
                ).toLocaleString()}
                %
              </span>
            </p>
          </>
        )}
      </div>
      <div className="selector-cards">
        <DetailsSelector
          selected={selectedDetails}
          onSelect={detail => setSelectedDetails(detail)}
        />
        <div className="cards">
          {selectedDetails == 'barriers' && <></>}
          {selectedDetails === 'demographics' && (
            <>
              <div className="card demographics">
                <PieCard title="Race" data={makeDemographicData(feature)} />
              </div>
              <FactCard
                title={''}
                facts={[
                  {
                    name: 'identify as Latinx',
                    value:
                      Math.floor(
                        (feature.properties.race_hispanic * 100.0) /
                          feature.properties.race_total,
                      ).toLocaleString() + '%',
                  },
                  {
                    name: 'identify as Black',
                    value:
                      Math.floor(
                        (feature.properties.race_black * 100.0) /
                          feature.properties.race_total,
                      ).toLocaleString() + '%',
                  },
                ]}
              />
              <div className="card foreign">
                <PieCard title="Foreign Born" data={makeForeignData(feature)} />
              </div>
              <div className="card age">
                <PieCard title="Age" data={makeAgeData(feature)} norm={true} />
              </div>
              <FactCard
                title={''}
                facts={[
                  {
                    name: 'children under 5 years old',
                    value: Math.floor(
                      feature.properties.age_less_5,
                    ).toLocaleString(),
                  },
                ]}
              />
              <div className="card english_proficency">
                <PieCard
                  title="English Proficency"
                  data={makeEnglishData(feature)}
                  norm={true}
                />
              </div>
            </>
          )}
          {selectedDetails === 'housing' && (
            <>
              <div className="card internet">
                <PieCard
                  title="Internet Access"
                  data={makeInternetData(feature)}
                  norm={true}
                  style={{width: '500px'}}
                />
              </div>
              <FactCard
                facts={[
                  {
                    name: 'have no internet access',
                    value: Math.floor(
                      feature.properties.internet_no_access,
                    ).toLocaleString(),
                  },
                ]}
              />
              <div className="card housing">
                <PieCard title="Renting" data={makeRenting(feature)} />
              </div>
            </>
          )}
          {selectedDetails === 'assets' && (
            <>
              {facilityTypes && facilityTypes.length > 0 ? (
                facilityTypes.map(type => (
                  <AssetCategoryCard
                    title={type}
                    assets={facilities.filter(f => f.asset_type === type)}
                  />
                ))
              ) : (
                <h2>Turn on some Community Assets to view here</h2>
              )}
            </>
          )}
        </div>
      </div>
    </React.Fragment>
  ) : (
    <div className="placeholder">
      <h2>Click {featureName} for details</h2>
    </div>
  );
}
