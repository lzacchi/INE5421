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
    "final": states[1],
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
  for (unarySymbol in operations.unary) {
    str = str.replace(unarySymbol, "");
  }
  for (binarySymbol in operations.binary) {
    str = str.replace(binarySymbol, "");
  }
  return str;
}

function selectOperation(char) {
  switch (char) {
    case ".": return concatenation;
    case "|": return union;
  }
}

function convertRegexToDFA(regexStr) {
  const states = removeOperationSymbols(regexStr).split("");
  const automatas = states.map(s => createBasicAutomata(s));
  console.log(automatas);

  const operations = regexStr.replaceAll(/[A-z]/g, "").split(""); // remove all alphanumeric

  var operatedAutomata = automatas.pop();
  while (operations.length) {
    const op = operations.pop();
    const fn = selectOperation(op);
    const nextAutomata = automatas.pop();
    fn(operatedAutomata, nextAutomata);
  }
  console.log(operatedAutomata);
}
