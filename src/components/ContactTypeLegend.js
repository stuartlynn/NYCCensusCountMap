import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircle} from '@fortawesome/free-solid-svg-icons';

export default function ContactTypeLegend() {
  return (
    <section className="contact-type">
      <ul>
        <li className="category-entry">
          <FontAwesomeIcon icon={faCircle} style={{color: '#C2A5CF'}} />{' '}
          Internet First, English
        </li>
        <li className="category-entry">
          <FontAwesomeIcon icon={faCircle} style={{color: '#9970AB'}} />{' '}
          Internet First, Bilingual
        </li>
        <li className="category-entry">
          <FontAwesomeIcon icon={faCircle} style={{color: '#A6DBA0'}} />{' '}
          Internet Choice, English
        </li>
        <li className="category-entry">
          <FontAwesomeIcon icon={faCircle} style={{color: '#5AAE61'}} />{' '}
          Internet Choice, Bilingual
        </li>
      </ul>
    </section>
  );
}
