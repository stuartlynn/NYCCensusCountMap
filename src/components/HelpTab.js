import React from 'react';

export default function HelpTab() {
  return (
    <div className="help-tab">
      <section>
        <h3>About</h3>
        <p>
          This interactive map was created by Hester Street, in partnership with
          Stuart Lynn.
        </p>
        <p>
          This work is possible thanks to the support of the NYC Census 2020 and
          CUNY Complete Count Fund.
        </p>

        <p>
          If you have any additional assets, services or neighborhood
          institutions to contribute to the map, please send to{' '}
          <a href="mailto:devin@hesterstreet.org">devin@hesterstreet.org</a>{' '}
          with the subject line “New interactive map asset”. Be sure to include
          the following information for each asset:
        </p>
        <ul style={{listStyleType: 'circle'}}>
          <li>Name </li>
          <li>Address</li>
          <li>Layer it should be added to</li>
        </ul>
      </section>
    </div>
  );
}
