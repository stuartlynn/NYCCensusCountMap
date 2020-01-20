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

export function useCensusTractFacilities(censusTractID, facilities) {
  return useMemo(() => {
    return censusTractID
      ? facilities.features
          .filter(facility => facility.properties.GEOID == censusTractID)
          .map(f => f.properties)
      : [];
  }, [censusTractID, facilities]);
}
