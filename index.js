//pull in the dependencies
const Phrase = require("./phrase.js");
const inquirer = require("inquirer");
const fs = require("fs");
const moment = require("moment");
//a global file path for the user
var userFile = "";
//a global object to store game data
var library = [];
//a global object to store user data
var userData = {
  name: "",
  joindate: "",
  wins: 0,
  losses: 0,
  hintsUsed: 0,
  intro: true
};
//a global array to store solved words
var solved = [];

//the data for this game is stored in library.json
//Loading the library occurs after the user data is collected and loaded
//the Library will ignore any entries that appear in the solved array
function loadLibrary() {
  return new Promise(resolve => {
    console.log("trouver la bibliothèque");
    fs.readFile("library.wgd", "utf8", function(err, data) {
      if (err) {
        console.log(err);
        resolve(err);
        return;
      }
      console.log("analyser les données");
      var arry = data.split("\n");
      arry.pop();
      arry.forEach(line => {
        if (line.trim().length === 0) return;
        var entry = JSON.parse(line);
        if (!solved.includes(entry)) {
          library.push(entry);
        }
      });
      console.log("conquérir un petit pays");
      resolve("library loaded successfully");
    });
  });
}

//loginUser looks for a file named _name_.log and either loads the user data and solved word list
//or creates a file and appends user data to it.
function loginUser(name) {
  return new Promise(resolve => {
    userFile = "users/" + name + ".wgd";
    fs.readFile(userFile, "utf8", function(err, data) {
      if (err) {
        //there was an error accessing the file
        if (err.errno === -4058) {
          //the file was not found, the user is new to the game
          userData.joindate = moment().format("MM/DD/YYYY");
          userData.name = name;
          fs.appendFile(userFile, JSON.stringify(userData) + "\n", function(err) {
            if (err) {
              console.log(err);
              resolve(err);
            }
            resolve("Nice to meet you, " + name + "!");
          });
        } else {
          console.log(err);
          resolve(err);
        }
      }
      if (data) {
        userData = JSON.parse(data.split("\n")[0]);
        var arry = data.split("\n").slice(1);
        arry.pop();
        for (var i = 0; i < arry.length; i++) {
          solved.push(JSON.parse(arry[i]));
        }
        resolve("Nice to see you again, " + name + "!");
      }
    });
  });
}

//a function to append a solved phrase object to the user profile
function appendSolvedPhrase(object) {
  return new Promise(resolve => {
    var dataString = JSON.stringify(object) + "\n";
    fs.appendFile(userFile, dataString, function(err) {
      if (err) {
        console.log(err);
        resolve(err);
        return;
      }
      resolve("user file updated successfully");
    });
  });
}

//a function to run the welcome routine
function welcome() {
  return new Promise(resolve => {
    inquirer
      .prompt({
        type: "input",
        message: "--LAZY WORD GUESS--\n\nHi. Enter your name to play the game.\n>>",
        name: "name",
        validate: function(name) {
          if (name.length === 0) return "you must enter a name";
          var reservedChars = "!@#$%^&*()+=\"';:,><./?";
          for (var i = 0; i < reservedChars.length; i++) {
            if (name.includes(reservedChars[i])) return "your name cannot include " + reservedChars;
          }
          return true;
        }
      })
      .then(function(response) {
        resolve(response.name);
        return;
      })
      .catch(function(err) {
        console.log(err);
        resolve(null);
        return;
      });
  });
}

//a function to display a clue to a user, take in user input (letter) and update the prompt until either the
//clue is solved or the number of attempts runs out
function promptClue(phrase) {
  return new Promise(resolve => {
    //display the phrase and prompt the user for a letter
    inquirer
      .prompt({
        type: "input",
        message: phrase.getString() + "\n>>",
        name: "letter"
      })
      .then(function(response) {
        resolve(response.letter);
      })
      .catch(function(err) {
        console.log(err);
      });
  });
}
//a function to promt the user if they want to play again.
function playAgain() {
  return new Promise(resolve => {
    inquirer
      .prompt({
        type: "confirm",
        message: "Would you like to play again?",
        name: "again"
      })
      .then(function(response) {
        resolve(response.again);
      })
      .catch(function(err) {
        console.log(err);
      });
  });
}
function retire() {
  return new Promise(resolve => {
    inquirer
      .prompt({
        type: "confirm",
        message: "are you sure you want to start a new question?",
        name: "r"
      })
      .then(function(response) {
        resolve(response.r);
      })
      .catch(function(err) {
        console.log(err);
      });
  });
}
//a function to confirm that the user wants to quit the game
function quitGame() {
  return new Promise(resolve => {
    inquirer
      .prompt({
        type: "confirm",
        message: "are you sure you want to quit?",
        name: "quit"
      })
      .then(function(response) {
        resolve(response.quit);
      })
      .catch(function(err) {
        console.log(err);
      });
  });
}
function updateUserData() {
  return new Promise(resolve => {
    fs.readFile(userFile, "utf8", function(err, data) {
      if (err) {
        console.log(err);
        resolve(err);
        return;
      }
      var arry = data.split("\n");
      arry[0] = JSON.stringify(userData);
      var dataString = arry.join("\n");
      fs.writeFile(userFile, dataString, function(err) {
        if (err) {
          console.log(err);
          resolve(err);
          return;
        }
        resolve("User profile updated successfully.");
      });
    });
  });
}
async function run() {
  try {
    var name = await welcome();
    var message = await loginUser(name);
    console.log(message);
    var now = new Date();
    var loadMessage = await loadLibrary();
    var later = new Date();
    var loadtime = (later.getTime() - now.getTime()) / 1000; //in seconds
    console.log(loadMessage + " in " + loadtime + " seconds.");
    //play the game...
    var play = true;
    while (play) {
      var introString =
        "You can enter the following commands whenever you see the >> cursor\n" +
        "-a\tsee the number of guesses you have left\n" +
        "-d\tsee your user data\n" +
        "-h\tget a hint\n" +
        "-l\tsee the letters you have guessed\n" +
        "-r\tstart a new game (this option will count as a loss and load a new clue)\n" +
        "-q\tquit the game";

      console.log(introString + "\n\nLet's play!");
      //get a phrase from the library
      library.sort(function(a, b) {
        return Math.random() - 0.5;
      });
      var guessed = [];
      var entry = library.shift();
      var hints = [];
      entry.definitions.forEach(def => {
        hints.push("*def*\t" + def);
      });
      entry.synonyms.forEach(syn => {
        hints.push("*syn*\t" + syn);
      });
      hints.sort(function(a, b) {
        return Math.random() - 0.5;
      });
      var phrase = new Phrase(entry.word);
      var attempts = 10;
      var correct = phrase.checkLetter("");
      while (!phrase.solved) {
        var guess = await promptClue(phrase);
        guess.trim();
        //filter out any commands
        if (guess[0] === "-") {
          var command = guess.slice(1);
          switch (command) {
            case "d":
              console.log("***** Your Data *****");
              var dataString = `Name: ${userData.name}\nDate Joined: ${userData.joindate}\nWins: ${userData.wins}\nLosses: ${userData.losses}\nHints Used: ${
                userData.hintsUsed
              }`;
              console.log(dataString);
              console.log("*********************");
              break;
            case "a":
              console.log("*you have " + attempts + " guesses remaining*");
              break;
            case "l":
              console.log("*your guesses so far*\t" + guessed.join(" "));
              break;
            case "h":
              if (hints.length > 0) {
                console.log(hints.shift());
                userData.hintsUsed += 1;
              } else {
                console.log("*No hints remaining*");
              }
              break;
            case "c":
              var rand = Math.round(Math.random());
              if (rand) {
                for (var i = 0; i < phrase.words.length; i++) {
                  if (!phrase.letters[i].guessed) {
                    phrase.checkLetter(phrase.letters[i].character);
                    break;
                  }
                }
              } else {
                console.log("cheaters never prosper.");
              }
              break;
            case "r":
              var response = await retire();
              if (response) {
                userData.losses += 1;
                library.push(entry);
                guessed = [];
                entry = library.shift();
                phrase = new Phrase(entry.word);
                hints = [];
                entry.definitions.forEach(def => {
                  hints.push("*def*\t" + def);
                });
                entry.synonyms.forEach(syn => {
                  hints.push("*syn*\t" + syn);
                });
                hints.sort(function(a, b) {
                  return Math.random() - 0.5;
                });
                attempts = 10;
                correct = phrase.checkLetter("");
              }
              break;
            case "q":
              var quit = await quitGame();
              if (quit) {
                await updateUserData();
                console.log("Goodbye.");
                process.exit(0);
              }
              break;
            default:
              console.log("I don't recognize that command");
          }
          continue;
        }
        if (guessed.includes(guess)) {
          console.log("*You've already guessed that letter. Enter -l to see the letters you've guessed*");
          continue;
        }
        guessed.push(guess);
        var meter = phrase.checkLetter(guess);
        if (meter === correct) {
          attempts--;
        }
        if (attempts === 0) {
          break;
        }
        correct = meter;
      }
      if (phrase.solved) {
        console.log("Nicely done! You got the answer!");
        console.log(phrase.words);
        userData.wins += 1;
        await appendSolvedPhrase(entry);
        play = await playAgain();
      } else {
        //say game over and prompt to play again
        console.log("too bad. you ran out of attempts!");
        userData.losses += 1;
        library.push(entry);
        console.log(phrase.words);
        play = await playAgain();
      }
    }
    updateUserData();
    console.log("goodbye.");
  } catch (err) {
    console.log(err);
  }
}

run();
