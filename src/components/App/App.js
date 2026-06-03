import React, { useEffect, useState } from 'react';
import './App.css'
import { AddThoughtForm } from '../AddThoughtForm/AddThoughtForm';
import { Thought } from '../Thought/Thought';
import { blockByOrb, getMoodStyle, getSeasonalMoodBlock } from '../../utilities/seasonalMoodSystem';

const moodChoices = [
   { id: 'auto', label: 'Auto' },
   { id: 'dawn', label: 'Dawn' },
   { id: 'neutral', label: 'Neutral' },
   { id: 'warm', label: 'Warm' },
   { id: 'night', label: 'Night' },
   { id: 'midnight', label: 'Midnight' },
];

const App = () => {
   const [thoughts, setThoughts] = useState([]);
   const [moodBlock, setMoodBlock] = useState(getSeasonalMoodBlock);
   const [moodOverride, setMoodOverride] = useState('auto');
   const [isInputFocused, setIsInputFocused] = useState(false);
   const [isShareDrawerOpen, setIsShareDrawerOpen] = useState(false);
   const [shareStatus, setShareStatus] = useState('');
   const activeThought = thoughts[0];
   const shareCaption = 'Centre Notes - a small thought, held briefly, then let go. #CentreNotes #ReflectionsInLight #SeasonalStudio';

   useEffect(() => {
      const interval = setInterval(() => {
         if (moodOverride === 'auto') {
            setMoodBlock(getSeasonalMoodBlock());
         }
      }, 60 * 1000);
      return () => clearInterval(interval);
   }, [moodOverride]);

   const addThought = thought => {
      setIsInputFocused(false);
      setThoughts([thought]);
   };

   const removeThought = thoughtIdToRemove => setThoughts(thoughts => thoughts.filter(thought => thought.id !== thoughtIdToRemove));
   const resetRoom = () => {
      setThoughts([]);
      setIsInputFocused(false);
      setShareStatus('Room reset.');
   };
   const copyShareCaption = async () => {
      try {
         await navigator.clipboard.writeText(shareCaption);
         setShareStatus('Caption copied.');
      } catch {
         setShareStatus('Caption ready to copy.');
      }
   };
   const updateMoodChoice = moodId => {
      setMoodOverride(moodId);
      setMoodBlock(moodId === 'auto' ? getSeasonalMoodBlock() : blockByOrb[moodId]);
   };

   return (
      <div className={`App ${moodBlock.className}${activeThought ? ' has-active-thought' : ''}${isInputFocused ? ' is-attending' : ''}`} style={getMoodStyle(moodBlock)}>
         <header>
            <h1>Centre Notes</h1>
            <p>Write a thought, hold it tightly, let it pass.</p>
            <div className="CompanionLinks" aria-label="Companion spaces">
               <a className="CompanionLink" href="https://soliv1.github.io/Daily-Reflections-App/" target="_blank" rel="noreferrer">Carry this into Daily Reflections</a>
               <a className="CompanionLink CompanionLinkSecondary" href="https://soliv1.github.io/Seasonal-mind-space/" target="_blank" rel="noreferrer">Explore Seasonal Mind Space</a>
            </div>
         </header>
         <main>
            <section className="orbStage" aria-live="polite">
               {activeThought ? (
                  <Thought key={activeThought.id} thought={activeThought} removeThought={removeThought} />
               ) : (
                  <div className={`ambientOrb${isInputFocused ? ' is-focused' : ''}`} aria-hidden="true" />
               )}
            </section>
            <AddThoughtForm addThought={addThought} onFocusChange={setIsInputFocused} />
            {!activeThought && (
               <section className="emptyState" aria-live="polite">
                  <p>A quiet room.</p>
                  <p>Ready when you are.</p>
               </section>
            )}
         </main>
         <footer className="AppFooter">
            <p>Centre Notes - © 2026 Reflections in Light: Part of the Reflections in Light Family</p>
            <button className="shareDrawerToggle" type="button" aria-expanded={isShareDrawerOpen} onClick={() => setIsShareDrawerOpen(isOpen => !isOpen)}>
               Social media family
            </button>
         </footer>
         <aside className={`ShareDrawer${isShareDrawerOpen ? ' is-open' : ''}`} inert={isShareDrawerOpen ? undefined : ''} aria-label="Social media family drawer">
            <div className="ShareDrawerHeader">
               <p>Share to social</p>
               <button type="button" onClick={() => setIsShareDrawerOpen(false)} aria-label="Close sharing drawer">&times;</button>
            </div>
            <p className="ShareDrawerFlow">Quick flow: copy caption, open or download image, then post to your chosen channel.</p>
            <section>
               <h2>Room colour</h2>
               <div className="MoodChoices" role="group" aria-label="Room colour">
                  {moodChoices.map(choice => (
                     <button key={choice.id} className={moodOverride === choice.id ? 'is-selected' : ''} type="button" onClick={() => updateMoodChoice(choice.id)}>
                        {choice.label}
                     </button>
                  ))}
               </div>
            </section>
            <div className="ShareDrawerActions">
               <a href="https://soliv1.github.io/Daily-Reflections-App/" target="_blank" rel="noreferrer">Carry this into today</a>
               <button type="button" onClick={copyShareCaption}>Share this reflection</button>
               <button type="button" onClick={resetRoom}>Reset room</button>
            </div>
            <section>
               <h2>Share Everywhere</h2>
               <nav aria-label="Share everywhere">
                  <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram</a>
                  <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">Facebook</a>
                  <a href="https://www.pinterest.com/" target="_blank" rel="noreferrer">Pinterest</a>
                  <a href="https://www.tumblr.com/" target="_blank" rel="noreferrer">Tumblr</a>
                  <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a>
               </nav>
            </section>
            <section>
               <h2>Media helpers</h2>
               <div className="ShareDrawerActions">
                  <button type="button" onClick={copyShareCaption}>Copy Caption + Hashtags</button>
                  <a href={moodBlock.image} target="_blank" rel="noreferrer">Open Image</a>
                  <a href={moodBlock.image} download>Download Image</a>
                  <details>
                     <summary>Preview Sample Post</summary>
                     <p>{shareCaption}</p>
                  </details>
               </div>
            </section>
            {shareStatus && <p className="ShareDrawerStatus" role="status">{shareStatus}</p>}
         </aside>
      </div>
   );
};

export default App;
