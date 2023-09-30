
import React, { useState } from 'react';
import { render } from 'react-dom';
import SpeechSynthesisExample from './useSpeechSynthesis';
import SpeechRecognitionExample from './useSpeechRecognition';
import { useSpeechRecognition } from 'react-speech-kit';
import { useSpeechSynthesis } from 'react-speech-kit';

import { GlobalStyles, Row, GitLink, Title } from './shared';
import gh from './images/github.png';


function App() {
  const [value, setValue] = useState('');
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      setValue(result);
    },
  });

  return (
<div>
    <GlobalStyles />
    <Title>
      {'IEDGE '}
      <span role="img" aria-label="microphone">
        🎤
      </span>
    </Title>
    <Row>
      <SpeechSynthesisExample />
      <SpeechRecognitionExample />
    </Row>

  </div>
  );
}

export default App;
