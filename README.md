# m1a
- I want to change the game from chord typing to beat typing
  - Initialize drums in addition to the piano (see the example in old.js)
  - Instead of playing the chords when the numbers show up, play the following instead:
    - 0-9: Open Triangle

# m1b
- Instead of hard-coding 0-9 to Open Triangle, use
  - 1: 81,  // Open Triangle
  - 2: 42,  // Closed Hi Hat
  - 3: 36,  // Bass Drum 1
  - 4: 37,  // Side Stick
  - 5: 54,  // Tambourine
  - 6: 44,  // Pedal Hi-Hat
  - 7: 41,  // Low Floor Tom
  - 8: 38,  // Acoustic Snare
  - 9: 56,  // Cowbell
  - 0: 46,  // Open Hi-Hat

# m1c

- Change the mapping to
  - 1: Open Triangle
  - 2: Ride Cymbal 1
  - 3: Tambourine
  - 4: Side Stick
  - 5: Low Floor Tom
  - 6: Closed Hi-Hat
  - 7: Cowbell
  - 8: Acoustic Snare
  - 9: High Floor Tom
  - 0: Open Hi-Hat

# m1d

- The drum is played correctly when keydown, but it stop soon after even though I have holding the key. Can you trigger stop only when keyup happens.