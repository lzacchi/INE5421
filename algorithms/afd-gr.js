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
        var symbol = productionRules[rule]["productions"][prod][0];
        var to = productionRules[rule]["productions"][prod][1];
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
}
