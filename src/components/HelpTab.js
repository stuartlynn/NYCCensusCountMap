import React from "react";

export default function HelpTab() {
    return (
        <div className="help-tab">
            <section>
                <h3>ABOUT</h3>

                <p>
                    This interactive map was created by{" "}
                    <a href="https://hesterstreet.org/" target="_blank">
                        Hester Street
                    </a>{" "}
                    in partnership with{" "}
                    <a href="http://stuartlynn.me/">Stuart Lynn</a>. Hester
                    Street is an urban planning, design and development
                    nonprofit that works to ensure neighborhoods are shaped by
                    the people who live in them.
                </p>
                <p>
                    This work was made possible with the support of the NYC
                    Census 2020 and CUNY Complete Count Fund.
                </p>
                <p>
                    If you have additional assets, services or neighborhood
                    institutions to contribute to the map, please email{" "}
                    <a href="2020Census@hesterstreet.org">
                        2020Census@hesterstreet.org
                    </a>{" "}
                    with the subject line "New interactive map assets". Be sure
                    to include the following information for each asset
                </p>
                <ul className="dashed">
                    <li>Name </li>
                    <li>Address</li>
                    <li>Layer it should be added to</li>
                </ul>
                <img src="imgs/HS_Logo_Blk_RGB.png" />
            </section>
        </div>
    );
}
