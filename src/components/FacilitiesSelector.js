import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleDown } from "@fortawesome/free-solid-svg-icons";

function FacilitiesSection({ title, options, selected, onSelect }) {
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
                        <li className="facilities-option">
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

export default function FacilitiesSelector({ selected, onSelected }) {
    const sections = [
        {
            title: "Educational Assets",
            options: [
                "Head Start and Early Head Start",
                "Universal Pre-K",
                "K-12 (NYC Public Schools)",
                "Community Schools",
                "Public Libraries"
            ]
        },

        {
            title: "Services and Programs",
            options: [
                "Shelters",
                "Food Kitchens and Pantries",
                "Senior Centers",
                "Mental Health Services",
                "Hospitals and Rehab Centers",
                "LGBTQ Centers and Services",
                "NYCHA Developments"
            ]
        },

        {
            title: "Neighborhood Institutions",
            options: [
                "Community-Based Organizations",
                "Faith-Based Organizations",
                "Community Centers and YMCA's"
            ]
        }
    ];
    const [expanded, setExpanded] = useState({
        "Education Assets": false
    });
    return (
        <div className="facilities-selector">
            <h3>Community Assets</h3>
            {sections.map(section => (
                <FacilitiesSection
                    title={section.title}
                    options={section.options}
                    selected={selected}
                    onSelect={option => onSelected(option)}
                />
            ))}
        </div>
    );
}
