function grammarToAutomata() {
  var grammar = activeJSON();
  var nonTerminal = grammar["nonTerminal"];
  var productionRules = grammar["productionRules"];

  var transistions = [];

  nonTerminal.push("Final");

  // transitions
  for (const rule in productionRules) {
    for (const prod in productionRules[rule]["productions"]) {
      var from = productionRules[rule]["non_term"];

      if (productionRules[rule]["productions"][prod].length === 1) {
        var to = "Final";
        var symbol = productionRules[rule]["productions"][prod][0];
      } else {
        symbol = productionRules[rule]["productions"][prod][0];
        to = productionRules[rule]["productions"][prod][1];
      }

      transistions.push({
        from: from,
        to: to,
        symbol: symbol,
      });
    }
  }

  var automata = {
    type: "finite-automata",
    start: nonTerminal[0],
    final: [nonTerminal[nonTerminal.length - 1]],
    states: nonTerminal,
    transitions: transistions,
  };

  setEditorText(automata);
  drawFiniteAutomata();
  showAutomata();
}

function automataToGrammar() {

  var automata = activeJSON();

  var grammar = {
    "type": "regular-grammar",
    "terminal": [],
    "nonTerminal": automata.states,
    "productionRules": []
  }


  for (const transition in automata.transitions) {
    grammar.terminal.push(automata.transitions[transition].symbol);
    var rule = {
      "non_term" : automata.transitions[transition].from,
      "productions": [automata.transitions[transition].symbol + automata.transitions[transition].to]
    }
    const ruleIndex = grammar.productionRules.findIndex((el) => el.non_term === rule.non_term)
    if (ruleIndex === -1) {
      grammar.productionRules.push(rule);
    } else {
      grammar.productionRules[ruleIndex].productions = grammar.productionRules[ruleIndex].productions.concat(rule.productions);
    }
  }

  grammar['terminal'] = [...new Set(grammar.terminal)];
  // console.log(grammar);

  setEditorText(grammar);
  drawGrammar();
  showGrammar();

}
