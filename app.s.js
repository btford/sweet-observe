/**
 * Poor man's Object.observe with sweet.js
 * http://sweetjs.org/
 */

macro change_helper {
  case ($processed ...) ($rest) => {
    this._changed.$processed (.) ... = this._changed.$processed (.) ... || {}
  }
  case ($processed ...) ($rest_head $rest ...) => {
    this._changed.$processed (.) ... = this._changed.$processed (.) ... || {}
    change_helper ($processed ... $rest_head) ($rest ...)
  }
}

macro this_ {
  case ($x = $val) => {
    $x = $val;
  }
  case ($head . $rest (.) ... = $val) => {
    change_helper ($head) ($rest ...);
    this._changed.$head . $rest (.) ... = $val;
    this.$head . $rest (.) ... = $val
  }
}


/**
 * Model
 */

var Model = function () {
  this.x = {y: {z: 1}};
  this._changed = {};
};

Model.prototype.test = function () {
  this_(x.y.z = 20);
}

Model.prototype.getChanges = function () {
  var changed = this._changed;
  this._changed = {};
  return changed;
}


/**
 * Test
 */

var x = new Model();
x.test();

console.log(x);
console.log(x.getChanges());
