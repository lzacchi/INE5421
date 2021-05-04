// União de autômatos

function union(automataA, automataB) {
  const oldStartStates = [automataA.start, automataB.start];
  const oldFinalStates = automataA.final.concat(automataB.final);

  const rand = getRandomInt(100000);
  const newStartName = `q0-new-${rand}`;
  const newFinalName = `qf-new-${rand}`;

  const newAutomata = {
    "type": "finite-automata",
    "start": newStartName,
    "final": [
      newFinalName,
    ],
    "states": [newStartName, newFinalName].concat(automataA.states, automataB.states),
    "transitions": automataA.transitions.concat(
      automataB.transitions,

      // q0-new to old start states by &
      oldStartStates.map((oldStart) => {
        return {
          "from": newStartName,
          "to": oldStart,
          "symbol": "&"
        };
      }),

      // old final to new final by &
      oldFinalStates.map((oldFinal) => {
        return {
          "from": oldFinal,
          "to": newFinalName,
          "symbol": "&",
        };
      })
    )
  }

  setEditorText(newAutomata);
  drawFiniteAutomata();
  return newAutomata;
}
