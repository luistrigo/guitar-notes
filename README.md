# Guitar Notes - Learn the Fretboard

An interactive web application to learn guitar fretboard notes visually and practically.

## Features

- **Interactive fretboard** with 6 strings and 12 frets
- **Multi-language system** (Spanish and English)
- **Two musical notations**:
  - Spanish notation: DO, RE, MI, FA, SOL, LA, SI
  - English notation: C, D, E, F, G, A, B
- **Modern and responsive interface**
- **Intuitive design** for beginners and advanced users

## How to Use

1. **Open the `index.html` file** in your web browser
2. **Select the language** from the settings modal
3. **Choose the musical notation** you prefer
4. **Click on any position** on the fretboard to see the corresponding note
5. **Check the information** in the bottom panel:
   - Current note
   - String number
   - Fret number

## Functionality

### Language Change
- **Spanish**: Complete interface in Spanish
- **English**: Complete interface in English

### Musical Notations
- **DO RE MI FA**: Traditional Spanish notation
- **C D E F**: International notation

### Interaction
- **Hover**: When hovering over a position, it highlights
- **Click**: When clicking, the note is displayed permanently
- **Click outside**: When clicking outside the fretboard, the selection is cleared

## Project Structure

```
guitar-notes/
├── index.html      # Main HTML file
├── styles.css      # CSS styles
├── script.js       # JavaScript logic
└── README.md       # This file
```

## Technologies Used

- **HTML5**: Semantic structure
- **CSS3**: Modern styles with gradients and animations
- **JavaScript ES6+**: Application logic
- **CSS Grid**: Responsive fretboard layout
- **Flexbox**: Controls and panels layout

## Technical Features

- **Responsive Design**: Works on mobile and desktop devices
- **Accessibility**: Intuitive and clear controls
- **Performance**: Optimized and efficient code
- **Cross-browser**: Compatible with modern browsers

## Musical Notes

### Standard Tuning (from 1st to 6th string)
- **1st string**: MI (E)
- **2nd string**: SI (B)
- **3rd string**: SOL (G)
- **4th string**: RE (D)
- **5th string**: LA (A)
- **6th string**: MI (E)

### Note Calculation
The application automatically calculates notes based on:
1. The open string note
2. The number of semitones (frets) from the open string
3. The chromatic scale of 12 notes

## Educational Use

This application is perfect for:
- **Beginners**: Learn the basic notes of the fretboard
- **Students**: Practice note identification
- **Teachers**: Teach music theory visually
- **Musicians**: Quick note reference

## Contributing

If you want to improve the application, you can:
- Add more languages
- Include more musical notations
- Add interactive exercises
- Implement a practice mode

## License

This project is open source and available for educational and personal use.
