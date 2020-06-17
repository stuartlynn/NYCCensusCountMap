import { useState, useEffect } from "react";

export default function useOutreachTargets() {
    const [targets, setTargets] = useState([]);
    const targetTableList = [
        "autorepairshops_nyc_geocoded",
        "bank_owned_atmlocations_nyc_geocodio",     
        "bodegas_grocers_nyc",
        "chain_grocerystores_nyc_geocoded",
        "doe_schools_nyc",
        "dohmh_farmers_markets",
        "foodkitchens_nyc",
        "homelessshelters_nyc",
        "hospitalsandhealthclinics_nyc",
        "laundromats_nyc",
        "liquor_winestores_nyc_geocoded",
        "nyc_gas_station_locations_geoclient_enriched",
        "post_offices",
        "seniorservices_nyc_geocoded"
    ];

    useEffect(() => {
        Promise.all(
            targetTableList.map(t =>
                fetch(
                    `https://hesterst.carto.com/api/v2/sql?filename=post_office&q=select+*+from+public.${t}&format=geojson&bounds=&api_key=2QqDs_ZDTqDeIQ3xFFFixw`
                )
                    .then(r => r.json())
                    .then(a => ({
                        ...a,
                        features: a.features.map(f => ({
                            ...f,
                            properties: { ...f.properties, type: t },
                            id: f.properties.unique_id
                        }))
                    }))
            )
        ).then(all_features => {
            const reducedTargets = all_features.reduce((r,a,i)=> ({...r, [targetTableList[i]] : a}) , {});
            setTargets(reducedTargets);
        });
    }, []);
    return targets;
}
