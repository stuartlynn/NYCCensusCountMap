import React from "react";
import SelectSearch from "react-select-search";
import "./selectSearch.css";
import { useCCFs } from "../hooks/useCCFs";

export default function CCFSearch({ selected, setSelected }) {
    /*const options = [
        { name: "Test1", value: "t1" },
        { name: "Test2", value: "t2" },
        { name: "Test3", value: "t3" },
        { name: "Test4", value: "t4" },
        { name: "Test5", value: "t5" }
];*/
    const options = useCCFs();

    return (
        <div className="cff-search">
            <SelectSearch
                options={options}
                name="CCF"
                placeholder="Select CCF"
                onSelect={setSelected}
                search
            />
        </div>
    );
}
