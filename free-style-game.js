
// Track which chord is currently pressed
let pressedChordKey = null;

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

function playDrumBeat(noteNumber) {
	// Play drum beat on drum channel (50% louder than piano)
	MIDI.noteOn(DRUM_CHANNEL, noteNumber, 135);
	setTimeout(() => MIDI.noteOff(DRUM_CHANNEL, noteNumber), 200);
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
			playDrumBeat(drumNote);
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
	// Only release chords for non-number keys (numbers are drum beats that auto-release)
	if (chordMap[key] && pressedChordKey === key && !(key >= '0' && key <= '9')) {
		releaseChord(chordMap[key]);
		pressedChordKey = null;
	}
});