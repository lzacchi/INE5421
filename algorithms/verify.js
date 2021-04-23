// generic verification function
function verify(json, testedString) {
  var state = json.start;
  for (const char of testedString) {
    const transitionsFromThisState = json.transitions.filter(t => t.from === state);
    const nextState = transitionsFromThisState.filter(t => t.symbol === char);
    if (!nextState) {
      break;
    }
    state = nextState[0].to;
  }
  return json.final.includes(state);
}

// verify the current automata in display
function verifyEditorAutomata() {
  const json = activeJSON();
  const testedString = editor2.getValue();
  if (json.type !== "finite-automata") {
    triggerToast("Erro", "Operação não suportada para os tipos de linguagem selecionados")
    return;
  }

  const valid = verify(json, testedString);
  const title = valid ? "Sucesso" : "Erro";
  const neg = !valid ? "não " : "";
  const msg = `O autômato ${neg} reconhece a String`;
  triggerToast(title, msg);
}
