function loadRegularGrammar() {
}

async function grammarTableInit() {

  var div = document.getElementById('grammar');
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  document.getElementById('grammar').innerHTML += "<table class='grammar_table'> <!-- Grammar table --> </table>";

  await loadSampleGrammar();
  const { terminal, nonTerminal, productionRules } = activeJSON();
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
  const url = DEBUG === true ? "http://localhost:5500/examples/regular-grammar.json" : "https://raw.githubusercontent.com/lzacchi/INE5421/master/examples/regular-grammar.json?token=AD7KBVVXPKGGEDTHPECONQDAHQFHC"
  const sample = await fetch(url)
    .then(response => response.json())
  loadFile(sample);
}
