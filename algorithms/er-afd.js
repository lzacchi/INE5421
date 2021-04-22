const operations = {
  unary: {
    "+": "non-empty-closure",
    "*": "closure",
  },
  binary: {
    ".": "concatenation",
    "|": "or"
  }
}

// * ->
// + ->
function remapSymbols() {

}

function insertStringAt(str, insertString, position) {
  return str.slice(0, position) + insertString + str.slice(pos);
}

function addOmittedConcatenation(regexStr) {
  for (char of regexStr) {
    const charIndex = regexStr.indexOf(char);
    const nextCharIndex = charIndex+1;
    const alphanumericRegex = /[A-z]/;
    if (char.match(alphanumericRegex) && regexStr.at(nextCharIndex).match(alphanumericRegex)) {
      insertStringAt(regexStr, ".", nextCharIndex);
    }
  }
  return regexStr;
}

// Add omitted operations (.)
// Ex: (ab+a)* to (a.b+a)*
function formatRegexString(regexStr) {
  regexStr = addOmittedConcatenation(regexStr);
  return regexStr;
}

// todo: support parenthesis
// function computeParenthesis(regexStr) {
//   var group = regexStr.match(/\(.+\).{1}/)[0];
//   if (group) {
//   } else {
//     group = regexStr;
//   }
//   return group;
// }

function createBasicAutomata(symbol) {
  const states = [`start-${symbol}`,`final-${symbol}` ];
  return {
    "type": "finite-automata",
    "start": states[0],
    "final": [states[1]],
    "states": states,
    "transitions": [
      {
        "from": states[0],
        "to": states[1],
        "symbol": symbol,
      }
    ],
  }
}

function removeOperationSymbols(str) {
  return str.replaceAll(/\||\*|\.|\+|\(|\)/g, "");
}

function selectOperation(char) {
  switch (char) {
    case ".": return concatenation;
    case "|": return union;
    case "+": return closurePlus;
  }
}

function unaryOperation(char) {
  if (char in Object.keys(operations.unary)) {
    return true;
  }
  if (char in Object.keys(operations.binary)) {
    return false;
  }
  return null;
}

function removeAlphanumeric(str) {
  return str.replaceAll(/[A-z0-9]|\(|\)/g, "");
}

function convertRegexToDFA(str) {
  const regexStr = reverseString(str);
  const states = removeOperationSymbols(regexStr).split("");
  const automatas = states.map(s => createBasicAutomata(s));
  const operationSymbols = removeAlphanumeric(regexStr).split(""); // remove all alphanumeric

  var operatedAutomata = automatas.pop();
  while (operationSymbols.length) {
    const op = operationSymbols.pop();
    const fn = selectOperation(op);
    if (unaryOperation(op)) {
      operatedAutomata = fn(operatedAutomata);
    } else {
      const nextAutomata = automatas.pop();
      operatedAutomata = fn(operatedAutomata, nextAutomata);
    }
  }
  console.log(operatedAutomata);
}
