
// Track which chord is currently pressed
let pressedChordKey = null;
let activeDrumNotes = {}; // Track active drum notes by key

function playChord(notes) {
	notes.forEach(noteNumber => {
		$(window).trigger('keyboardDown', {
			time: new Date().getTime(),
			noteNumber,
			channel: 0,
			velocity: 90,  // Reduced by 25% from 120
		});
	});
}

function releaseChord(notes) {
	notes.forEach(noteNumber => {
		$(window).trigger('keyboardUp', {
			time: new Date().getTime(),
			noteNumber,
			channel: 0,
			velocity: 90,  // Reduced by 25% from 120
		});
	});
}

function playDrumBeat(noteNumber, key) {
	// Play drum beat on drum channel (50% louder than piano)
	MIDI.noteOn(DRUM_CHANNEL, noteNumber, 135);
	// Track this drum note by key
	activeDrumNotes[key] = noteNumber;
}

function stopDrumBeat(key) {
	if (activeDrumNotes[key]) {
		MIDI.noteOff(DRUM_CHANNEL, activeDrumNotes[key]);
		delete activeDrumNotes[key];
	}
}

window.addEventListener('keydown', function(e) {
	// Only respond to number keys and other mapped keys
	if (e.repeat) {
		e.preventDefault();
    return;
  }
	const key = e.key;
	if (chordMap[key]) {
		// Check if it's a number 0-9 (drum beat)
		if (key >= '0' && key <= '9') {
			const drumNote = chordMap[key][0];
			playDrumBeat(drumNote, key);
		} else {
			// Play chord for other keys
			if (pressedChordKey !== key) {
				playChord(chordMap[key]);
				pressedChordKey = key;
			}
		}
	} else if (!e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
		e.preventDefault();
	}
});

window.addEventListener('keyup', function(e) {
	const key = e.key;
	if (chordMap[key]) {
		// Check if it's a number 0-9 (drum beat)
		if (key >= '0' && key <= '9') {
			stopDrumBeat(key);
		} else {
			// Release chords for non-number keys
			if (pressedChordKey === key) {
				releaseChord(chordMap[key]);
				pressedChordKey = null;
			}
		}
	}
});