import React, { useEffect, useState } from 'react';
import './Thought.css';

export function Thought(props) {
  const { thought, removeThought } = props;
  const [phase, setPhase] = useState('holding');

  const handleRemoveClick = () => {
    removeThought(thought.id);
  };

  useEffect(
      f => {
         const timeRemaining = thought.expiresAt - Date.now();
         const dissolveDelay = Math.max(timeRemaining - 7000, 0);
         const lettingGoDelay = Math.max(timeRemaining - 4500, 0);
         const dissolveTimeout = setTimeout(f => setPhase('dissolving'), dissolveDelay);
         const lettingGoTimeout = setTimeout(f => setPhase('letting-go'), lettingGoDelay);
         const removeTimeout = setTimeout(f => handleRemoveClick(), timeRemaining);
         return f => {
            clearTimeout(dissolveTimeout);
            clearTimeout(lettingGoTimeout);
            clearTimeout(removeTimeout);
         };
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [thought]
   );

   return (
      <div className={`Thought is-${phase}`}>
         <button aria-label='Remove thought' className='remove-button' onClick={handleRemoveClick}>
            &times;
         </button>
         <div className='thought-ripples' aria-hidden="true">
            <span />
            <span />
            <span />
         </div>
         <div className='thought-pebble'>
            <div className='text'>{thought.text}</div>
         </div>
         {phase === 'letting-go' && <div className='passing-message'>Letting go...</div>}
      </div>
   );
};
