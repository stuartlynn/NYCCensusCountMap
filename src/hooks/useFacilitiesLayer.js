import React, {useEffect} from 'react';
import useFacilities from './useFacilities';

export default function useFacilitiesLayer(map) {
  const facilities = useFacilities();

  useEffect(() => {
    console.log('Map ', map, ' Facilities ', facilities);
    if (map.current && facilities) {
      map.current.on('load', () => {
        map.current.addLayer({
          id: 'facilites',
          type: 'symbol',
          source: {
            type: 'geojson',
            data: facilities,
          },
          layout: {
            'icon-image': 'harbor_icon',
            'text-field': ['get', 'facname'],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-offset': [0, 0.6],
            'text-anchor': 'top',
          },
        });
      });
    }
  }, [map, facilities]);
  return facilities;
}
