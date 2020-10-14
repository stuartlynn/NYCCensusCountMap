import { useDebugValue } from "react";

export const voting_types= [
        {
            title: "Financial Institutions",
            options: [
                {
                    name:'ATM Locations', 
                    layer: "bank_owned_atmlocations_nyc_geocodio", 
                    remaps:{
                        name: 'atm_name',
                        address:['street_address','county','zip_code'],
                        borough:'county'
                    }}
            ]
        },

        {
            title: "Laundromats",
            options: [{
                name:"Laundromats", 
                layer:'laundromats_nyc',
                remaps:{
                        name: 'business_name',
                        address:['address_building','address_street_name','address_borough', 'address_zip'],
                        borough:'address_borough'
                    }
            }]
        },

        {
            title: "Food + Medical Supplies",
            options: [
               {
                   name:"Bodegas / Grocers", 
                   layer:'bodegas_grocers_nyc',
                   remaps:{
                        name: 'business_name',
                        address:['address_building','address_street_name','address_borough', 'address_zip'],
                        borough:'address_borough'
                    }
                },
               {
                   name:"Farmer's markets", 
                   layer:'dohmh_farmers_markets',
                   remaps:{
                        name: 'market_name',
                        address:['street_address','borough'],
                        borough:'borough'
                    }
                },
               {
                   name:"Liquor Stores's", 
                   layer:'liquor_winestores_nyc_geocoded',
                   remaps:{
                        name: 'premise_name',
                        address:['premise_address','county','premise_zip'],
                        borough:'county'
                    }
                }
            ]
        },

        {
            title: "Repair Services",
            options: [
                {
                    name: "Auto Repair Shops", 
                    layer:"autorepairshops_nyc_geocoded",
                    remaps:{
                        name: 'premise_name',
                        address:['facility_name_full','facility_city','facility_zip_code'],
                        borough:'facility_city'
                    }
                }
            ]
        },

        {
            title: "Social Services",
            options: [
                {
                    name:"Homeless Shelters and congregate care facilities", 
                    layer:'homelessshelters_nyc',
                    remaps:{
                        name: 'name',
                        address:['snippet'],
                        borough:null
                    }
                },
                {
                    name:"Senior Services", 
                    layer: 'seniorservices_nyc_geocoded',
                    remaps:{
                            name: 'program_name',
                            address:['program_address','program_borough','program_zipcode'],
                            borough:'program_borough'
                        }
                }
            ]
        },
        {
            title: "Education",
            options: [
                {
                    name:"DOE Schools (for free food from 7:30am to 1:30pm everyday)", 
                    layer:'hospitalsandhealthclinics_nyc',
                    remaps:{
                            name: 'facname',
                            address:[],
                            borough:null
                        }
                }
            ]
        },

        {
            title: "Healthcare",
            options: [
                {
                    name:"Hospitals", 
                    layer:'hospitalsandhealthclinics_nyc',
                    remaps:{
                            name: 'program_name',
                            address:['address','city','zipcode'],
                            borough:'city'
                        }
                }
            ]
        },

        {
            title: "Misc",
            options: [{
                name: "Gas Stations",
                layer:'nyc_gas_station_locations_geoclient_enriched',
                 remaps:{
                            name: 'station_name',
                            address:['normalized_address'],
                            borough:'county'
                        }
            },
                {
                name:"Post Offices", 
                layer:'post_offices',
                remaps:{
                    name: 'name',
                    address:['streetname','city','zip'],
                    borough:'city'
                }
            }
            ]
        }
    ];


export const remapProperties= (properties,layer)=>{
    const details = votingLayerToName(layer)
    if(details){
        const {remaps} = details 
        const newProps = {
            name:properties[remaps.name],
            borough: properties[remaps.borough],
            address: remaps.address.map(p=>properties[p]).join(', ')
        }
        return {...properties, ...newProps}
    }
    else{
        return properties
    }
    }
    
export const votingLayerToName = (layer)=>{

    const matchesTypes =  voting_types.map(ot=>{
        const option = ot.options.find(o=>o.layer === layer)
        if(option){
            return {...option, name: option.name, category: ot.title}
        }
    }).filter(a=>a)
    if (matchesTypes.length>0){
        return matchesTypes[0]
    }
    else{
        console.log("Failed to find layer ", layer)
        return null
    }
}