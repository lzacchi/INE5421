async function grammarTableInit() {
  var div = document.getElementById("grammar");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  document.getElementById("grammar").innerHTML +=
    "<table class='grammar_table'> <!-- Grammar table --> </table>";
}

async function loadSampleGrammar() {
  const url =
    DEBUG === true
      ? "http://localhost:5500/examples/regular-grammar.json"
      : "https://gist.githubusercontent.com/lzacchi/d770ee86bd436a9db9cb61981eefc0e5/raw/fe08651e729393ba4957fea1e81b81ea007f967b/regular-grammar.json";
  const sample = await fetch(url).then((response) => response.json());
  loadFile(sample);
}
