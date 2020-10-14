import React from 'react';

export default function VotingOrgCard({org}) {
  return (
    <div className="facility">
      <h3>{org.name}</h3>
      <p>
        {org.address} <br /> {org.boro} <br /> {org.city} <br />{' '}
        {org.zipcode}
      </p>
    </div>
  );
}
