// Minimização de autômatos não-deterministicos

function epsilonTransitions(state, transitions) {
  // filtering epsilon transitions from 'state'
  const stateTransitions = transitions.filter(t => t.from === state && t.symbol === "&");

  if (stateTransitions.length > 0) { // if there is at least one then recall this function for each state
    let firstETrs = [...new Set(stateTransitions.map(t => t.to).sort())];
    let nextETrs = firstETrs.map(s => epsilonTransitions(s, transitions)).reduce((p, c) => p.concat(c));
    return firstETrs.concat(nextETrs);
  }
  return [];
}

function checkEpsilonTransition(transitions) {
  return transitions.some(el => el.symbol === "&");
}

function determinizeNFA(json) {
  const hasEpsilon = checkEpsilonTransition(json.transitions);
  const alphabet = [... new Set(json.transitions.map(a => a.symbol))].sort();

  const result = hasEpsilon ? withEpsilon(json, alphabet, false) : withoutEpsilon(json, alphabet);
  return result;
}

function recursiveAddState(states, list) {
  for (let q of states) {
    if (q.includes(",")) {
      recursiveAddState(q.split(","), list);
    } else {
      list.push(q);
    }
  }
}

function removeDeadStates(json) {
  let dead_sts = [];
  for (const st of json.states) {
    if (!json.final.includes(st)) {
      let sts = json.transitions.filter(e => e.to !== st && e.from === st);
      if (sts.length < 1) {
        dead_sts.push(st);
      }
    }
  }
  // removing transitions to unreachable states
  for (const st of dead_sts) {
    let sts = json.transitions.filter(e => e.to === st);
    if (sts.length > 0) {
      sts.map(t => {
        const here = json.transitions.indexOf(t);
        if (here > -1) {
          json.transitions.splice(here, 1);
        }
      });
    }
  }

  // removing state from list of states
  dead_sts.map(s => {
    const here = json.states.indexOf(s);
    if (here > -1) {
      json.states.splice(here, 1);
    }
  });
}

function removeUnreachableStates(json) {
  let checkedStates = [];
  let pendingStates = [json.start];
  for (let st of pendingStates) {
    if (checkedStates.includes(st)) { continue }
    if (st.includes(",")) {
      st.split(",").map(s => json.transitions.filter(t => t.from === s).map(t => pendingStates.push(t.to))); // parei aqui na parte de fazer cada letra do estado
    } else {
      json.transitions.filter(t => t.from === st).map(t => pendingStates.push(t.to)); // parei aqui na parte de fazer cada letra do estado
    }

    checkedStates.push(st); // current state done
    checkedStates = [...new Set(checkedStates)].sort(); // removing duplicates

    pendingStates = [...new Set(pendingStates)].sort(); // removing duplicates
    removeElement(st, pendingStates);  // removing current state from pending list


  }
  // removing unreachable states
  let unreachableStates = json.states.filter(state => !checkedStates.includes(state));
  unreachableStates.map(s => removeElement(s, json.states));
  json.transitions.map(t => {
    if (unreachableStates.includes(t.to) || unreachableStates.includes(t.from)) {
      removeElement(t, json.transitions);
    }
  })
  loadFile(json);
}

function prepareNFA(json, alphabet) {
  for (let letter of alphabet) {
    if (letter !== "&") {
      json.states.map(s => {
        let trs = json.transitions.filter(t => t.from === s && t.symbol === letter);
        if (trs.length > 1) {
          let new_state = trs.map(t => t.to);
          let new_transition = { "from": s, "to": new_state.sort().join(","), "symbol": letter };
          if (!json.transitions.includes(new_transition)) {
            // adding transition with [q0,q1,...,qn] instead of n transitions
            json.transitions.push(new_transition);

            // removing n transitions
            trs.map(t => {
              const here = json.transitions.indexOf(t);
              if (here > -1) {
                json.transitions.splice(here, 1);
              }
            });
          }
        }
      });
    }
  }
}

function withoutEpsilon(json, alphabet) {
  // creating new empty DFA with start state
  let new_dfa = {
    "type": "finite-automata",
    "start": json.start,
    "final": [],
    "states": [],
    "transitions": []
  };

  prepareNFA(json, alphabet);  // Prepare NFA adding states like [q1,...,qN] and removing N transitions

  let pending_new_states = [];  // list of new states to include in new_dfa

  pending_new_states.push(json.start);  // start with the start state of NFA

  while (pending_new_states.length > 0) {
    let qi = pending_new_states.pop();
    if (qi.includes(",")) { // dealing with 'multistate' (?)
      qi = qi.split(",").sort();
    }

    // Calculate transitions from qi state for each transition symbol
    for (const letter of alphabet) {
      if (typeof qi === "string") { // case simple state
        let new_trs = json.transitions.filter(t => t.from === qi && t.symbol === letter);
        if (new_trs.length > 0) {
          new_trs = new_trs[0];
          // verify if new state exists else add to new states list
          if (!new_dfa.states.includes(new_trs.to) && !pending_new_states.includes(new_trs.to)) {
            pending_new_states.push(new_trs.to);
          }
          let new_transition = { "from": qi, "to": new_trs.to, "symbol": letter };

          if (new_dfa.transitions.filter(t => t.from === qi && t.to === new_trs.to && t.symbol === letter).length < 1) { // verifying if already has this transition
            new_dfa.transitions.push(new_transition); // adding new transition
          }
          new_dfa.states.push(qi); // adding new state
          new_dfa.states = [... new Set(new_dfa.states.sort())]; // sorting states and removing duplicates
        }

      } else { // case multi states

        let new_trs = [];
        for (const q of qi) {
          let new_multi_trs = json.transitions.filter(t => t.from === q && t.symbol === letter);
          new_multi_trs.map(t => new_trs.push(t));
        }
        new_trs = [... new Set(new_trs)].sort(); // sorting states and removing duplicates
        if (new_trs.length > 0) {
          let new_state = [...new Set(new_trs.map(t => t.to).map(e => e.split(",")).reduce(function (prev, curr) { return prev.concat(curr) }))].sort();
          // verify if new state exists else add to new states list
          if (!new_dfa.states.includes(new_state.sort().join(",")) && !pending_new_states.includes(new_state.sort().join(","))) {
            pending_new_states.push(new_state.sort().join(","));
          }
          let new_transition = { "from": qi.sort().join(","), "to": new_state.join(","), "symbol": letter };

          if (new_dfa.transitions.filter(t => t.from === qi.sort().join(",") && t.to === new_state.join(",") && t.symbol === letter).length < 1) { // verifying if already has this transition
            new_dfa.transitions.push(new_transition); // adding new transition
          }
          new_dfa.states.push(qi.sort().join(",")); // adding new state
          new_dfa.states = [... new Set(new_dfa.states.sort())]; // sorting states and removing duplicates
        }
      }
    }
    pending_new_states = pending_new_states.filter(s => typeof s !== "undefined");
  }
  // setting the final states
  new_dfa.states.map(s => {
    if (s.includes(",")) {
      s.split(",").map(t => {
        if (json.final.includes(t)) {
          new_dfa.final.push(s);
          new_dfa.final = [...new Set(new_dfa.final)].sort();
        }
      })

    } else {
      if (json.final.includes(s)) {
        new_dfa.final.push(s);
        new_dfa.final = [...new Set(new_dfa.final)].sort();
      }
    }
  });

  // load file to board
  loadFile(new_dfa, false);
  return new_dfa;
}

function removeElement(element, list) {
  const here = list.indexOf(element);
  if (here > -1) {
    return list.splice(here, 1);
  }
}

function makeEpsilonClosure(json) {
  const ret = {};
  for (const state of json.states) {
    const epsilon = epsilonTransitions(state, json.transitions);
    epsilon.push(state);
    ret[state] = [...new Set(epsilon)].sort();
  }
  return ret;
}

function withEpsilon(json, alphabet, loadFile = true) {
  const epsilonTable = makeEpsilonClosure(json);
  let new_start = [... new Set(epsilonTable[json.start].sort())].join(",");

  // creating new empty DFA with start state
  let new_dfa = {
    "type": "finite-automata",
    "start": new_start,
    "final": [],
    "states": [],
    "transitions": []
  };
  prepareNFA(json, alphabet);  // Prepare NFA adding states like [q1,...,qN] and removing N transitions
  let pending_new_states = [];  // list of new states to include in new_dfa

  pending_new_states.push(new_start);  // start with the start state of NFA

  while (pending_new_states.length > 0) {
    let qi = pending_new_states.pop();
    if (qi.includes(",")) { // dealing with 'multistate' (?)
      qi = qi.split(",").sort();
    }

    // Calculate transitions from qi state for each transition symbol
    for (const letter of alphabet) {
      if (letter === "&") { continue; } // ignoring epsilon transitions

      if (typeof qi === "string") { // case simple state
        let new_trs = json.transitions.filter(t => t.from === qi && t.symbol === letter);
        if (new_trs.length > 0) {
          new_trs = new_trs[0].to;
          // could use if
          new_trs = new_trs.split(",").map(t => epsilonTable[t]);
          let new_state = [];
          recursiveAddState(new_trs, new_state);
          new_state = [...new Set(new_state)].sort().join(",");

          // verify if new state exists else add to new states list
          if (!new_dfa.states.includes(new_state) && !pending_new_states.includes(new_state)) {
            pending_new_states.push(new_state);
          }
          let new_transition = { "from": qi, "to": new_state, "symbol": letter };

          if (new_dfa.transitions.filter(t => t.from === qi && t.to === new_state && t.symbol === letter).length < 1) { // verifying if already has this transition
            new_dfa.transitions.push(new_transition); // adding new transition
          }
          new_dfa.states.push(qi); // adding new state
          new_dfa.states = [... new Set(new_dfa.states.sort())]; // sorting states and removing duplicates
        } else {
          if (!new_dfa.states.includes(qi)) {
            new_dfa.states.push(qi);
          }
        }

      } else { // case multi states

        let new_trs = [];
        for (const q of qi) {
          let new_multi_trs = json.transitions.filter(t => t.from === q && t.symbol === letter);
          new_multi_trs.map(t => new_trs.push(t));
        }
        new_trs = [... new Set(new_trs)].sort(); // sorting states and removing duplicates

        // checking if has at least one transition from 'qi' by 'letter'
        if (new_trs.length > 0) {
          let new_state = [];

          recursiveAddState(new_trs.map(t => t.to), new_state);
          new_state = [...new Set(new_state.map(t => epsilonTable[t]))].sort().join(",");

          // verify if new state exists else add to new states list
          if (!new_dfa.states.includes(new_state) && !pending_new_states.includes(new_state)) {
            pending_new_states.push(new_state);
          }
          let new_transition = { "from": qi.sort().join(","), "to": new_state, "symbol": letter };

          if (new_dfa.transitions.filter(t => t.from === qi.sort().join(",") && t.to === new_state && t.symbol === letter).length < 1) { // verifying if already has this transition
            new_dfa.transitions.push(new_transition); // adding new transition
          }
          new_dfa.states.push(qi.sort().join(",")); // adding new state
          new_dfa.states = [... new Set(new_dfa.states.sort())]; // sorting states and removing duplicates
        } else {
          if (!new_dfa.states.includes(qi.sort().join(","))) {
            new_dfa.states.push(qi.sort().join(","));
          }
        }
      }
    }
    pending_new_states = pending_new_states.filter(s => typeof s !== "undefined");
  }

  // setting the final states
  new_dfa.states.map(s => {
    if (s.includes(",")) {
      s.split(",").map(t => {
        if (json.final.includes(t)) {
          new_dfa.final.push(s);
          new_dfa.final = [...new Set(new_dfa.final)].sort();
        }
      })

    } else {
      if (json.final.includes(s)) {
        new_dfa.final.push(s);
        new_dfa.final = [...new Set(new_dfa.final)].sort();
      }
    }
  });

  if (loadFile) {
    loadFile(new_dfa, false);
  }
  return new_dfa;
}

function minimizeDFA(json) {
  const alphabet = [... new Set(json.transitions.map(a => a.symbol))].sort();
  const isNFA = checkEpsilonTransition(json.transitions);
  if (isNFA) {
    determinizeNFA(json); // then transform NFA to DFA
  }
  removeUnreachableStates(json);
  return json
}
