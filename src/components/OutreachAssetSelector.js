import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleDown } from "@fortawesome/free-solid-svg-icons";

function OutreachAssetsSection({ title, options, selected, onSelect }) {
    const [expanded, setExpanded] = useState(false);
    const selectedInThisCategory = options.filter(o => selected.includes(o.layer));
    const allSelected = selectedInThisCategory.length === options.length;

    const onSelectAll = selectAll => {
        if (selectAll) {
            onSelect(options.filter(o => !selected.includes(o.layer)).map(o=>o.layer));
        } else {
            onSelect(options.filter(o => selected.includes(o.layer)).map(o=>o.layer));
        }
    };
    return (
        <section>
            <div className="facilities-section-header">
                <FontAwesomeIcon
                    onClick={() => setExpanded(!expanded)}
                    icon={expanded ? faAngleDown : faAngleRight}
                />{" "}
                <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={e => onSelectAll(e.target.checked)}
                />
                <h4 onClick={() => setExpanded(!expanded)}>
                    {title} ({selectedInThisCategory.length}/{options.length})
                </h4>
            </div>
            {expanded && (
                <ul>
                    {options.map(option => (
                        <li key={option.label} className="facilities-option">
                            <input
                                type="checkbox"
                                checked={selected.includes(option.layer)}
                                onChange={() => onSelect([option.layer])}
                            />
                            {option.name}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default function OutreachAssetsSelector({ selected, onSelected }) {
    // const sections = [
    //     {
    //         title: "Financial Institutions",
    //         options: [
    //             "Head Start and Early Head Start",
    //             "Universal Pre-K",
    //             "K-12 (NYC Public Schools)",
    //             "Community Schools",
    //             "Public Libraries"
    //         ]
    //     },

    //     {
    //         title: "Laundromats",
    //         options: ["Laundromats"]
    //     },

    //     {
    //         title: "Food + Medical Supplies",
    //         options: [
    //             "Grocery Stores with Senior-only Hours",
    //             "Bodegas / Grocers",
    //             "Farmer's markets",
    //             "Liquor Stores's"
    //         ]
    //     },

    //     {
    //         title: "Repair Services",
    //         options: ["Auto Repair Shops"]
    //     },

    //     {
    //         title: "Social Services",
    //         options: [
    //             "Child Care Services",
    //             "Homebase Locations",
    //             "Homeless Shelters and congregate care facilities",
    //             "Senior Services",
    //             "Auto Repair Shops"
    //         ]
    //     },
    //     {
    //         title: "Education",
    //         options: [
    //             "DOE Schools (for free food from 7:30am to 1:30pm everyday)"
    //         ]
    //     },

    //     {
    //         title: "Healthcare",
    //         options: ["Hospitals", "Pharmacies"]
    //     },

    //     {
    //         title: "Misc",
    //         options: ["Gas Stations", "Post Offices"]
    //     }
    // ];

    const sections = [
        {
            title: "Financial Institutions",
            options: [
                {name:'ATM Locations', layer: "bank_owned_atmlocations_nyc_geocodio"}
            ]
        },

        {
            title: "Laundromats",
            options: [{name:"Laundromats", layer:'laundromats_nyc'}]
        },

        {
            title: "Food + Medical Supplies",
            options: [
               {name:"Bodegas / Grocers", layer:'bodegas_grocers_nyc'},
               {name:"Farmer's markets", layer:'dohmh_farmers_markets'},
               {name:"Liquor Stores's", layer:'liquor_winestores_nyc_geocoded'}
            ]
        },

        {
            title: "Repair Services",
            options: [
                {name: "Auto Repair Shops", layer:"autorepairshops_nyc_geocoded"}
            ]
        },

        {
            title: "Social Services",
            options: [
                {name:"Homeless Shelters and congregate care facilities", layer:'homelessshelters_nyc'},
                {name:"Senior Services", layer: 'seniorservices_nyc_geocoded'}
            ]
        },
        {
            title: "Education",
            options: [
                {name:"DOE Schools (for free food from 7:30am to 1:30pm everyday)", layer:'doe_schools_nyc'}
            ]
        },

        {
            title: "Healthcare",
            options: [
                {name:"Hospitals", layer:'hospitalsandhealthclinics_nyc' }
            ]
        },

        {
            title: "Misc",
            options: [{
                name: "Gas Stations",
                layer:'nyc_gas_station_locations_geoclient_enriched'
            },
                {name:"Post Offices", layer:'post_offices'}
            ]
        }
    ];
    return (
        <div className="facilities-selector">
            {sections.map(section => (
                <OutreachAssetsSection
                    key={section.title}
                    title={section.title}
                    options={section.options}
                    selected={selected}
                    onSelect={option => onSelected(option)}
                />
            ))}
        </div>
    );
}
