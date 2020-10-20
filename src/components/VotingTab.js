import React, { useEffect, useState } from "react";
import {ReactComponent as EarlyVotingIcon}  from '../icons/earlyvoting.svg'
import {ReactComponent as PollingSitesIcon}  from '../icons/electiondayvoting.svg'
import {ReactComponent as USPSIcon}  from '../icons/mailinvoting.svg'
import BoundarySelector from "./BoundarySelector";
import VotingAssetsSelector from "./VotingAssetSelector.js";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import CategoryLegend from "./CategoryLegend";


export default function VotingTab({ selected, onSelected, onSelectVotingMetric, boundaries,votingMetric, onSelectBoundary, selectedBoundary}) {
    const allowed = ['eds','state_assembly_districts','congress_districts', 'senate_districts']

    useEffect(()=>{
        if(selectedBoundary &&!allowed.includes(selectedBoundary)){
            onSelectBoundary('state_assembly_districts')
        }
    },[selectedBoundary])
    const votingBoundaries = Object.entries(boundaries).reduce((r,b)=> allowed.includes(b[0]) ? {...r, [b[0]]: b[1]} : r, {} )
    return (
        <div className="outreach-tab">
            <h3>Get Out the Vote (GOTV)</h3>
            <p className='outreach-step'>Voter information</p>

                        <Dropdown
                            options={[
                                // {
                                //     value: "participationScore",
                                //     label: "Participation Score"
                                // },
                                {
                                    value: "weightedScore",
                                    label: "Weighted Participation Score"
                                },
                                {
                                    value:'pc_registered_democrat', 
                                    label: "Percent of affiliated voters registered as Democrat"
                                },
                                {
                                    value:'pc_registered_republican', 
                                    label: "Percent of affiliated voters registered as Republican"
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

            {votingMetric === 'weightedScore' && 

                <CategoryLegend
                            categories={[
        {color:"#E6FAFA",
        name: "0 - 10"
        },
        {
        color: '#C1E5E6',
        name: "10 - 11"
        },
        {
        color: '#9DD0D4',
        name: "11 - 13"
        },{
        color: '#75BBC1',
        name: "13 - 15"
        },
        {
        color: '#4BA7AF',
        name: '15 - 17'
        },
        {
         color:   '#00939C', 
         name:   "17 - 35"
        }
                            ]}
                           /> 
            }
            {votingMetric === 'pc_registered_democrat' && 

                <CategoryLegend
                            categories={[
                            {color:"#EFF3FF",
                            name: "0 - 17%"
                            },
                            {
                            color: '#C6D8EF',
                            name: "17 - 33%"
                            },
                            {
                            color: '#9ECAE1',
                            name: "33 - 50%"
                            },{
                            color: '#6BAED6',
                            name: "50 - 67%"
                            },
                            {
                            color: '#3182BD',
                            name: '67 - 83%'
                            },
                            {
                            color:   '#08519C', 
                            name:   "83 - 100%"
                            }
                            ]}
                           /> 
            }
            {votingMetric === 'pc_registered_republican' && 

                <CategoryLegend
                            categories={[
                            {color:"#FFC300",
                            name: "0 - 8%"
                            },
                            {
                            color: '#F1920E',
                            name: "8 - 15%"
                            },
                            {
                            color: '#E3611C',
                            name: "15 - 23%"
                            },{
                            color: '#C70039',
                            name: "23 - 30%"
                            },
                            {
                            color: '#F1920E',
                            name: '30 - 45%'
                            },
                            {
                            color:   '#5A1846', 
                            name:   "83 - 100%"
                            }
                            ]}
                           /> 
            }
            <BoundarySelector
                key="voting-bounday-selector"
                selectedBoundary={selectedBoundary}
                onSelect={onSelectBoundary}
                boundaries={votingBoundaries}
                defaultValue={ {value: 'eds', label: 'Electoral Districts'}}
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


            <VotingAssetsSelector
                selected={selected}
                onSelected={onSelected}
            />

        </div>
    );
}
