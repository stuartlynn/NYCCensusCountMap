import React, {useEffect, useState} from 'react';

export default function useFacilities() {
  useEffect(() => {
    fetch('/facilities.geojson')
      .then(a => a.json())
      .then(a => console.log('facilities ', a));
  }, []);
}
