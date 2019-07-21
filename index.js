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
//the Library will ignore any entries that appear in solved
function loadLibrary() {
  return new Promise(resolve => {
    fs.readFile(userFile, "utf8", function(err, data) {
      if (err) {
        console.log(err);
        resolve(err);
        return;
      }
      var arry = data.split("\n");
      arry.pop();
      arry.forEach(line => {
        if (line.trim().length === 0) return;
        var entry = JSON.parse(line);
        if (!solved.includes(entry)) {
          library.push(entry);
        }
      });
      resolve("library loaded successfully.");
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
          fs.appendFile(userFile, JSON.stringify(userData), function(err) {
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
        var arry = data
          .split("\n")
          .slice(1)
          .length();
        for (var i = 0; i < arry.length; i++) {
          solved.push(JSON.parse(arry[i]));
        }
        clearSolved();
        resolve("Nice to see you again, " + name + "!");
      }
    });
  });
}
//a function to append a solved phrase object to the user profile
function appendSolvedPhrase(object) {
  return new Promise(resolve => {
    fs.appendFile(userFile, JSON.stringify(object) + "\n", function(err) {
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
        message: "Hi. Enter your name to play the game.",
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
    inquirer.prompt({
      type
    });
  });
}
//
async function run() {
  //load the game data
  var now = new Date();
  try {
    var name = await welcome();
    var message = await loginUser(name);
    console.log(message);
    var loadMessage = await loadLibrary();
    console.log(loadMessage);
  } catch (err) {
    console.log(err);
  }
  var later = new Date();
  var loadtime = (later.getTime() - now.getTime()) / 1000; //in seconds
  console.log(loadtime);
}

run();
