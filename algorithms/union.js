function union(automataA, automataB) {
  const oldStartStates = [automataA.start, automataB.start];
  const oldFinalStates = automataA.final.concat(automataB.final);
  const newAutomata = {
    "type": "finite-automata",
    "start": "q0-new",
    "final": [
      "qf-new",
    ],
    "states": ["q0-new","qf-new"].concat(automataA.states, automataB.states),
    "transitions": automataA.transitions.concat(
      automataB.transitions,

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
  drawFiniteAutomata();
  return newAutomata;
}
