import { useState, useRef, useEffect, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/lib/mapbox-gl-geocoder.css";
import style from "../map_style";

export function useMap(mapDivRef, { lnglat, zoom, key }) {
    const [mapLoaded, setMapLoaded] = useState(false);
    mapboxgl.accessToken = key;
    const map = useRef(null);
    useEffect(() => {
        map.current = new mapboxgl.Map({
            container: mapDivRef.current, // container id
            style: style, // stylesheet location
            center: lnglat, // starting position [lng, lat]
            zoom: zoom, // starting zoom,
            preserveDrawingBuffer: true
        });
        map.current.addControl(
            new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl
            })
        );
        map.current.addControl(new mapboxgl.ScaleControl(), "top-right");
        map.current.addControl(new mapboxgl.NavigationControl());
        window.map = map;
    }, [mapDivRef]);

    const zoomToBounds = bounds => {
        if (map.current) {
            map.current.fitBounds([
                [32.958984, -5.353521],
                [43.50585, 5.615985]
            ]);
        }
    };

    return { map, zoomToBounds };
}
