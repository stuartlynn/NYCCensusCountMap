import React, {useState, useEffect} from 'react'
import ProgressBar from '../components/ProgressBar'
import PieCard from '../components/PieCard'
import VotingDetailsSelector from '../components/VotingDetailsSelector'
import {votingLayerToName} from '../voting_asset_types'
import VotingOrgCard from './VotingOrgCard'

import VotingUserGuide from '../components/VotingUserGuide'
import FactCard from './FactCard'

export function CCFDetails({selectedCCF, assignments, votingTargets}){
    const [selectedTab, setSelectedTab] = useState('UserGuide')
    const [selectedDetail,setSelectedDetails] = useState('progress')

    
    const filteredAssignments = (selectedCCF && assignments) ? assignments.filter(a=>a['CCF Grantee'] === selectedCCF.name) : []
    const buisnessIDList = filteredAssignments.map(a=>parseInt(a['Business ID #']))

    let filteredAugmentedAssignments = []
    if(votingTargets){
        Object.entries(votingTargets).forEach(pair=>{
            const entries = pair[1].features
            const entryType = pair[0]

            let found = entries.filter(e=>buisnessIDList.includes(e.properties['unique_id'])).map(f=>f.properties)
            if (found.length > 0){
               filteredAugmentedAssignments = [...filteredAugmentedAssignments, ...found.map(
                   f=>(
                       {...f, type:entryType, status: filteredAssignments.find(a=>parseInt(a['Business ID #']) ===f.unique_id).Status}))]
            }
        })
    }

    const fracCompleated = filteredAugmentedAssignments.filter(fa=>fa.status==='Claimed Asset: Voting completed').length / filteredAssignments.length
    const categoryBreakdown = filteredAugmentedAssignments.map(fa=>votingLayerToName(fa.type)).reduce((counts,cat)=> ({...counts, [cat.name]: counts[cat.name] ? counts[cat.name]+1 : 1}), {} )
    const categoryCounts = Object.entries(categoryBreakdown).map((a)=> ({name:a[0], value:a[1]}))

    useEffect(()=>{
        if(selectedCCF){
            setSelectedTab('CCF')
        }
    },[selectedCCF])
        return <>
            <div className="overview">
                <div className ='boundary-type-selector'>
                    <div className={`boundary-type-selector-type ${selectedTab === 'UserGuide' && 'selected'}`}
                        onClick ={()=>setSelectedTab('UserGuide')}
                    >
                        <h2 style={{boxSizing:'border-box', padding:'20px'}}>User Guide</h2>
                    </div>
                    {selectedCCF ?
                        <div className={`boundary-type-selector-type ${selectedTab === 'CCF' && 'selected'}`}
                             onClick = {()=>setSelectedTab('CCF')}
                        >
                            <h2 style={{boxSizing:'border-box', padding:'20px'}}>{selectedCCF.name}</h2>
                        </div>
                        :
                        <div className={`boundary-type-selector-type`}>
                            <h2 style={{boxSizing:'border-box', padding:'20px'}}>Select a Census Grantee</h2>
                        </div>
                    }

                        <a style={{color:'red', textDecoration:'none'}} href='https://hstcensus2020.formstack.com/forms/cff_grantee_business_voting_tracker' target="_blank">
                            <h2 style={{boxSizing:'border-box', padding:'20px'}}>Click here to claim an asset for voting!</h2></a>
                    
                </div>
            </div>
            <div className='selector-cards'>
                
                { (selectedTab  === 'UserGuide' &&
                    <VotingUserGuide />
                )}

                { (selectedTab === 'CCF' && selectedCCF) && 
                <>
                    <VotingDetailsSelector
                        selected={selectedDetail}
                        onSelect={detail=>setSelectedDetails(detail)}
                    />
                    { selectedDetail==='progress' &&
                    <>
                        <div className='cards'>
                            <div className='card CCFCard' style={{justifyContent:'space-between'}}>
                                <h2>{selectedCCF.name} Voting progress</h2>
                                {filteredAugmentedAssignments && filteredAugmentedAssignments.length>0 ? 
                                <>
                                    <ProgressBar pc={fracCompleated*100}></ProgressBar>
                                    <FactCard  facts={[
                                            {
                                                name:
                                                    "Orgs claimed",
                                                value: filteredAugmentedAssignments.length
                                            },
                                            {
                                                 name:
                                                    "% compleated",
                                                value: Math.floor(fracCompleated*100)

                                            }]}/>
                                </>
                                :
                                <p>No Community Assets Cliamed</p>
                                }        
                            </div>
                        </div>
                        <div className='cards'>
                            <div className='card'>
                                <h2>Asset Types</h2>
                                {filteredAugmentedAssignments && filteredAugmentedAssignments.length>0 ?
                                <PieCard 
                                    data={
                                        categoryCounts
                                    }
                                    title={"Buisness Categories Claimed"}
                                    norm={true}
                                />
                                :
                                <p>No Community Assets Cliamed</p>  
                                }
                            </div> 
                        </div>
                        <div className='cards'>
                            <div className='card'>
                                <h2>Borough Votinged</h2>
                                <p>No Community Assets Cliamed</p>
                            </div>
                        </div>
                    </>}
                    {selectedDetail ==='businessList' &&
                        <div className='cards'>
                            {Object.keys(categoryBreakdown).map(category=>(
                                <div className='card'>
                                    <h2>{category}</h2>
                                     {filteredAugmentedAssignments.map(org=>
                                        <VotingOrgCard org={org} />
                                     )}
                                </div>
                            ))}
                        </div>
                    }
                </>
                }
            </div>
        </>
    }
