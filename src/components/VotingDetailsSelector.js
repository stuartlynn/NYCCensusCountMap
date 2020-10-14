import React from "react";

//TODO - consolidate this in to one component with DetailsSelector
export default function VotingDetailsSelector({ selected, onSelect }) {
    const isSelected = name => (name === selected ? "selected" : "");
    return (
        <div className="details-selector">
            <ul>
                <li
                    onClick={() => onSelect("participation")}
                    className={isSelected("participation")}
                >
                    Voter Participation
                </li>
                <li
                    onClick={() => onSelect("registration")}
                    className={isSelected("registration")}
                >
                    Voter Registration 
                </li>
                <li
                    onClick={() => onSelect("locations")}
                    className={isSelected("locations")}
                >
                   Voting Locations 
                </li>
            </ul>
        </div>
    );
}
