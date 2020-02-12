import React, {useEffect} from 'react';
import useFacilities from './useFacilities';

function loadAllImages(map) {
  const images = [
    'Dot_Hospitals.png',
    'Dot_FBO.png',
    'Dot_CommunitySchools.png',
    'Dot_LGBTQ.png',
    'Dot_FoodKitchens.png',
    'Dot_SeniorCenters.png',
    'Dot_UniPreK.png',
    'Dot_K12.png',
    'Dot_CommunityCenters.png',
    'Dot_MentalHealth.png',
    'Dot_CBO.png',
    'Dot_Libraries.png',
  ];
  return Promise.all(
    images.map(
      img =>
        new Promise((resolve, reject) => {
          map.loadImage(`${process.env.PUBLIC_URL}/imgs/${img}`, function(
            error,
            res,
          ) {
            map.addImage(img, res);
            resolve();
          });
        }),
    ),
  );
}

export default function useFacilitiesLayer(map, visible, layer, id, types) {
  const facilities = useFacilities();

  useEffect(() => {
    if (map.current && facilities) {
      map.current.on('load', () => {
        loadAllImages(map.current).then(() => {
          map.current.addLayer({
            id: 'facilities',
            type: 'symbol',
            source: {
              type: 'geojson',
              data: facilities,
            },
            layout: {
              'icon-image': ['get', 'icon'],
              'icon-size': 0.02,
              'text-field': ['get', 'name'],
              'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
              'text-offset': [0, 0.6],
              'text-size': 10,
              'text-anchor': 'top',
              //'icon-allow-overlap': true,
              //              'text-allow-overlap': true,
              visibility: visible ? 'visible' : 'none',
            },
            paint: {
              'text-color': 'rgba(255,255,255,1)',
            },
          });
        });
      });
    }
  }, [map, facilities]);

  useEffect(() => {
    if (map.current && map.current.loaded()) {
      console.log('Toggling visible on facilities');
      map.current.setLayoutProperty(
        `facilities`,
        'visibility',
        visible ? 'visible' : 'none',
      );
    }
  }, [map, visible]);

  return facilities;
}
