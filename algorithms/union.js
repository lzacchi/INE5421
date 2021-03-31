function union() {
  const json = activeJSON();
  const editorText = document.getElementById("second-editor").value;
  const inputJSON = JSON.parse(editorText);
  if (json.type !== "finite-automata" || inputJSON.type !== "finite-automata") {
    triggerToast("Erro", "Operação não suportada para os tipos de linguagem selecionados")
    return;
  }

  const oldStartStates = [json.start, inputJSON.start];
  const oldFinalStates = json.final.concat(inputJSON.final);
  const newAutomata = {
    "type": "finite-automata",
    "start": "q0-new",
    "final": [
      "qf-new",
    ],
    "states": ["q0-new","qf-new"].concat(json.states),
    "transitions": json.transitions.concat(
      // q0-new to old start states by &
      oldStartStates.map((oldStart) => {
        return {
          "from": "q0-new",
          "to": oldStart,
          "symbol": "&"
        };
      }),

      // old final to new final by &
      oldFinalStates.map((oldFinal) => {
        return {
          "from": oldFinal,
          "to": "qf-new",
          "symbol": "&",
        };
      })
    )
  }

  setEditorText(newAutomata);
}
