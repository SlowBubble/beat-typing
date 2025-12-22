/*
Basic rule:
- Render the song in a canvas
  - The name on top left
  - Followed by each row of the keys (stripping out the "-")
- Highlight the first key
- When the user press the correct key on the keyboard (matching the highlighted key), move to the next key to highlight.
- When the user complete a song, display a row of confetti emojis, and wait 2 seconds and move on to the next song and repeat the steps above
- After reaching the end of the song list, render "Game Over".
More rules:
- Make sure if the key is pressed down, multiple keydown events will only trigger once
Changes:
- If the correct key is pressed, call simpleKeyboard.turnOn();
- If the incorrect key is pressed, utter `Press ${correctKey}` and call simpleKeyboard.turnOff();
*/
let doReMiMode = true;
let songIdx = 0;
let challengeMode = false;
let noteSpeedRatio = 1.0;

function getConfigFromHash() {
  const hash = window.location.hash.replace(/^#/, '');
  const params = {};
  hash.split('&').forEach(pair => {
    const [k, v] = pair.split('=');
    if (k) params[k] = v;
  });
  return params;
}

function setConfigToHash() {
  const params = [];
  if (doReMiMode) params.push('doReMi=1');
  if (challengeMode) params.push('challenge=1');
  if (songIdx > 0) params.push('songIdx=' + songIdx);
  if (noteSpeedRatio !== 1.0) params.push('noteSpeedRatio=' + noteSpeedRatio.toFixed(2));
  window.location.hash = params.join('&');
}

function runGame() {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1600;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let keyIdx = 0;
  let flatChords = [];
  let gameOver = false;
  let showConfetti = false;
  let sectionIdx = 0;
  let waitingForSpace = true;
  let isReplaying = false;
  let replayFinished = false;

  // Get drumMap for beat typing - different drum sounds for each number
  const chordMap = {
    '1': [81], // Open Triangle
    '2': [42], // Closed Hi Hat
    '3': [36], // Bass Drum 1
    '4': [37], // Side Stick
    '5': [54], // Tambourine
    '6': [44], // Pedal Hi-Hat
    '7': [41], // Low Floor Tom
    '8': [38], // Acoustic Snare
    '9': [56], // Cowbell
    '0': [46], // Open Hi-Hat
  };

  function flattenChords(song, sectionIdx) {
    // Returns array of {row, col, chord} for the current section
    const arr = [];
    if (!song.chords || !song.chords[sectionIdx]) return arr;
    const section = song.chords[sectionIdx];
    if (typeof section === 'string') {
      // Handle flat chord array format
      section.split(' ').forEach((k, cIdx) => {
        if (k !== '_') arr.push({ row: 0, col: cIdx, chord: k });
      });
    } else {
      // Handle 2D array format
      section.forEach((row, rIdx) => {
        row.split(' ').forEach((k, cIdx) => {
          if (k !== '_') arr.push({ row: rIdx, col: cIdx, chord: k });
        });
      });
    }
    return arr;
  }

  function renderPressSpace() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '48px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Press space', 40, 80);
    // Show upcoming song name
    ctx.font = '36px Arial';
    ctx.fillStyle = 'gray';
    ctx.fillText(songs[songIdx].name, 40, 140);
  }

  async function startSong() {
    waitingForSpace = false;
    keyIdx = 0;
    flatChords = flattenChords(songs[songIdx], sectionIdx);
    replayFinished = false;
    renderPressSpace();
    const utter1 = new window.SpeechSynthesisUtterance('Listen to this!');
    window.speechSynthesis.cancel();
    await new Promise(resolve => {
      utter1.onend = _ => {
        setTimeout(() => resolve(), 700);
      }
      utter1.onerror = resolve;
      window.speechSynthesis.speak(utter1);
    });
    await replay(songs[songIdx], {
      doReMiMode: doReMiMode,
      noteSpeedRatio: noteSpeedRatio,
      onProgress: idx => {
        keyIdx = idx + 1;
        render();
      }
    });
    replayFinished = true;
    keyIdx = 0;
    render();
    const utter2 = new window.SpeechSynthesisUtterance('Can you play it?');
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter2);
    window.addEventListener('keydown', handleChordKey);
  }

  // Add navigation buttons and challenge/DoReMi checkboxes
  function addNavButtons() {
    // Remove if already present
    let prevBtn = document.getElementById('prevSongBtn');
    let nextBtn = document.getElementById('nextSongBtn');
    let challengeBox = document.getElementById('challengeCheckbox');
    let challengeLabel = document.getElementById('challengeLabel');
    let doReMiBox = document.getElementById('doReMiCheckbox');
    let doReMiLabel = document.getElementById('doReMiLabel');
    let speedSlider = document.getElementById('speedSlider');
    let speedLabel = document.getElementById('speedLabel');
    if (prevBtn) prevBtn.remove();
    if (nextBtn) nextBtn.remove();
    if (challengeBox) challengeBox.remove();
    if (challengeLabel) challengeLabel.remove();
    if (doReMiBox) doReMiBox.remove();
    if (doReMiLabel) doReMiLabel.remove();
    if (speedSlider) speedSlider.remove();
    if (speedLabel) speedLabel.remove();

    prevBtn = document.createElement('button');
    prevBtn.id = 'prevSongBtn';
    prevBtn.textContent = '⟨ Prev Song';
    prevBtn.style.position = 'fixed';
    prevBtn.style.top = '20px';
    prevBtn.style.right = '180px';
    prevBtn.style.zIndex = 1000;
    prevBtn.style.fontSize = '24px';

    nextBtn = document.createElement('button');
    nextBtn.id = 'nextSongBtn';
    nextBtn.textContent = 'Next Song ⟩';
    nextBtn.style.position = 'fixed';
    nextBtn.style.top = '20px';
    nextBtn.style.right = '40px';
    nextBtn.style.zIndex = 1000;
    nextBtn.style.fontSize = '24px';

    challengeBox = document.createElement('input');
    challengeBox.type = 'checkbox';
    challengeBox.id = 'challengeCheckbox';
    challengeBox.style.position = 'fixed';
    challengeBox.style.top = '70px';
    challengeBox.style.right = '40px';
    challengeBox.style.zIndex = 1000;
    challengeBox.style.transform = 'scale(1.5)';
    challengeBox.checked = challengeMode;

    challengeLabel = document.createElement('label');
    challengeLabel.id = 'challengeLabel';
    challengeLabel.htmlFor = 'challengeCheckbox';
    challengeLabel.textContent = 'Challenge';
    challengeLabel.style.position = 'fixed';
    challengeLabel.style.top = '70px';
    challengeLabel.style.right = '80px';
    challengeLabel.style.zIndex = 1000;
    challengeLabel.style.fontSize = '24px';

    doReMiBox = document.createElement('input');
    doReMiBox.type = 'checkbox';
    doReMiBox.id = 'doReMiCheckbox';
    doReMiBox.style.position = 'fixed';
    doReMiBox.style.top = '110px';
    doReMiBox.style.right = '40px';
    doReMiBox.style.zIndex = 1000;
    doReMiBox.style.transform = 'scale(1.5)';
    doReMiBox.checked = doReMiMode;

    doReMiLabel = document.createElement('label');
    doReMiLabel.id = 'doReMiLabel';
    doReMiLabel.htmlFor = 'doReMiCheckbox';
    doReMiLabel.textContent = 'Do Re Mi';
    doReMiLabel.style.position = 'fixed';
    doReMiLabel.style.top = '110px';
    doReMiLabel.style.right = '80px';
    doReMiLabel.style.zIndex = 1000;
    doReMiLabel.style.fontSize = '24px';

    speedSlider = document.createElement('input');
    speedSlider.type = 'range';
    speedSlider.id = 'speedSlider';
    speedSlider.min = '0.3';
    speedSlider.max = '2.5';
    speedSlider.step = '0.1';
    speedSlider.value = noteSpeedRatio;
    speedSlider.style.position = 'fixed';
    speedSlider.style.top = '160px';
    speedSlider.style.right = '40px';
    speedSlider.style.zIndex = 1000;
    speedSlider.style.width = '180px';

    speedLabel = document.createElement('label');
    speedLabel.id = 'speedLabel';
    speedLabel.htmlFor = 'speedSlider';
    speedLabel.textContent = `Speed: ${noteSpeedRatio.toFixed(1)}x`;
    speedLabel.style.position = 'fixed';
    speedLabel.style.top = '160px';
    speedLabel.style.right = '230px';
    speedLabel.style.zIndex = 1000;
    speedLabel.style.fontSize = '24px';

    prevBtn.onclick = () => {
      if (songIdx > 0) {
        songIdx--;
        sectionIdx = 0;
        keyIdx = 0;
        waitingForSpace = true;
        challengeMode = challengeBox.checked;
        doReMiMode = doReMiBox.checked;
        setConfigToHash();
        render();
        window.removeEventListener('keydown', handleChordKey);
        window.removeEventListener('keydown', handleSpace);
        window.addEventListener('keydown', handleSpace);
      }
    };
    nextBtn.onclick = () => {
      if (songIdx < songs.length - 1) {
        songIdx++;
        sectionIdx = 0;
        keyIdx = 0;
        waitingForSpace = true;
        challengeMode = challengeBox.checked;
        doReMiMode = doReMiBox.checked;
        setConfigToHash();
        render();
        window.removeEventListener('keydown', handleChordKey);
        window.removeEventListener('keydown', handleSpace);
        window.addEventListener('keydown', handleSpace);
      }
    };
    challengeBox.onchange = () => {
      challengeMode = challengeBox.checked;
      setConfigToHash();
      render();
    };
    doReMiBox.onchange = () => {
      doReMiMode = doReMiBox.checked;
      setConfigToHash();
      render();
    };
    speedSlider.oninput = () => {
      noteSpeedRatio = parseFloat(speedSlider.value);
      speedLabel.textContent = `Speed: ${noteSpeedRatio.toFixed(1)}x`;
      setConfigToHash();
    };

    document.body.appendChild(prevBtn);
    document.body.appendChild(nextBtn);
    document.body.appendChild(challengeBox);
    document.body.appendChild(challengeLabel);
    document.body.appendChild(doReMiBox);
    document.body.appendChild(doReMiLabel);
    document.body.appendChild(speedSlider);
    document.body.appendChild(speedLabel);
  }

  function render() {
    addNavButtons();
    if (waitingForSpace) {
      renderPressSpace();
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (gameOver) {
      ctx.font = '80px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText('Game Over', 400, 300);
      return;
    }
    const song = songs[songIdx];
    ctx.font = '48px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(song.name, 40, 80);

    ctx.font = '60px monospace';
    // Render only the current section's chords
    let section = song.chords ? (typeof song.chords[sectionIdx] === 'string' ? [song.chords[sectionIdx]] : song.chords[sectionIdx]) : [];
    if (!section && song.chords) {
      section = typeof song.chords[song.chords.length - 1] === 'string' ? [song.chords[song.chords.length - 1]] : song.chords[song.chords.length - 1];
    }
    if (!section) section = [];

    if (!challengeMode) {
      let chordIndex = 0;
      section.forEach((row, rIdx) => {
        let y = 240 + rIdx * 96;
        let x = 120;
        const chords = typeof row === 'string' ? row.split(' ') : row.split(' ');
        chords.forEach((k, cIdx) => {
          let isPlayed;
          if (replayFinished && keyIdx === 0) {
            // After replay, only highlight the first token
            isPlayed = chordIndex === 0;
          } else {
            // During replay, highlight up to keyIdx
            isPlayed = chordIndex <= keyIdx - 1;
          }
          if (k !== '' && k !== '_') {
            ctx.fillStyle = isPlayed ? 'red' : 'black';
            ctx.fillText(k, x, y);
          } else if (k === '_') {
            ctx.fillStyle = isPlayed ? 'red' : 'gray';
            ctx.fillText('_', x, y);
          }
          chordIndex++;
          x += 120;
        });
      });
    }

    if (showConfetti) {
      ctx.font = '120px serif';
      ctx.fillStyle = 'orange';
      ctx.fillText('🎉 🎉 🎉 🎉', 180, 210 + (section.length) * 96);
    }
  }

  function nextSectionOrSong() {
    showConfetti = false;
    const song = songs[songIdx];
    sectionIdx++;
    if (sectionIdx >= (song.chords ? song.chords.length : 1)) {
      setTimeout(() => {
        showConfetti = true;
        render();
      }, 1000);
      setTimeout(() => {
        // Utter praise for the song
        if (typeof window.speechSynthesis !== "undefined") {
          const title = song.name.replace(/\s*\(.*?\)\s*$/, '');
          const exclamations = [
            'Bless my soul! ',
            'Bless my beard! ',
            'Bless my eye brows! ',
            'God bless the next generation! ',
            'Amazing effort! ',
            'What an effort! ',
            'I cannot commend you enough for your dedication! ',
            'No words can do justice to your work ethic! ',
            'Hard work really works! ',
            'Persistent practice really pays! ',
            'Practice really makes possible! ',
            'Mamma Mia! ',
            'Ay caramba! ',
            'Jesus! ',
            'Jesus Christ! ',
            'Oh, snap! ',
            'My god! ',
            'Holy Moly! ',
            'Woo Hoo! ',
            'Am I in a dream? ',
            'Is this real? ',
            'This is surreal! ',
            'Are my eyes fooling me? ',
            'How did you do that? ',
            'Did you hear my jaw dropping! ',
            'I am speechless! ',
            'I do not know what to say! ',
            'That is so cool! ',
            'Brilliant achievement! ',
            'Astounding feat! ',
            'Fabulous job! ',
            'Fantastic work! ',
            'Oh my god! ',
            'Oh my lord! ',
            'My goodness! ',
            'Goodness gracious! ',
            'Well done! ',
            'Way to go! ',
            'Awesome work! ',
            'Great job! ',
          ];
          const intros = [
            'What',
            'This is such',
            'That is such',
          ]
            const adjectives = [
            'a beautiful',
            'a splendid',
            'a stunning',
            'a powerful',
            'an inspiring',
            'a moving',
            'a touching',
            'a brilliant',
            'a captivating',
            'an elegant',
            'a graceful',
            'a majestic',
            'a soulful',
            'an enchanting',
            'a delightful',
            'an expressive',
            'a vivid',
            'a charming',
            'a heartfelt',
            'an amazing',
            'an awesome',
            'a masterful',
            'a surreal',
            'an impressive',
            'an exquisite',
            ];
          const nouns = [
            'rendition',
            'rendition',
            'rendition',
            'performance',
            'performance',
            'performance',
            'interpretation',
            'interpretation',
            'arrangement',
            'delivery',
            'delivery',
            'delivery',
            'take',
          ];

          // pick randomly from adjectives, nouns and verbs
          function pickRandom(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
          }
          const exclamation = pickRandom(exclamations);
          const intro = pickRandom(intros);
          const adj = pickRandom(adjectives);
          const noun = pickRandom(nouns);
          const praise = `${exclamation} ${intro} ${adj} ${noun} of ${title}!`;
          const utter = new window.SpeechSynthesisUtterance(praise);
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utter);
        }
      }, 1500);
      setTimeout(() => {
        showConfetti = false;
        render();
      }, 5000);
      setTimeout(() => {
        songIdx++;
        sectionIdx = 0;
        if (songIdx >= songs.length) {
          gameOver = true;
          render();
          return;
        }
        waitingForSpace = true;
        render();
        window.addEventListener('keydown', handleSpace);
      }, 5000);
      return;
    }
    keyIdx = 0;
    flatChords = flattenChords(songs[songIdx], sectionIdx);
    render();
    window.addEventListener('keydown', handleChordKey);
  }

  let pressedKeys = {};
  let isUttering = false;

  function handleChordKey(e) {
    if (gameOver) return;
    if (isReplaying) return;
    if (pressedKeys[e.code]) return;
    pressedKeys[e.code] = true;
    
    // Check if the key pressed is a number 0-9 for drum beats
    if (chordMap[e.key]) {
      // Play the specific drum sound for this number
      const drumNote = chordMap[e.key][0];
      MIDI.noteOn(DRUM_CHANNEL, drumNote, 90);
      setTimeout(() => MIDI.noteOff(DRUM_CHANNEL, drumNote), 200);
      
      isReplaying = true;
      window.removeEventListener('keydown', handleChordKey);
      // Replay melody only (no chords)
      const song = songs[songIdx];
      const melodyOnly = Object.assign({}, song);
      delete melodyOnly.chords;
      replay(melodyOnly, {
        doReMiMode: doReMiMode,
        noteSpeedRatio: noteSpeedRatio,
        onProgress: idx => {
          keyIdx = idx + 1;
          render();
        }
      }).then(() => {
        nextSectionOrSong();
        isReplaying = false;
      });
    }
  }

  function handleKeyUp(e) {
    pressedKeys[e.code] = false;
  }

  function handleSpace(e) {
    if (e.code === 'Space' || e.key === ' ') {
      window.removeEventListener('keydown', handleSpace);
      startSong();
    }
  }

  // Start first song, first section
  sectionIdx = 0;
  keyIdx = 0;
  waitingForSpace = true;
  render();
  window.addEventListener('keydown', handleSpace);
  window.addEventListener('keyup', handleKeyUp);
}

// Read config from URL hash
(function initFromHash() {
  const params = getConfigFromHash();
  doReMiMode = params.doReMi === '1';
  challengeMode = params.challenge === '1';
  if (params.songIdx && !isNaN(params.songIdx)) {
    songIdx = Math.max(0, Math.min(songs.length - 1, parseInt(params.songIdx, 10)));
  }
  if (params.noteSpeedRatio && !isNaN(params.noteSpeedRatio)) {
    noteSpeedRatio = Math.max(0.4, Math.min(2.5, parseFloat(params.noteSpeedRatio)));
  }
})();

runGame();

