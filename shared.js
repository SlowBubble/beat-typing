
// Chord mapping for C major scale (MIDI note numbers)

const chordMap = {
  // Ionian mode
  '1': [60 - 12, 64, 67 - 12], // C E G
  '2': [62 - 12, 65, 69 - 12], // D F A
  '3': [64 - 12, 67, 71 - 12], // E G B
  '4': [65 - 24, 69, 72 - 24], // F A C
  '5': [67 - 24, 71, 74 - 24], // G B D
  '6': [69 - 24, 72, 76 - 24], // A C E
  '7': [71 - 24, 74, 81 - 24], // B D A
  // flats
  'q': [61 - 12, 65, 68 - 12], // Db F Ab
  'w': [63 - 12, 67, 70 - 12], // Eb G Bb
  'r': [66 - 24, 69, 72 - 24], // F# A C
  't': [68 - 24, 72, 75 - 24], // Ab C Eb
  'y': [70 - 24, 74, 77 - 24], // Bb D F
  // Opposite quality of Ionian mode
  'a': [60 - 12, 63, 67 - 12], // C Eb G
  's': [62 - 12, 66, 69 - 12], // D F# A
  'd': [64 - 12, 68, 71 - 12], // E G# B
  'f': [65 - 24, 68, 72 - 24], // F Ab C
  'g': [67 - 24, 70, 74 - 24], // G Bb D
  'h': [69 - 24, 73, 76 - 24], // A C# E
  'j': [71 - 24, 75, 78 - 24], // B D# F#
  // Dominant 7th chords
  '8': [60 - 12, 64, 70 - 12], // C E Bb
  '9': [62 - 12, 66, 72 - 12], // D F# C
  '0': [64 - 12, 68, 74 - 12], // E G# D
  'i': [61 - 12, 65, 71 - 12], // Db F B
  'o': [63 - 12, 67, 73 - 12], // Eb G Db
  'k': [65 - 24, 69, 75 - 24], // F A Eb
  'l': [67 - 24, 71, 77 - 24], // G B F
  ';': [69 - 24, 73, 79 - 24], // A C# G
  "'": [71 - 24, 75, 81 - 24], // B D# A
  ',': [66 - 24, 70, 76 - 24], // Gb Bb Fb
  '.': [68 - 24, 72, 78 - 24], // Ab C Gb
  '/': [70 - 24, 74, 80 - 24],  // Bb D Ab
  //
};

function simplifyCharTo123(char) {
  if (char === '7') {
    return 'Sev';
  }
  if (char === '8') {
    return '1';
  }
  if (char === '9') {
    return '2';
  }
  if (char === '0') {
    return '3';
  }
  if (char === '-') {
    return '4';
  }
  if (char === '=') {
    return '5';
  }
  if (char === '`') {
    return 'Sev';
  }
  return char;
}

function simplifyCharToDoReMi(char) {
  if (char === '1') return 'Doe';
  if (char === '2') return 'Ray';
  if (char === '3') return 'Mi';
  if (char === '4') return 'Fa';
  if (char === '5') return 'So';
  if (char === '6') return 'La';
  if (char === '7') return 'Ti';
  if (char === '8') return 'Doe';
  if (char === '9') return 'Ray';
  if (char === '0') return 'Mi';
  if (char === '-') return 'Fa';
  if (char === '=') return 'So';
  if (char === '\\') return 'La';
}
