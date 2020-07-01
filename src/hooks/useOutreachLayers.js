
import React, { useEffect } from "react";
import useOutreachTargets from "./useOutreachTargets";


const name_fields = {
    autorepairshops_nyc_geocoded: "facility_name",
    bank_owned_atmlocations_nyc_geocodio: "atm_name",
    bodegas_grocers_nyc: "business_name",
    chain_grocerystores_nyc_geocoded: "name",
    doe_schools_nyc: "facname",
    dohmh_farmers_markets:"market_name",
    foodkitchens_nyc: "facname",
    homelessshelters_nyc:"name",
    hospitalsandhealthclinics_nyc :"facility_n",
    liquor_winestores_nyc_geocoded:'premise_name',
    nyc_gas_station_locations_geoclient_enriched: "station_name",
    post_offices:"name",
    seniorservices_nyc_geocoded :"program_name",
    laundromats_nyc: 'business_name'
}

const type_map = {
    autorepairshops_nyc_geocoded: "repair_services",
    bank_owned_atmlocations_nyc_geocodio: "financial_institutions",
    bodegas_grocers_nyc: "food_and_supplies",
    chain_grocerystores_nyc_geocoded: "food_and_supplies",
    doe_schools_nyc: "education",
    dohmh_farmers_markets:"food_and_supplies",
    foodkitchens_nyc: "social_services",
    homelessshelters_nyc:"social_services",
    hospitalsandhealthclinics_nyc :"healthcare",
    liquor_winestores_nyc_geocoded:'food_and_supplies',
    nyc_gas_station_locations_geoclient_enriched: "misc",
    post_offices:"social_services",
    seniorservices_nyc_geocoded :"social_services",
    laundromats_nyc:'laundry'
}


const colors=[
        "76C04B",
        "8D1840",
        "A44098",
        "767FBE",
        "41674F",
        "FBA919",
        "34499E",
        "9D9A51",
        "ED2024",
        "FCC28E",
        "E2E419",
        "5F3092",
        "865F94",
        "5B8AAE",
        "DD4297",
        "B86328"
]

const unclaimedColor=  "484949"

const generateICON = (claimedBy,pending,type)=>{
    let iconType = 'unclaimed'
    if(claimedBy && pending){
        iconType = 'pending'
    }
    if( claimedBy && !pending){
        iconType ='done'
    }

    let color = unclaimedColor
    if(claimedBy){
        color = claimedBy
    }
    
    return `${iconType}_${type_map[type]}_${color}`
}

function generateOutreachData(targets,assignments,ccfs,type){
    const features = targets['features']
    const newFeatures = features.map((feature)=>{
        const assignment = assignments.find(assignment => parseInt(assignment['Business ID #']) === feature.id )
        
        if(assignment){
            const ccf = ccfs.find(c=>c.name === assignment['CCF Grantee'])
            const icon = generateICON(ccf.color,assignment.Status.includes('Outreach in progress'),type)
            return {
                ...feature,
                properties: {...feature.properties, icon : icon},
            }
        }
        else{
            return{
                ...feature,
                properties:{...feature.properties, icon: generateICON(null,false, type)}
            }
        }
    })
    return {
        features:newFeatures,
        type:'FeatureCollection'
    }
}

export default function useOutreachLayer(
    map, 
    outreachTragets, 
    visible, 
    selectedTypes, 
    onClick, 
    assignments, 
    ccfs) {
    const types = Object.keys(outreachTragets)

    useEffect(()=>{
        if(ccfs && assignments){
            console.log("UPDATING DATA")
            types.forEach(type=>{
              const source  = map.current.getSource(`outreach_source: ${type}`)
              if(source){
                source.setData(generateOutreachData(outreachTragets[type],assignments, ccfs, type))
              }
            })
            map.current.triggerRepaint()
        }
    },[map,outreachTragets,assignments, types,ccfs])

    useEffect(() => {
        if (map.current && outreachTragets && Object.keys(outreachTragets).length > 0 ) {
            map.current.on("load", () => {
                    types.forEach(type => {
                        console.log(`adding outreach layer outreach: ${type}`)
                        if(!map.current.getSource(`outreach_source: ${type}`)){
                            try{
                                const source = map.current.addSource(
                                    `outreach_source: ${type}`,
                                    {
                                        type: "geojson",
                                        data: generateOutreachData(outreachTragets[type],assignments, ccfs, type)
                                    }
                                )
                                map.current.addLayer({
                                    id: `outreach: ${type}`,
                                    type: "symbol",
                                    source: `outreach_source: ${type}`,
                                    layout: {
                                        "icon-image": ['get','icon'], // ["get", "icon"],
                                        "icon-size": 0.4,
                                        "text-field": ['get',name_fields[type]],
                                        "text-font": [
                                            "Open Sans Semibold",
                                            "Arial Unicode MS Bold"
                                        ],
                                        "text-offset": [0, 2],
                                        "text-size": 13,
                                        "text-anchor": "top",
                                        //'icon-allow-overlap': true,
                                        //              'text-allow-overlap': true,
                                        // visibility: selectedTypes.includes(type)
                                        //     ? "visible"
                                        //     : "none"
                                        visibility: visible ? 'visible' :'none'
                                    },
                                    //    filter: ['match', ['get', 'asset_type'], types, true, false],

                                    paint: {
                                        "text-color": "rgba(255,255,255,1)",
                                        "text-halo-color": "rgba(10, 10, 10, 0.8)",
                                        "text-halo-width": 1,
                                        "text-halo-blur": 0
                                    }
                                });
                                map.current.on('click',  `outreach: ${type}`, (e)=>{
                                    if(e.features.length >0){
                                        console.log("clicked feacture ", e.features[0])
                                        const coordinates = e.features[0].geometry.coordinates.slice();
                                        const data = e.features[0].properties
                                        onClick({coordinates,data})
                                    }
                                })
                            }
                            catch{
                                console.log("SOMETHING WENT WRONG SETTING UP LAYER")
                            }
                        }
                    });
            });
        }
    }, [map, outreachTragets]);



    useEffect(() => {

        const setVisibility = (layer, shouldBeVisable)=>{
                if (map.current && map.current.loaded() && map.current.getLayer(`outreach: ${layer}`)) {
                    map.current.setLayoutProperty(
                        `outreach: ${layer}`,
                        "visibility",
                        shouldBeVisable && selectedTypes.includes(layer) ? 'visible' : 'none' 
                    )
                }
                else{
                   console.log("waiting ", map.current, map.current.loaded(), map.current.getLayer(`outreach: ${layer}`))
                     setTimeout(()=>setVisibility(layer,shouldBeVisable),200)
                }
            }
            
        types.forEach(type => setVisibility(type,visible));
       
    }, [map, visible, selectedTypes,types]);

}
