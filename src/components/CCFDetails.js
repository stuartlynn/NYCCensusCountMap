import React from 'react'


export function CCFDetails({selectedCCF}){
    console.log("SELECTED CCF IS ", selectedCCF)
    if(selectedCCF){
        return <>
            <div className="overview">
                <div className ='boundary-type-selector'>
                    <div className="boundary-type-selector-type ">
                        <h2 style={{boxSizing:'border-box', padding:'20px'}}>{selectedCCF.name}</h2>
                    </div>
                </div>
            </div>
            <div className='selector-cards'>
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
            </div>
        </>
    }
    else{
       return( 
       <div className="placeholder"> 
            <h2>Select a CCF to see details</h2>
        </div>
       )
    }
}