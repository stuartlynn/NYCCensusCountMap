import { useState, useRef, useEffect, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/lib/mapbox-gl-geocoder.css";
import style from "../map_style";

export function useMap(mapDivRef, { lnglat, zoom, key }, popupFeature) {
    const [mapLoaded, setMapLoaded] = useState(false);
    mapboxgl.accessToken = key;
    const map = useRef(null);
    const popup =  useRef(null)
    const spriteURL =  `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL+"/" : window.location.href}outreach_icons/sp`
    useEffect(() => {
        map.current = new mapboxgl.Map({
            container: mapDivRef.current, // container id
            style: {...style, sprite:spriteURL}, // stylesheet location
            center: lnglat, // starting position [lng, lat]
            zoom: zoom, // starting zoom,
            preserveDrawingBuffer: true,
            // sprite:"/outreach_icons/sp"

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


    useEffect(()=>{
        if(popupFeature){
            console.log('popup feature ', popupFeature)
            popup.current= new mapboxgl.Popup({ offset: 25 })
            .setLngLat(popupFeature.coordinates)
            .setHTML(`
                <h3 style="margin-bottom:10px">If you have or plan to do outreach to this business, click <a target="_blank" href="https://hstcensus2020.formstack.com/forms/cff_grantee_business_outreach_tracker">here!</a></h3>
                <h2>Buisness ID: ${popupFeature.data.unique_id}</h2>
             `)
            .addTo(map.current);
        }
        else{
            if(popup.current){
                popup.current.remove()
                popup.current=null
            }
        }
    },[popupFeature])

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
