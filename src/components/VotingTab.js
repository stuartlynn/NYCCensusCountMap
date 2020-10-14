import React, { useState } from "react";
import {ReactComponent as EarlyVotingIcon}  from '../icons/earlyvoting.svg'
import {ReactComponent as PollingSitesIcon}  from '../icons/electiondayvoting.svg'
import {ReactComponent as USPSIcon}  from '../icons/mailinvoting.svg'
import VotingAssetsSelector from "./VotingAssetSelector.js";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";


export default function VotingTab({ selected, onSelected, onSelectVotingMetric, votingMetric }) {
    return (
        <div className="outreach-tab">
            <h3>Get Out the Vote (GOTV)</h3>
            <p className='outreach-step'>Voter information</p>

                        <Dropdown
                            options={[
                                {
                                    value: "participationScore",
                                    label: "Participation Score"
                                },
                                {
                                    value: "weightedScore",
                                    label: "Weighted Participation Score"
                                },
                                {
                                    value: "percent_registered",
                                    label: "Percent Regiestered"
                                },
                            ]}
                            onChange={a => onSelectVotingMetric(a.value)}
                            value={votingMetric}
                            placeholder="Select a metric"
                        />

            <h3 className='outreach-step'>Ways to vote</h3>
            <p style={{textAlign:'left'}}>Click any of the icons to learn more</p>
            <div className='key'>
                <div className='icon'>
                    <EarlyVotingIcon style={{width:'47px', height:'63px'}}/>
                    <p>VOTE <span style={{color:'red', fontWeight:700}}>EARLY</span> <br /> (in person)</p>
                </div>
                <div className='icon'>
                    <PollingSitesIcon style={{width:'47px', height:'63px'}}/>
                    <p>VOTE ON <span style={{color:'#1c29d3', fontWeight:700}}>ELECTION DAY</span> <br />(in person)</p>
                </div>

                <div className='icon'>
                    <USPSIcon style={{width:'47px', height:'63px'}}/>
                    <p>VOTE BY <span style={{fontWeight:700}}>MAIL</span></p>
                </div>
            </div>

            <p className='outreach-step'><span>Step 3</span>: Select Buisness Categories</p>

            <VotingAssetsSelector
                selected={selected}
                onSelected={onSelected}
            />

        </div>
    );
}
