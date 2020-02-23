import React from "react";

export default function HelpTab() {
    return (
        <div className="help-tab">
            <section>
                <h3>Info</h3>
                <h3>Context Layers</h3>
                <p>
                    The base context layers for the map are supplied by
                    OpenStreetMap>
                </p>
            </section>
            <section>
                <h3>Asset Layers</h3>
                <h4>Educational Assets </h4>

                <p>
                    These layers identify the location of educational
                    facilities. Children are a historically undercounted
                    community; it will be important to reach parents at Head
                    Start, Early Head Start, Universal Pre-K, K-12 (NYC Public
                    Schools), and Community Schools. Other assets include public
                    libraries, which can be hubs for engaging the wider
                    community. These layers do not include a comprehensive list
                    of charter, parochial, or private schools.
                </p>
                <p className="source">
                    Sources:{" "}
                    <a
                        target="_blank"
                        href="https://data.cityofnewyork.us/City-Government/Facilities-Database-Shapefile/2fpa-bnsx"
                    >
                        Department of City Planning. (2019). City Planning
                        Facilities Database.
                    </a>
                </p>

                <h4>Services and Programs</h4>

                <p>
                    These layers identify various locations where New Yorkers
                    access services, assistance or programs. The assets in this
                    list can help you engage a range of historically
                    undercounted communities, like low-income individuals,
                    people experiencing homelessness, people that live with
                    mental or physical disabilities, people who do not live in
                    traditional housing and LGBTQ individuals. These layers do
                    not include all services and programs serving these
                    populations. If we are missing any important services in
                    your community, please let us know by emailing{" "}
                    <a target="_blank" href="mainto:devin@hesterstreet.org">
                        devin@hesterstreet.org
                    </a>
                </p>
                <p className="sources">
                    Sources:{" "}
                    <a
                        target="_blank"
                        href="https://data.cityofnewyork.us/City-Government/Facilities-Database-Shapefile/2fpa-bnsx"
                    >
                        Department of City Planning. (2019). City Planning
                        Facilities Database
                    </a>
                    .
                    <a
                        target="_blank"
                        href="https://gaycenter.org/recovery-health/health/lgbthealth-network/#networkmembers"
                    >
                        The Lesbian, Gay, Bisexual and Transgender Community
                        Center. (2019). LGBTQ Health and Human Services Network
                        Members.
                    </a>
                    <a
                        target="_blank"
                        href="https://nycopendata.socrata.com/Health/Mental-Health-Service-Finder-Data/8nqg-ia7v
"
                    >
                        Office of the Mayor. (2018). NYC Mental Health Service
                        Finder Data.
                    </a>
                </p>

                <h4>Neighborhood Institutions</h4>
                <p>
                    These layers identify institutions where residents gather,
                    like faith-based organizations, community centers and
                    community-based organizations. These neighborhood
                    institutions can become your partners for Census efforts.
                    These layers do not include a comprehensive list of all
                    institutions serving your neighborhood populations. If we
                    are missing any important institutions in your community,
                    please let us know by emailing devin@hesterstreet.org
                </p>

                <p>
                    Sources:{" "}
                    <a
                        target="_blank"
                        href="https://data.cityofnewyork.us/City-Government/Facilities-Database-Shapefile/2fpa-bnsx"
                    >
                        Department of City Planning. (2019). City Planning
                        Facilities Database.{" "}
                    </a>
                    United Way of New York City, New York Immigration Coalition,
                    and Hester Street Partner databases in NYC.
                </p>
            </section>
            <section>
                <h3>Census 2020 Info Layers</h3>

                <h4>Mail Contact Strategy</h4>

                <p>
                    This dataset shows how US Census Bureau’s plan to contact
                    each household in the United States. Understanding your
                    target areas Mail Contact Strategy will help you spread the
                    word to your community about how they can self-respond to
                    the Census. In the case of New York City, the forms of
                    contact include four methods divided into two categories:
                    Internet First and Internet Choice.
                </p>

                <p>
                    Internet First (marked as purple on the map) are areas that
                    are more likely to respond first online. These households
                    will receive an invitation to complete the census online.
                    Areas marked in dark purple will be sent an invitation in
                    English, while areas marked in light purple will be sent an
                    invitation in both English and Spanish.
                </p>

                <p>
                    Internet Choice (marked as green on the map) are areas that
                    are less likely to respond online. These households will
                    receive a paper questionnaire, along with an invitation to
                    complete the census online or by phone. Areas marked in dark
                    green will be sent an invitation in English, while areas
                    marked in light green will be sent an invitation in both
                    English and Spanish.
                </p>
                <p className="sources">
                    Source: NYC Census 2020 Early NRFU Early NRFU stands for
                    “Early Non-Response Follow Up”. Non-Response Follow Up is a
                    contact method the Census Bureau uses to collect information
                    for those households who have not self-responded to the
                    Census. During the NRFU period, Census enumerators will
                    visit households and administer the questionnaire. “Early
                    NRFU” areas will receive enumerators on April 9th, so the
                    Census can capture college and university students who live
                    in off-campus housing before the end of the spring semester
                    when they may leave for another residence. Source: NYC
                    Census 2020 2010 Mail Return Rate The 2010 Mail return rate
                    is the percentage of households who self-responded to the
                    Census in 2010. Self-response is the more accurate way for
                    every New Yorker to be counted, so the return rate allows us
                    to identify areas that have been undercounted in the past
                    and are at risk of being undercounted again during the 2020
                    Census. We call this areas “historically undercounted
                    communities” or “Hard-to-Count areas”. The NYC Census 2020
                    Team plans to push the City’s Self-Response rate from 62% to
                    the national average of 76% or higher. Source:U.S. Census
                    Bureau. (2012). 2012 Planning Database.
                </p>
            </section>
            <section>
                <h3>Boundary Layers</h3>

                <p>
                    New York City has many geographic boundaries; all used by
                    different groups for different purposes. Depending on your
                    needs, using a specific boundary can help you better
                    understand your target population.
                </p>
                <p>
                    We want to note that the “NOCC Neighborhoods” boundary
                    slightly differs from actual boundaries for the
                    neighborhoods of NYC. This layer specifically pertains to
                    NOCC leaders for the NYC Census effort and their defined
                    neighborhood boundaries.
                </p>
                <p className="sources">
                    Sources: NYC Census 2020 NYC Open Data 2018 US Census Bureau
                    2018
                </p>
            </section>
            <section>
                <h3>Demographic Layers</h3>
                <p>
                    We included data on the demographics of individuals who are
                    considered undercounted populations. These layers can help
                    you better hone in on your target populations. For example,
                    comparing race to internet access can show where areas of
                    NYC have no internet in relation to which racial group lies
                    primarily in those areas).
                </p>

                <p>
                    For Internet Access: Limited Internet refers to those with
                    cellular data plans and Internet access without a
                    subscription. Internet subscription includes any kind of
                    broadband access, fiber optic, DSL and/or satellite
                    subscriptions. Internet Access is an extremely important
                    dataset because the US Census Bureau is not mailing
                    questionnaires to 80% of national households, and will be
                    requesting households to fill out the Census online or over
                    the phone. You can view where certain areas will and will
                    not receive paper questionnaires by turning on the Mail
                    Contact Strategies layers under Important Layers.
                </p>
                <p classNmae="sources">
                    Source: US Census Bureau, American Community Survey 5-Year
                    Data 2018
                </p>
            </section>
        </div>
    );
}
