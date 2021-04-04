function verify() {
  const json = activeJSON();
  const editorText = editor2.getValue();
  if (json.type !== "finite-automata") {
    triggerToast("Erro", "Operação não suportada para os tipos de linguagem selecionados")
    return;
  }

  var state = json.start;
  for (const char of editorText) {
    const transitionsFromThisState = json.transitions.filter(t => t.from === state);
    const nextState = transitionsFromThisState.filter(t => t.symbol === char);
    if (!nextState) {
      break;
    }
    state = nextState[0].to;
  }
  const valid = json.final.includes(state);
  const title = valid ? "Sucesso" : "Erro";
  const neg = !valid ? "não " : "";
  const msg = `O autômato ${neg}reconhece a String`;
  triggerToast(title, msg);
}
