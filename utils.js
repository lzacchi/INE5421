function reverseString(str) {
  var splitString = str.split("");
  var reverseArray = splitString.reverse();
  var joinArray = reverseArray.join("");
  return joinArray;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
