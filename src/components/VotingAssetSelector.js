import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {voting_types} from '../voting_asset_types'
import {ReactComponent as EarlyVotingIcon}  from '../icons/earlyvoting.svg'
import {ReactComponent as PollingSitesIcon}  from '../icons/electiondayvoting.svg'
import {ReactComponent as USPSIcon}  from '../icons/mailinvoting.svg'

function VotingAssetsSection({ title, options, selected, onSelect }) {
    const selectedInThisCategory = options.filter(o => selected.includes(o.layer));
    const allSelected = selectedInThisCategory.length === options.length;

    const onSelectAll = selectAll => {
        if (selectAll) {
            onSelect(options.filter(o => !selected.includes(o.layer)).map(o=>o.layer));
        } else {
            onSelect(options.filter(o => selected.includes(o.layer)).map(o=>o.layer));
        }
    };
    const iconForType = (option)=>{
        const style={width:'10px', height:'20px'}
       switch(option.icon){
           case "early_polling_sites":
               return <EarlyVotingIcon style={style}   />;
           case "polling_sites":
               return <PollingSitesIcon style={style} />;
           case 'usps_dropbox_locations':
                return <USPSIcon style={style} />
       } 
    }
    return (
        <section>
            <div className="facilities-section-header">
                <FontAwesomeIcon
                    icon={true}
                />{" "}
                <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={e => onSelectAll(e.target.checked)}
                />
                <h4 >
                    {title} ({selected.length}/{options.length})
                </h4>
            </div>
            {true && (
                <ul>
                    {options.map(option => (
                        <li key={option.label} style={{}}className="facilities-option">
                            <input
                                type="checkbox"
                                checked={selected.includes(option.layer)}
                                onChange={() => onSelect([option.layer])}
                            />
                            {iconForType(option)}
                            <span>{option.name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default function VotingAssetsSelector({ selected, onSelected }) {
    const votingOptions=[
        {name:"Early Polling Sites",
        icon: 'early_polling_sites',
        layer: 'Early Polling Location'
         },
        {name:"Polling Sites",
        icon: 'polling_sites',
        layer: 'Polling Location'
         },
        {name:"USPS Dropbox Locations",
        icon: 'usps_dropbox_locations',
        layer: 'USPS Dropbox'
         }
    ]

    return (
        <div className="facilities-selector">
                <VotingAssetsSection
                    key={''}
                    title={''}
                    options={votingOptions}
                    selected={selected}
                    onSelect={option => onSelected(option)}
                />
        </div>
    );
}
