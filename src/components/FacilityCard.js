import React from 'react';

export default function FacilityCard({facility}) {
  console.log('facilty', facility);
  return (
    <div className="card facility">
      <h3>{facility.facname}</h3>
      <p>
        {facility.address} <br /> {facility.boro} <br /> {facility.city} <br />{' '}
        {facility.zipcode}
      </p>
      <p>{facility.factype} </p>
      <p>Capacity: {facility.capacity ? facility.capacity : 'Unknown'}</p>
    </div>
  );
}
