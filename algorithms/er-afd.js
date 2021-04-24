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

function insertStringAt(str, insertString, position) {
  return str.slice(0, position) + insertString + str.slice(position);
}

function addOmittedConcatenation(regexStr) {
  for (let char of regexStr) {
    const charIndex = regexStr.indexOf(char);
    const nextCharIndex = charIndex+1;
    const alphanumericRegex = /[A-z]/;
    if (char.match(alphanumericRegex) && regexStr[nextCharIndex] && regexStr[nextCharIndex].match(alphanumericRegex)) {
      regexStr = insertStringAt(regexStr, ".", nextCharIndex);
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
  return Object.keys(operations.unary).includes(char);
}

function binaryOperation(char) {
  return Object.keys(operations.binary).includes(char);
}

function getOperationSymbols(str) {
  let ret = [];
  for (const char of str) {
    if (unaryOperation(char) || binaryOperation(char)) {
      ret.push(char);
    }
  }
  return ret.join("");
}

function popFront(arr) {
  const first = arr[0];
  arr.shift();
  return first;
}

function convertRegexToDFA(str) {
  const regexStr = formatRegexString(str);
  const states = removeOperationSymbols(regexStr).split("");
  const automatas = states.map(s => createBasicAutomata(s));
  const operationSymbols = getOperationSymbols(regexStr).split(""); // remove all alphanumeric

  let operatedAutomata = popFront(automatas);
  while (operationSymbols.length) {
    const op = popFront(operationSymbols);
    const fn = selectOperation(op);
    if (unaryOperation(op)) {
      operatedAutomata = fn(operatedAutomata);
    } else if (binaryOperation(op)) {
      const nextAutomata = popFront(automatas);
      operatedAutomata = fn(operatedAutomata, nextAutomata);
    } else {
      console.log('skipping unknown symbol: ' + op);
    }
  }
  console.log('operated automata', operatedAutomata);
  return operatedAutomata;
}
