// Fatoração de gramáticas

function splitNTandT(prod, grammar) {
  let t = "";
  let nT = "";
  for (let i = 0; i < prod.length; i++) {
    if (grammar.terminal.includes(prod[i])) {
      continue;
    } else {
      t = prod.slice(0, i);
      nT = prod.slice(i, prod.length);
      return { first: t, last: nT };
    }
  }
}

function hasOnlyTerminals(prod, grammar) {
  for (let symbol of prod) {
    if (!grammar.terminal.includes(symbol)) {
      return false;
    }
  }
  return true;
}

function addNewProduction(grammar, nonTerm, production) {
  let existingProds = grammar.productionRules.filter(p => p.non_term === nonTerm);
  if (existingProds.length === 0) {
    grammar.productionRules.push(
      {
        "non_term": nonTerm,
        "productions": [production]
      }
    );
  } else {
    existingProds[0].productions.push(production);
  }
}
function removeElement(element, list) {
  const here = list.indexOf(element);
  if (here > -1) {
    return list.splice(here, 1);
  }
}
function handleFactorButton(grammar) {
  if (grammar.type !== "regular-grammar" && grammar.type !== "free-context-grammar") {
    alert("O objeto no editor não é do tipo 'regular-grammar' ou 'free-context-grammar'. Selecione um modelo válido.");
    return false;
  }
  let newGrammar = factor(grammar);
  setEditorText(newGrammar, false);
  draw();
}
function factor(grammar) {
  const { type, terminal, nonTerminal, productionRules } = grammar;
  let newPossibleNT = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  for (const letter of nonTerminal) {
    removeElement(letter, newPossibleNT);
  }

  let newGrammar = {
    "type": type,
    "terminal": [...terminal],
    "nonTerminal": [...nonTerminal],
    "productionRules": []
  }

  for (const currentNT of nonTerminal) {
    let currentProds = productionRules.filter(p => p.non_term === currentNT)[0];
    if (currentProds === undefined) { continue; }
    if (currentProds.productions.length > 1) {
      let splittedProds = currentProds.productions.map(p => splitNTandT(p, grammar)).filter(p => p !== undefined);
      let result = splittedProds.reduce((r, a) => {
        r[a.first] = [...r[a.first] || [], a.last];
        return r;
      }, {});
      for (let key of Object.keys(result)) {
        if (result[key].length > 1) {
          // adding new NonTerminal
          let newNT = newPossibleNT.pop();
          newGrammar.nonTerminal.push(newNT);

          // adding new transition to the new NonTerminal
          addNewProduction(newGrammar, currentNT, key + newNT);

          // adding transitions from new NonTerminal
          for (let sHalf of result[key]) {
            addNewProduction(newGrammar, newNT, sHalf);
          }

        } else {
          addNewProduction(newGrammar, currentNT, key.concat(result[key][0]));
        }
      }
    } else {
      let newProd = currentProds.productions[0];
      addNewProduction(newGrammar, currentNT, newProd);
    }
  }
  return newGrammar;
}
