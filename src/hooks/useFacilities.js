import React, {useEffect, useState, useMemo} from 'react';

export default function useFacilities() {
  const [facilities, setFacilities] = useState(null);
  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/facilities.geojson`)
      .then(a => a.json())
      .then(a => setFacilities(a));
  }, []);
  return facilities;
}

export function useFilteredFacilities(id, layer, types) {
  const facilities = useFacilities();
  const layerIDs = {
    cd: 'community_district_id',
    tracts: 'census_tract_id',
    cc: 'city_council_district_id',
    sd: 'school_district_id',
    nta: 'nta_id',
  };
  return useMemo(() => {
    return id
      ? facilities.features
          .filter(facility => facility.properties[layerIDs[layer]] == id)
          .filter(facility =>
            types && types.length > 0
              ? types.includes(facility.properties.asset_type)
              : true,
          )
          .map(f => f.properties)
      : [];
  }, [id, facilities, layer, types]);
}
