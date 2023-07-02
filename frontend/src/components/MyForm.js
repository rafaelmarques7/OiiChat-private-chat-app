import React, { useState } from 'react';
import { socket } from '../lib/socket';

export function MyForm() {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    socket.timeout(10).emit('eventChatMessage', value, () => {
      setIsLoading(false);
      setValue('');
    });
  }

  return (
    <form onSubmit={ onSubmit }>
      <input onChange={ e => setValue(e.target.value) } value={value} />

      <button type="submit" disabled={ isLoading }>Submit</button>
    </form>
  );
}