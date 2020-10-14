import React from 'react'

const steps = [
   
    {
        name:'Step 1: Select a Census Grantee',
        text:`Identify a Census grantee in the dropdown menu above. You may select your organization or another organization. The purpose is to visualize an organization’s outreach progress (color icons), alongside unclaimed businesses (black icons). Select your organization, if you want to conduct outreach and claim businesses.`}
     ,
     {
         name: 'Step 2: Review Voting Icons',
         text: `Review the three icons under “COVID-19 Community Assets.”  Black icons are businesses that have not been claimed by a grantee. Colored icons (with a small warning symbol) are businesses that have been claimed by a grantee, but outreach is pending. Color icons (with a solid white inner line) signify a grantee has distributed census marketing materials to the business.`
     },
     {
         name: "Step 3: Select Business Categories",
         text: "Review the categories of businesses. Select a box to the left of each category to turn the asset layer on. Icons will populate the map, showing a business location and its category. For this map, all business categories are essential business types in accordance with New York State PAUSE. Some businesses may be closed or operate with reduced hours. Please contact a location prior to your visit. We are working on providing contact information for all assets. We are working to provide contact information for all assets."
     },
     {
         name: 'Step 4: Review Map and Business Locations For Voting',
         text: "After selecting all relevant business categories, review the regions where you want to conduct or view outreach efforts. If you see a black icon, you may claim the business. If you want to know more about a claimed business, we suggest contacting the grantee that’s claimed the business to discuss your respective outreach effort and coordinate."
     },
     {
         name: "Step 5: Claim Business For Voting",
         text: "Hover your mouse over the business you wish to claim. A popup box will appear with a Business ID (a unique code for every business on the map). Copy the Business ID and click on the link to claim the business. After clicking the link, a new webpage will appear in your browser titled “NYC Census 2020 - Voting Mapping.” Follow the form’s instructions to claim the business or to share you have completed your outreach at the business. Once you complete the form the Voting Map will automatically update."
     }
]  

export default function VotingUserGuide(){
    return(
        <>
        <div className='cards' style={{paddingTop:'10px'}}>

            <div className='card' >
                <h2>Need Help?</h2>
                <p>
                    If you have questions on how to use this map or claim a business for outreach, contact <a href='mailto:2020Census@hesterstreet.org'>2020Census@hesterstreet.org.</a>
                </p>
            </div>

        {steps.map(step=>
                <div className='card'>
                <h2>{step.name}</h2>
                <p>{step.text}</p>
             </div>
                
        )}
        </div>
        </>
    )
}