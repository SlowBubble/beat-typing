const charToNoteNum = {
  '`': 59,      // 47+12
  1: 60,        // 48+12
  'q': 61,
  2: 62,
  'w': 63,
  3: 64,
  4: 65,
  'r': 66,
  5: 67,
  't': 68,
  6: 69,
  'y': 70,
  7: 71,
  8: 72,
  'i': 73,
  9: 74,
  'o': 75,
  0: 76,
  '-': 77,
  '[': 78,
  '=': 79,
  ']': 80,
  '\\': 81,
  // Extended lower notes
  Tab: 58,
  a: 57,
  z: 56,
  s: 55,
  x: 54,
  d: 53,
  f: 52,
  v: 51,
  g: 50,
  b: 49,
  h: 48,
  j: 47,
  m: 46,
  k: 45,
  ',': 44,
  l: 43,
  '.': 42,
  ';': 41,
  "'": 40,
}


/*
Given an item from songs, play each note
- use charToNoteNum
- $(window).trigger('keyboardDown', {
  time: new Date().getTime(),
  noteNumber: noteNumber,
  channel: 0,
  velocity: 120,
  });
  - When triggering the next keyboardDown, remember to trigger keyboardUp for the previous note
  - Each note should last 400ms
  - don't trigger anything for '-', but should still have the same duration as a note
  - If song.swing > 0, then use noteDurMs * song.swing for the even notes' duration.
  Change:
  - Utter the character the same time we play the note.
  */
 function replay(song, opts = {}) {
  const noteDurMs = (song.noteDurMs || 800) / (opts.noteSpeedRatio || 1.0);
  const speechEnabled = opts.speechEnabled !== false; // Default to true
  const onProgress = opts.onProgress;
  
  // Configurable delimiters for speech - can be customized
  const delimiters = ['n']; // Previously was [] (no delimiters), now ['n'] for "1 n 2 n 3 n"

  // Helper to flatten a section array into a sequence of notes with row information
  function flattenSectionsWithRows(sections) {
    const notes = [];
    let keySections = Array.isArray(sections[0]) ? sections : [sections];
    keySections.forEach(section => {
      section.forEach((row, rowIndex) => {
        const rowNotes = row.split(' ').filter(k => k !== '');
        rowNotes.forEach((k, colIndex) => {
          notes.push({
            note: k,
            rowIndex: rowIndex,
            colIndex: colIndex + 1 // 1-based position within row
          });
        });
      });
    });
    return notes;
  }


  // Get main melody notes with row information
  const notesWithRows = flattenSectionsWithRows(song.keys);

  // Get chords (if any) - keep original flattening for chords
  function flattenSections(sections) {
    const notes = [];
    let keySections = Array.isArray(sections[0]) ? sections : [sections];
    keySections.forEach(section => {
      section.forEach(row => {
        row.split(' ').forEach(k => {
          if (k !== '') notes.push(k);
        });
      });
    });
    return notes;
  }
  
  const chords = song.chords ? flattenSections(song.chords) : null;

  // Determine the max length for playback
  const maxLen = Math.max(notesWithRows.length, chords ? chords.length : 0);


  return new Promise(resolve => {
    let idx = 0;
    let prevNoteNumber = null;
    function playNext() {
      if (onProgress) onProgress(idx);
      if (idx >= maxLen) {
        // Release last notes if any
        if (prevNoteNumber !== null) {
          $(window).trigger('keyboardUp', {
            time: new Date().getTime(),
            noteNumber: prevNoteNumber,
            channel: 0,
            velocity: 90,  // Reduced by 25% from 120
          });
        }
        resolve();
        return;
      }
      // Main melody
      const noteInfo = notesWithRows[idx] || { note: '_', rowIndex: -1, colIndex: 1 };
      const noteChar = noteInfo.note;
      let dur = noteDurMs;
      if (song.swing && idx % 2 === 1) {
        dur = noteDurMs * song.swing;
      }
      // Chord
      const chordChar = chords ? (chords[idx] || '_') : '_';

      // Speech on every beat (regardless of whether there's a note or rest)
      if (speechEnabled && typeof window.speechSynthesis !== "undefined") {
        const positionInRow = noteInfo.colIndex; // 1-based position within current row
        
        // Determine what to say based on position and delimiters
        let speechText;
        if (delimiters.length === 0) {
          // No delimiters: just say the position number
          speechText = positionInRow.toString();
        } else {
          // With delimiters: alternate between numbers and delimiters
          // Odd positions (1, 3, 5...): say the number (1, 2, 3...)
          // Even positions (2, 4, 6...): say the delimiter
          if (positionInRow % 2 === 1) {
            // Odd position: say the sequential number (1st->1, 3rd->2, 5th->3, etc.)
            const numberToSay = Math.ceil(positionInRow / 2);
            speechText = numberToSay.toString();
          } else {
            // Even position: say the delimiter
            speechText = delimiters[0] || 'n'; // Use first delimiter or default to 'n'
          }
        }
        
        const utter = new window.SpeechSynthesisUtterance(speechText);
        utter.volume = 0.5; // Reduce volume by 50%
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
      }

      // Play main melody note
      if (noteChar !== '_') {
        let noteNumber = charToNoteNum[noteChar];
        if (typeof noteNumber !== "undefined") {
          noteNumber += 12; // Play one octave higher than mapping
          window.setTimeout(_ => {
            if (prevNoteNumber !== null) {
              $(window).trigger('keyboardUp', {
                time: new Date().getTime(),
                noteNumber: prevNoteNumber,
                channel: 0,
                velocity: 60,  // Reduced by 25% from 80
              });
            }
            $(window).trigger('keyboardDown', {
              time: new Date().getTime(),
              noteNumber: noteNumber,
              channel: 0,
              velocity: 60,  // Reduced by 25% from 80
            });
            prevNoteNumber = noteNumber;
          }, 90);
        }
      }

      // Play drum beat instead of chord
      if (chordChar !== '_' && chordMap[chordChar]) {
        window.setTimeout(_ => {
          // Play the specific drum sound for this chord character
          const drumNote = chordMap[chordChar][0];
          MIDI.noteOn(DRUM_CHANNEL, drumNote, 135);
          setTimeout(() => MIDI.noteOff(DRUM_CHANNEL, drumNote), 150);
        }, 90);
      }

      idx++;
      setTimeout(playNext, dur);
    }
    playNext();
  });
}
