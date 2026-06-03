import React, { useState } from 'react';
import { generateId, getNewExpirationTime } from '../../utilities/utilities';
import './AddThoughtForm.css'


export const AddThoughtForm = props => {
  const [text, setText] = useState('');
  const handleTextChange = event => setText(event.target.value);
  const handleFocus = () => props.onFocusChange?.(true);
  const handleBlur = () => props.onFocusChange?.(false);

  const handleSubmit = event => {
      event.preventDefault();
      if (text.length > 0) {
          const thought = {
            id: generateId(),
            text: text,
            expiresAt: getNewExpirationTime(),
         };
         props.addThought(thought);
         props.onFocusChange?.(false);
         event.currentTarget.querySelector('input[type="text"]').blur();
         setText('');
      }
  };

  return (
      <form className='AddThoughtForm' onSubmit={handleSubmit}>
         <label htmlFor="thought-input">Micro-note Input</label>
         <input id="thought-input" type='text' aria-label="Write a small thought" placeholder="Write a small thought..." value={text} onChange={handleTextChange} onFocus={handleFocus} onBlur={handleBlur} />
         <input type='submit' value='Let go' />
      </form>
   );
};
