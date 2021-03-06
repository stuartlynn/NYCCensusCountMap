import React from "react";

export default function DetailsSelector({ selected, onSelect }) {
    const isSelected = name => (name === selected ? "selected" : "");
    return (
        <div className="details-selector">
            <ul>
                <li
                    onClick={() => onSelect("census2020")}
                    className={isSelected("census2020")}
                >
                    Census 2020 Live Count
                </li>
                <li
                    onClick={() => onSelect("demographics")}
                    className={isSelected("demographics")}
                >
                    Demographics
                </li>
                <li
                    onClick={() => onSelect("languages")}
                    className={isSelected("languages")}
                >
                    Languages
                </li>
                <li
                    onClick={() => onSelect("housing")}
                    className={isSelected("housing")}
                >
                    Housing and Economics
                </li>
                <li
                    onClick={() => onSelect("assets")}
                    className={isSelected("assets")}
                >
                    Assets
                </li>
            </ul>
        </div>
    );
}
