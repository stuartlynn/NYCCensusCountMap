import {useState, useRef, useEffect, useCallback} from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export function useMap(mapDivRef, {lnglat, zoom, style, key}) {
  mapboxgl.accessToken = key;
  const map = useRef(null);
  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapDivRef.current, // container id
      style: style, // stylesheet location
      center: lnglat, // starting position [lng, lat]
      zoom: zoom, // starting zoom
    });
  }, [mapDivRef]);

  return map;
}
