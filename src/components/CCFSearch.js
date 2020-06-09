import React from "react";
import SelectSearch from "react-select-search";
import "./selectSearch.css";
import { useCCFs } from "../hooks/useCCFs";

export default function CCFSearch({ selected, onSelected }) {
    // const options = [
    //     { name: "Test1", value: "t1" },
    //     { name: "Test2", value: "t2" },
    //     { name: "Test3", value: "t3" },
    //     { name: "Test4", value: "t4" },
    //     { name: "Test5", value: "t5" }
    // ];
    const options = useCCFs();

    return (
        <div className="cff-search">
            {options.length > 0  ?
            
       
            <SelectSearch
                options={options.sort((op)=>op.name).map(d=> ({name:d.name, value:d.name}))}
                name="CCF"
                placeholder="Select Grantee"
                onChange={(option)=>{
                    onSelected(options.find(o=>o.name===option))
                }}
                value={selected ? [selected.name] : []}
                search
            />
            :
            <h3>Loading</h3>
            }
        </div>
    );
}
