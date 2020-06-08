import React, {useState, useEffect} from 'react'
import OutreactUserGuide from './OutreachUserGuide'

export function CCFDetails({selectedCCF}){
    const [selectedTab, setSelectedTab] = useState('UserGuide')

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

                        <a style={{color:'red', textDecoration:'none'}} href='https://hstcensus2020.formstack.com/forms/cff_grantee_business_outreach_tracker' target="_blank">
                            <h2 style={{boxSizing:'border-box', padding:'20px'}}>Click here to claim an asset for outreach!</h2></a>
                    
                </div>
            </div>
            <div className='selector-cards'>
                { (selectedTab  === 'UserGuide' &&
                    <OutreactUserGuide />
                )}

                { (selectedTab === 'CCF' && selectedCCF) && 
                <>
                    <div className='cards'>
                        <div className='card CCFCard'>
                            <h2>{selectedCCF.name} Outreach progress</h2>
                            <p>No Community Assets Cliamed</p>
                        </div>
                    </div>
                    <div className='cards'>
                        <div className='card'>
                            <h2>Asset Types</h2>
                            <p>No Community Assets Claimed</p>
                        </div> 
                    </div>
                    <div className='cards'>
                        <div className='card'>
                            <h2>Borough Outreached</h2>
                            <p>No Community Assets Cliamed</p>
                        </div>
                    </div>
                </>
                }
            </div>
        </>
    }
