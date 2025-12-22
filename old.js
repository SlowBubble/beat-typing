export const charToNoteNum = {
  // Bottom row starts with note 35
  'z': 35,  // Acoustic Bass Drum
  'x': 36,  // Bass Drum 1
  'c': 37,  // Side Stick
  'v': 38,  // Acoustic Snare
  'b': 39,  // Hand Clap
  'n': 40,  // Electric Snare
  'm': 41,  // Low Floor Tom
  ',': 42,  // Closed Hi Hat
  '.': 43,  // High Floor Tom
  '/': 44,  // Pedal Hi-Hat
  
  // Second row (ASDF) - right to left
  "'": 45,  // Low Tom
  ';': 46,  // Open Hi-Hat
  'l': 47,  // Low-Mid Tom
  'k': 48,  // Hi-Mid Tom
  'j': 49,  // Crash Cymbal 1
  'h': 50,  // High Tom
  'g': 51,  // Ride Cymbal 1
  'f': 52,  // Chinese Cymbal
  'd': 53,  // Ride Bell
  's': 54,  // Tambourine
  'a': 55,  // Splash Cymbal
  
  // Third row continues normally
  'q': 56,  // Cowbell
  'w': 57,  // Crash Cymbal 2
  'e': 58,  // Vibraslap
  'r': 59,  // Ride Cymbal 2
  't': 60,  // Hi Bongo
  'y': 61,  // Low Bongo
  'u': 62,  // Mute Hi Conga
  'i': 63,  // Open Hi Conga
  'o': 64,  // Low Conga
  'p': 65,  // High Timbale
  '[': 66,  // Low Timbale
  ']': 67,  // High Agogo
  '\\': 68, // Low Agogo
  
  // Top row (numbers) - right to left
  '=': 69,  // Cabasa
  '-': 70,  // Maracas
  '0': 71,  // Short Whistle
  '9': 72,  // Long Whistle
  '8': 73,  // Short Guiro
  '7': 74,  // Long Guiro
  '6': 75,  // Claves
  '5': 76,  // Hi Wood Block
  '4': 77,  // Low Wood Block
  '3': 78,  // Mute Cuica
  '2': 79,  // Open Cuica
  '1': 80,  // Mute Triangle
  '`': 81,  // Open Triangle
}

export const noteNumToVelocity = {
  35: 120,  // z - Acoustic Bass Drum
  36: 120,  // x - Bass Drum 1
  37: 90,  // c - Side Stick
  38: 90,  // v - Acoustic Snare
  39: 90,  // b - Hand Clap
  40: 90,  // n - Electric Snare
  41: 90,  // m - Low Floor Tom
  42: 90,  // , - Closed Hi Hat
  43: 90,  // . - High Floor Tom
  44: 90,  // / - Pedal Hi-Hat
  45: 90,  // ' - Low Tom
  46: 90,  // ; - Open Hi-Hat
  47: 90,  // l - Low-Mid Tom
  48: 90,  // k - Hi-Mid Tom
  49: 25,  // j - Crash Cymbal 1
  50: 90,  // h - High Tom
  51: 25,  // g - Ride Cymbal 1
  52: 25,  // f - Chinese Cymbal
  53: 25,  // d - Ride Bell
  54: 90,  // s - Tambourine
  55: 25,  // a - Splash Cymbal
  56: 90,  // q - Cowbell
  57: 25,  // w - Crash Cymbal 2
  58: 90,  // e - Vibraslap
  59: 90,  // r - Ride Cymbal 2
  60: 90,  // t - Hi Bongo
  61: 90,  // y - Low Bongo
  62: 90,  // u - Mute Hi Conga
  63: 90,  // i - Open Hi Conga
  64: 90,  // o - Low Conga
  65: 90,  // p - High Timbale
  66: 90,  // [ - Low Timbale
  67: 90,  // ] - High Agogo
  68: 90,  // \ - Low Agogo
  69: 90,  // = - Cabasa
  70: 90,  // - - Maracas
  71: 25,  // 0 - Short Whistle
  72: 25,  // 9 - Long Whistle
  73: 90,  // 8 - Short Guiro
  74: 90,  // 7 - Long Guiro
  75: 90,  // 6 - Claves
  76: 90,  // 5 - Hi Wood Block
  77: 90,  // 4 - Low Wood Block
  78: 90,  // 3 - Mute Cuica
  79: 90,  // 2 - Open Cuica
  80: 90,  // 1 - Mute Triangle
  81: 90,  // ` - Open Triangle
};

export const noteToPercussion = {
  35: "Acoustic Bass Drum",
  36: "Bass Drum 1",
  37: "Side Stick",
  38: "Acoustic Snare",
  39: "Hand Clap",
  40: "Electric Snare",
  41: "Low Floor Tom",
  42: "Closed Hi Hat",
  43: "High Floor Tom",
  44: "Pedal Hi-Hat",
  45: "Low Tom",
  46: "Open Hi-Hat",
  47: "Low-Mid Tom",
  48: "Hi-Mid Tom",
  49: "Crash Cymbal 1",
  50: "High Tom",
  51: "Ride Cymbal 1",
  52: "Chinese Cymbal",
  53: "Ride Bell",
  54: "Tambourine",
  55: "Splash Cymbal",
  56: "Cowbell",
  57: "Crash Cymbal 2",
  58: "Vibraslap",
  59: "Ride Cymbal 2",
  60: "Hi Bongo",
  61: "Low Bongo",
  62: "Mute Hi Conga",
  63: "Open Hi Conga",
  64: "Low Conga",
  65: "High Timbale",
  66: "Low Timbale",
  67: "High Agogo",
  68: "Low Agogo",
  69: "Cabasa",
  70: "Maracas",
  71: "Short Whistle",
  72: "Long Whistle",
  73: "Short Guiro",
  74: "Long Guiro",
  75: "Claves",
  76: "Hi Wood Block",
  77: "Low Wood Block",
  78: "Mute Cuica",
  79: "Open Cuica",
  80: "Mute Triangle",
  81: "Open Triangle"
};