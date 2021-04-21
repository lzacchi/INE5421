function closure(automata, star = true) {
  const ogStart = [automata.start];
  const ogFinal = automata.final;

  const newAutomata = {
    "type": "finite-automata",
    "start": "q0-new",
    "final": star ? automata.final.concat("q0-new") : automata.final,

    "states": ["q0-new"].concat(automata.states),
    "transitions": automata.transitions.concat(

      ogStart.map((startState) => {
        return {
          "from": "q0-new",
          "to": startState,
          "symbol": "&"
        };
      }),

      ogFinal.map((finalState) => {
        return {
          "from": finalState,
          "to": "q0-new",
          "symbol": "&",
        };
      })
    )
  }
  setEditorText(newAutomata);
  drawFiniteAutomata();
  return newAutomata;
}