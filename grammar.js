async function grammarTableInit() {
  var div = document.getElementById('grammar');
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  document.getElementById('grammar').innerHTML += "<table class='grammar_table'> <!-- Grammar table --> </table>";
  await loadSampleGrammar();
}

async function loadSampleGrammar() {
  const url = DEBUG === true ? "http://localhost:5500/examples/regular-grammar.json" : "https://gist.githubusercontent.com/aBARICHELLO/63a8c349c0a18c6955977150975c316e/raw/a370778f975d62db27f6fefa88471ee7ff64b191/regular-grammar.json"
  const sample = await fetch(url)
    .then(response => response.json())
  loadFile(sample);
}
