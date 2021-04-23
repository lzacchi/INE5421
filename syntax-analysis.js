function analysePseudoCode() {
  const pseudocodeLexems = document.getElementById("pseudocode-input").value.replaceAll("\n", " ").split(" ").filter(l => l !== "");
  const { tokens } = activeJSON();
  const regexes = Object.keys(tokens);
  const automatas = regexes.map(r => {
    let automata = convertRegexToDFA(r);
    automata["label"] = tokens[r];
    return automata;
  });
  const typedTokens = verifySyntax(pseudocodeLexems, automatas);
  console.log(typedTokens);
  // to-do print table of lexemes and his type using typedTokens

}

// loops through automata to find which one fits
// returns a map of (token -> type)
function verifySyntax(lexemes, automatas) {
  const typedTokens = {};

  for (const lexeme of lexemes) {
    for (const automata of automatas) {
      const match = verify(automata, lexeme);
      if (match) {
        typedTokens[lexeme] = automata["label"];
        break;
      }
    }
  }
  return typedTokens;
}

async function syntaxAnalysisInit() {
  const url =
    DEBUG === true
      ? "http://localhost:5501/examples/pseudocode.d"
      : "https://trocar-pra-gist-depois.com";

  const pseudocode = await fetch(url).then((response) => response.text());
  document.getElementById('pseudocode-input').value = pseudocode;
}

async function loadSyntaxAnalysisExamples() {
  const url =
    DEBUG === true
      ? "http://localhost:5501/examples/pseudocode.json"
      : "https://trocar-pra-gist-depois.com";
  const sample = await fetch(url).then((response) => response.json());
  loadFile(sample);
}
