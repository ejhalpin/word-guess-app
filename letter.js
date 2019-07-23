//a constructor for the letter type
function Letter(l) {
  this.character = l;
  this.guessed = false;
  this.display = "_";
  //a simple validation routine to handle characters non-alpha characters
  var validationString = " '\"?.-&(),/:;+=<>";
  if (validationString.includes(this.character)) {
    this.display = l;
    this.guessed = true;
  }
}
//getLetter returns the display value, either the character itself or "_", depending on the value of guessed
Letter.prototype.getLetter = function() {
  return this.display;
};
//check takes in a guess and updated the Letter object as necessary. If guess matches the underlying character,
//guessed is updated to true and
Letter.prototype.check = function(character) {
  if (this.guessed) return;
  if (character.toLowerCase().trim() === this.character.toLowerCase()) {
    this.guessed = true;
    this.display = this.character;
  }
};

module.exports = Letter;
