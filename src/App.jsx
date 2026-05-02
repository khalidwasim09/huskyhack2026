import React from 'react';
import StoryEngine from './components/StoryEngine';
import './styles/index.css';
import './styles/scene.css';

export default function App() {
  return (
    <main id="app-root" aria-label="No Real Choice interactive story">
      <StoryEngine />
    </main>
  );
}
