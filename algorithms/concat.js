function concatenation(automataA, automataB) {
  aFinal = automataA.final;
  bStart = automataB.start;
  const newAutomata = {
    "type": "finite-automata",
    "start": automataA.start,
    "final": automataB.final,
    "states": automataA.states.concat(automataB.states),
    "transitions": automataA.transitions.concat(
      aFinal.map((finalState) => {
        return {
          "from": finalState,
          "to": bStart,
          "symbol": "&"
        };
      }),
      automataB.transitions
    )
  };

  setEditorText(newAutomata);
  drawFiniteAutomata();
  return newAutomata;
}