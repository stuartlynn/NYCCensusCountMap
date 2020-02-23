import React from "react";

export default function FactCard({ title, facts }) {
    return (
        <div className="fact">
            {facts.map(fact => (
                <p className="fact-name">
                    <span className="fact-value">{fact.value}</span>{" "}
                    <span className="fact-text">{fact.name}</span>
                </p>
            ))}
        </div>
    );
}
