async function grammarTableInit() {
  var div = document.getElementById('grammar');
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  document.getElementById('grammar').innerHTML += "<table class='grammar_table'> <!-- Grammar table --> </table>";
  await loadSampleGrammar();
}

async function loadSampleGrammar() {
  const url = DEBUG === true ? "http://localhost:5500/examples/regular-grammar.json" : "https://gist.githubusercontent.com/lzacchi/d770ee86bd436a9db9cb61981eefc0e5/raw/fe08651e729393ba4957fea1e81b81ea007f967b/regular-grammar.json"
  const sample = await fetch(url)
    .then(response => response.json())
  loadFile(sample);
  grammarToAutomata(sample);
}

function grammarToAutomata(grammar) {
  var terminal = grammar['terminal'];
  var nonTerminal = grammar['nonTerminal'];
  var productionRules = grammar['productionRules'];


  // var final_states;
  var transistions = [];

  nonTerminal.push("Final");

  // console.log(productionRules);

  // transitions
  for (const rule in productionRules) {

    for (const prod in productionRules[rule]["productions"]) {
      var from = productionRules[rule]['non_term'];

      if (productionRules[rule]["productions"][prod].length === 1) {
        var to = 'Final';
        var symbol = productionRules[rule]["productions"][prod][0];
      } else {
        var symbol = productionRules[rule]["productions"][prod][0];
        var to = productionRules[rule]["productions"][prod][1];
      }


      transistions.push({
        "from": from,
        "to": to,
        "symbol": symbol
      });

    }

  }

  // console.log(transistions);

  var automata = {
    'type': "finite-automata",
    'start': nonTerminal[0],
    'final': nonTerminal[-1],
    'states': nonTerminal,
    'transistions': transistions
  };

}
