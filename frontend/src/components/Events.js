import React from 'react';

export function Events({ events }) {
  console.log('inside events: ', events);
  
  return (
    <ul>
    {
      events.map((event, index) =>
        <li key={ index }>{ event }</li>
      )
    }
    </ul>
  );
}