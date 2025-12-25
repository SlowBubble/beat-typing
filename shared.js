// Drum mapping for beat typing - different drum sounds for each number

const chordMap = {
  // Numbers 1-9 and 0 play different drum sounds
  '1': [81], // Open Triangle
  '2': [54], // Tambourine
  '3': [51], // Ride Cymbal 1
  '4': [37], // Side Stick
  '5': [42], // Closed Hi-Hat
  '6': [56], // Cowbell
  '7': [41], // Low Floor Tom
  '8': [38], // Acoustic Snare
  '9': [49], // Crash Cymbal 1
  '0': [43], // High Floor Tom
};

// Shared state for restricted attempts mode
let isRestrictedAttemptsActive = false;
let hasAttemptsLeft = true;

// Function to check if sound should be allowed
function shouldAllowSound() {
  return !isRestrictedAttemptsActive || hasAttemptsLeft;
}

// Function to update attempts state (called from game.js)
function updateAttemptsState(restrictedMode, attemptsRemaining) {
  isRestrictedAttemptsActive = restrictedMode;
  hasAttemptsLeft = attemptsRemaining > 0;
}

// MIDI note number to percussion instrument name mapping
const percussionNames = {
  36: 'Bass Drum 1',
  37: 'Side Stick',
  38: 'Acoustic Snare',
  39: 'Hand Clap',
  40: 'Electric Snare',
  41: 'Low Floor Tom',
  42: 'Closed Hi-Hat',
  43: 'High Floor Tom',
  44: 'Pedal Hi-Hat',
  45: 'Low Tom',
  46: 'Open Hi-Hat',
  47: 'Low-Mid Tom',
  48: 'Hi-Mid Tom',
  49: 'Crash Cymbal 1',
  50: 'High Tom',
  51: 'Ride Cymbal 1',
  52: 'Chinese Cymbal',
  53: 'Ride Bell',
  54: 'Tambourine',
  55: 'Splash Cymbal',
  56: 'Cowbell',
  57: 'Crash Cymbal 2',
  58: 'Vibraslap',
  59: 'Ride Cymbal 2',
  60: 'Hi Bongo',
  61: 'Low Bongo',
  62: 'Mute Hi Conga',
  63: 'Open Hi Conga',
  64: 'Low Conga',
  65: 'High Timbale',
  66: 'Low Timbale',
  67: 'High Agogo',
  68: 'Low Agogo',
  69: 'Cabasa',
  70: 'Maracas',
  71: 'Short Whistle',
  72: 'Long Whistle',
  73: 'Short Guiro',
  74: 'Long Guiro',
  75: 'Claves',
  76: 'Hi Wood Block',
  77: 'Low Wood Block',
  78: 'Mute Cuica',
  79: 'Open Cuica',
  80: 'Mute Triangle',
  81: 'Open Triangle'
};

// Helper function to get percussion name from key
function getPercussionNameFromKey(key) {
  if (chordMap[key] && key >= '0' && key <= '9') {
    const noteNumber = chordMap[key][0];
    return percussionNames[noteNumber] || `Percussion ${noteNumber}`;
  }
  return null;
}

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
