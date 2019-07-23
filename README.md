# Lazy Word Guess

A command line word guessing game where users must guess letters to solve for a word or phrase. The purpose of this application is to demonstrate coding proficiency in a node environment and to exemplify the use of constructors.

## Preview

- A [video](./assets/videos/word-guess-walkthrough.mp4) where I go over the files and code and give a demo of the functionality

## Organization

Lazy Word Guess utilizes async/await to ensure a top-down code execution model. This is preferred over recursive calls and chaining asynchronous functions for readability and code comprehension.

The application has three javascript files.

- letter.js is a constructor that generates an object to store data and methods for the individual letters in a given phrase
- phrase.js is a constructor that generates an object to sotre data and methods for the phrase as a whole. It calls the letter constructor and stores the letter objects in an array.
- index.js is the main javascript file that includes the runtime and the necessary functions and imports that the application requires to run.

## Process

### Playing the Game

When Lazy Word Guess is run, the user is prompted for a user name. This name becomes the user file name and the application stores data about the user in this file:

- user name
- number of wins
- number of losses
- the date that the file was created (formatted with moment)
- a list of the phrases that the user has solved

After login, the user is provided with a list of commands that they can enter while they play the game.

- `-a` print the remaining attempts to the console
- `-d` print the user data to the console
- `-h` print a hint about the phrase to the console
- `-l` print the letters that the user has guessed to the console
- `-r` restart the game with a new phrase, which counts as a loss for the current phrase
- `-q` quit the game, which does not count as a loss

They are then presented with a clue that represents the underlying phrase through a series of underscores and spaces. The user will enter letters (or commands) until they have solved the clue or they run out of attempts.

**solving the clue results in the user win stat being incremented and the phrase being pushed to the user file**

**using up all atempts before solving the clue results in the user losses stat being incremented and the phrase being pushed back into the library of phrases**

After a win or losss, the user is promted to play again.

### Under the Hood

Lazy Word Guess is driven by promts to the user. These prompts are delivered using the `inquirer` package.

Data read/writes are handled by the `fs` package

Constructors are used to parse and generate clues.

**Phrase** is a constructor that parses a phrase down into its letters. Each letter is then sent to the **Letter** constructor.

### phrase.js

**requires** letter.js

**the object**:

```js
{
  letters: [], //an array of letter objects
  solved: boolean, //initially set to false, updated to true when all of the letters are guessed
  words: String //the phrase that is initially passed to the constructor
}
```

**the methods**

- `getString` => returns the current clue to be printed to the console. This methods queries the individual letters and generates a string of letters and underscores depending on which of the letters have been guessed.

- `checkLetter` => takes in a letter and checks the value against each of the letters in the phrase, updating them as necessary. This method also checks to see if the phrase has been solved, i.e. all of the letters have been guessed.

### letters.js

**the object**:

```js
{
  character: String, //the letter
  guessed: boolean, //initially false, updated to true when the letter is guessed
  display: String, //initially set to '_' and updated to the character when the letter is guessed
}
```

**the methods**

- `getLetter` => returns the display value for the letter, either the letter itslef or '\_'

- `check` => checks the letter against a character. If they match, guessed is updated to true and display is updated to the letter itself

### Packages

- `fs` for reading and writing ot the file system
- `inquirer` for handling user prompts and returning data
- `moment` for formatting date/time strings

### code execution model

_async/await_ is utilized to structure the code execution in a top-down way. This forces a synchronous code execution model in an asynchronous environment and allows for enhanced readability and predictable behavior of the code as it executes. It eliminates the complexities that arise from recursive calls and chaining within callback functions.
