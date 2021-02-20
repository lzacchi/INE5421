function loadRegularGrammar() {
}

async function grammarTableInit() {

  var div = document.getElementById('grammar');
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  document.getElementById('grammar').innerHTML += "<table class='grammar_table'></table>";

  await loadSampleGrammar();
  const { terminal, nonTerminal, productionRules } = activeJSON;
  let table = document.querySelector("table");
  for (const rule of productionRules) {
    let row = table.insertRow();

    for (var key in rule["non_term"]) {

      let cell = row.insertCell();
      let content = rule["non_term"][key] + " 🠒 " + rule['productions'].join(" | ");

      let text = document.createTextNode(content);
      cell.appendChild(text);
    }
  }
}

async function loadSampleGrammar() {
  const sample = await fetch('http://localhost:5500/examples/regular-grammar.json')
    .then(response => response.json())
  loadFile(JSON.stringify(sample));
}
