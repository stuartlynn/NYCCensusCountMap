import React from "react";

export default function LanguageCard({ data }) {
    const sorted_data = data
        .sort((a, b) => (a.value < b.value ? 1 : -1))
        .slice(0, 5);

    /* const renames = {
        speak_only_english: "English",
        spanish: "Spanish",
        "french,_haitian,_or_cajun": "French Haitian or Cajun",
        german_or_other_west_germanic_languages: "German or Germanic Language",
        "russian,_polish,_or_other_slavic_languages":
            "Russian, Polish or other Slavic",
        "other_indo-european_languages": "Other Indo-European",
        korean: "Korean",
        "chinese_(incl._mandarin,_cantonese)": "Chinese (Madarin / Cantonese)",
        vietnamese: "Vietnamese",
        "tagalog_(incl._filipino)": "Tagalog (including Filipino)",
        other_asian_and_pacific_island_languages:
            "Other Asian and Pacific Island"
};*/
    return (
        <div className="language-card card">
            <h2>Top Household Languages</h2>

            <ul>
                {sorted_data.map(({ title, value }) => (
                    <li className="language-entry">
                        <span>{title}</span>
                        <span>{Math.floor(value)}%</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
