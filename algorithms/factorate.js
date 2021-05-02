function splitNTandT(prod, grammar) {
  let t = "";
  let nT = "";
  for (let i=0; i < prod.length; i++) {
    if (grammar.terminal.includes(prod[i])) {
      continue;
    } else {
      t = prod.slice(0, i);
      nT = prod.slice(i, prod.length);
      return {first: t, last: nT};
    }
  }
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

function factorate(grammar) {
  console.log("inicial", grammar);
  const {type, terminal, nonTerminal, productionRules} = grammar;
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
  // pra cada não terminal
  for (const currentNT of nonTerminal) {
    // analisar cada produção dele
    let currentProds = productionRules.filter(p => p.non_term === currentNT)[0];
		if (currentProds === undefined) {continue;}
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
          addNewProduction(newGrammar, currentNT, key+newNT);

          // adding transitions from new NonTerminal
          for (let sHalf of result[key]) {
            addNewProduction(newGrammar, newNT, sHalf);
          }

        } else {
          addNewProduction(newGrammar, currentNT, key.concat(result[key][0]));
        }
      }
    }
  }
  return newGrammar;  
}
console.log("final",factorate(grammar));
