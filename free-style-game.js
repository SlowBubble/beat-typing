
// Track which chord is currently pressed
let pressedChordKey = null;

function playChord(notes) {
	notes.forEach(noteNumber => {
		$(window).trigger('keyboardDown', {
			time: new Date().getTime(),
			noteNumber,
			channel: 0,
			velocity: 120,
		});
	});
}

function releaseChord(notes) {
	notes.forEach(noteNumber => {
		$(window).trigger('keyboardUp', {
			time: new Date().getTime(),
			noteNumber,
			channel: 0,
			velocity: 120,
		});
	});
}


window.addEventListener('keydown', function(e) {
	// Only respond to number keys 1-7 (top row)
	if (e.repeat) {
		e.preventDefault();
    return;
  }
	const key = e.key;
	if (chordMap[key]) {
		if (pressedChordKey !== key) {
			playChord(chordMap[key]);
			pressedChordKey = key;
		}
	} else if (!e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
		e.preventDefault();
	}
});

window.addEventListener('keyup', function(e) {
	const key = e.key;
	if (chordMap[key] && pressedChordKey === key) {
		releaseChord(chordMap[key]);
		pressedChordKey = null;
	}
});