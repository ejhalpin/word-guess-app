const Letter = require("./letter.js");

const Phrase = function(string) {
  this.letters = [];
  this.solved = false;
  this.words = string;
  //break the string into the individual characters and pass them into the Letter constructor.
  string.forEach(char => {
    this.letters.push(new Letter(char));
  });
};

Phrase.prototype.getString = function() {
  var string = "";
  this.letters.forEach(letter => {
    string += letter.getLetter();
  });
  return string;
};

Phrase.prototype.checkLetter = function(character) {
  var count = 0;
  this.letters.forEach(letter => {
    letter.check(character);
    if (letter.guessed) {
      count++;
    }
  });
  if (count === this.letters.length) {
    this.solved = true;
  }
};
