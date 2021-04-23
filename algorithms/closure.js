function closureStar(automata) {
  return closure(automata, true);
}

function closurePlus(automata) {
  return closure(automata, false);
}

function closure(automata, star = true) {
  const ogStart = [automata.start];
  const ogFinal = automata.final;

  const rand = getRandomInt(100000);
  const newStartName = `q0-new-${rand}`;
  const newAutomata = {
    "type": "finite-automata",
    "start": newStartName,
    "final": star ? automata.final.concat(newStartName) : automata.final,

    "states": [newStartName].concat(automata.states),
    "transitions": automata.transitions.concat(

      ogStart.map((startState) => {
        return {
          "from": newStartName,
          "to": startState,
          "symbol": "&"
        };
      }),

      ogFinal.map((finalState) => {
        return {
          "from": finalState,
          "to": newStartName,
          "symbol": "&",
        };
      })
    )
  }
  setEditorText(newAutomata);
  drawFiniteAutomata();
  return newAutomata;
}
