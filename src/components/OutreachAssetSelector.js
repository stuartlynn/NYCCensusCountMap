import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleDown } from "@fortawesome/free-solid-svg-icons";

function OutreachAssetsSection({ title, options, selected, onSelect }) {
    const [expanded, setExpanded] = useState(false);
    const selectedInThisCategory = options.filter(o => selected.includes(o));
    const allSelected = selectedInThisCategory.length === options.length;

    const onSelectAll = selectAll => {
        if (selectAll) {
            onSelect(options.filter(o => !selected.includes(o)));
        } else {
            onSelect(options.filter(o => selected.includes(o)));
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
                        <li key={option} className="facilities-option">
                            <input
                                type="checkbox"
                                checked={selected.includes(option)}
                                onChange={() => onSelect([option])}
                            />
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default function OutreachAssetsSelector({ selected, onSelected }) {
    const sections = [
        {
            title: "Financial Institutions",
            options: [
                "Head Start and Early Head Start",
                "Universal Pre-K",
                "K-12 (NYC Public Schools)",
                "Community Schools",
                "Public Libraries"
            ]
        },

        {
            title: "Laundromats",
            options: ["Laundromats"]
        },

        {
            title: "Food + Medical Supplies",
            options: [
                "Grocery Stores with Senior-only Hours",
                "Bodegas / Grocers",
                "Farmer's markets",
                "Liquor Stores's"
            ]
        },

        {
            title: "Repair Services",
            options: ["Auto Repair Shops"]
        },

        {
            title: "Social Services",
            options: [
                "Child Care Services",
                "Homebase Locations",
                "Homeless Shelters and congregate care facilities",
                "Senior Services",
                "Auto Repair Shops"
            ]
        },
        {
            title: "Education",
            options: [
                "DOE Schools (for free food from 7:30am to 1:30pm everyday)"
            ]
        },

        {
            title: "Healthcare",
            options: ["Hospitals", "Pharmacies"]
        },

        {
            title: "Misc",
            options: ["Gas Stations", "Post Offices"]
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
