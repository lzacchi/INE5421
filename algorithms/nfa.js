function epsilonTransitions(state, transitions) {
  // filtering epsilon transitions from 'state'
  const stateTransitions = transitions.filter(t => t.from === state && t.symbol === "&");

  if (stateTransitions.length > 0) { // if there is at least one then recall this function for each state
    let firstETrs = [...new Set(stateTransitions.map(t => t.to).sort())];
    let nextETrs = firstETrs.map(s => epsilonTransitions(s, transitions)).reduce((p,c) => p.concat(c));
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

  if (hasEpsilon) {
    withEpsilon(json, alphabet);
  } else {
    withoutEpsilonAGORAVAI(json, alphabet);
  }
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
  dead_sts.map( s => {
    const here = json.states.indexOf(s);
    if (here > -1) {
      json.states.splice(here, 1);
    }
    });
}

function removeUnreachableStates(json) {
  let globalReachable = [];
  let checkedStates = [];
  let pendingStates = [json.start];
    for (let st of pendingStates) {
      if (checkedStates.includes(st)) {continue};
      let currStates;
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
      removeElement(t ,json.transitions);
    }
  })
  loadFile(json);
}

function withoutEpsilon(json, alphabet) {
  for (let st of json.states) {
    for (let sym of alphabet) {
      let pending_states = [];
      let finished_states = [];
      let newTransition = json.transitions.filter( tr => tr.from === st && tr.symbol === sym);
      if (newTransition.length > 1) {
        let newState = newTransition.map(t => t.to);
        newState = [... new Set(newState)].sort();
        // json.states.push(newState.join(","));
        pending_states.push(newState.join(","));
        // adding transition to new state
        let n_t = {"from": st, "to": newState.join(","), "symbol": sym }
        if (!json.transitions.includes(n_t)) {
          json.transitions.push(n_t);
        }
        newTransition.map(t => {const here = json.transitions.indexOf(t); if (here > -1){json.transitions.splice(here, 1);} });

        while (pending_states.length > 0) {
          // console.log(pending_states);
          let _state = pending_states.pop().split(",").sort();
          let new_trs = [];
          for (let st_ of _state) {
            let n_sinks = json.transitions.filter(tr => tr.from === st_ && tr.symbol === sym);
            // n_sinks = n_sinks.map(a => a.to.includes(",") ? a.to.split(",") : a.to);
            n_sinks = n_sinks.map(a => a.to);
            // new_trs.push([... new Set(n_sinks)]);
            recursiveAddState(n_sinks, new_trs);
          }
          new_trs = [...new Set(new_trs)].sort();

          // adding new state
          if (!pending_states.includes(new_trs.join(",")) && !finished_states.includes(new_trs.join(","))) {
            pending_states.push(new_trs.join(","));
            json.states.push(new_trs.join(","));
            // adding new state transition
            json.transitions.push({"from": _state.join(","), "to": new_trs.join(",") , "symbol": sym });
          }
          if (!finished_states.includes(_state.join(","))) {
            finished_states.push(_state.join(","));
          }
          // console.log(finished_states);
          // console.log(pending_states);
        }
      }
      //  DEBUG
      if (st === "q1,q2" && sym === "1") {
        console.log("AQUI BROTHER DEBUGA AQUI");
      }
    }

    const sts_ = st.split(",");
    if (sts_.length > 1) {
      sts_.map(e => {
        if (json.final.includes(e)) {
          json.final.push(st);
        }
      });
    }
  }
  json.states = [...new Set(json.states)];
  removeUnreachableStates(json);
  // every new state is ~done~ everything is shit everything is wrong
  // transition maybe not ok
  // to-do: remove dead, unreachable and redundant states
  loadFile(json, false);
}
function prepareNFA(json, alphabet) {
    for (let letter of alphabet) {
      if (letter !== "&") {
        json.states.map(s => {
          let trs = json.transitions.filter(t => t.from === s && t.symbol === letter);
          if (trs.length > 1) {
            let new_state = trs.map(t => t.to);
            let new_transition = {"from": s, "to": new_state.sort().join(","), "symbol": letter};
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

function withoutEpsilonAGORAVAI(json, alphabet) {
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

  while(pending_new_states.length > 0) {
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
          let new_transition = {"from": qi, "to":new_trs.to, "symbol": letter};

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
          let new_state = [...new Set(new_trs.map(t => t.to).map(e => e.split(",")).reduce(function (prev, curr) {return prev.concat(curr)}))].sort();
          // verify if new state exists else add to new states list
          if (!new_dfa.states.includes(new_state.sort().join(",")) && !pending_new_states.includes(new_state.sort().join(","))) {
            pending_new_states.push(new_state.sort().join(","));
          }
          let new_transition = {"from": qi.sort().join(","), "to":new_state.join(","), "symbol": letter};

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
  // checking huge names

  // load file to board
  loadFile(new_dfa, false);
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

function withEpsilon(json, alphabet) {
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
  // ISSO VAI JUNTAR AS TRANSIÇÃO EPSILON NÉ? (talvez tenha que adaptar )
  prepareNFA(json, alphabet);  // Prepare NFA adding states like [q1,...,qN] and removing N transitions

  let pending_new_states = [];  // list of new states to include in new_dfa

  // could use 'if' to avoid double code
  pending_new_states.push(new_start);  // start with the start state of NFA

  while(pending_new_states.length > 0) {
    let qi = pending_new_states.pop();
    if (qi.includes(",")) { // dealing with 'multistate' (?)
      qi = qi.split(",").sort();
    }

    // Calculate transitions from qi state for each transition symbol
    for (const letter of alphabet) {
      if (letter === "&") {continue;} // ignoring epsilon transitions

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
          let new_transition = {"from": qi, "to":new_state, "symbol": letter};

          if (new_dfa.transitions.filter(t => t.from === qi && t.to === new_state && t.symbol === letter).length < 1) { // verifying if already has this transition
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

        // checking if has at least one transition from 'qi' by 'letter'
        if (new_trs.length > 0) {
          let new_state = [];

          recursiveAddState(new_trs.map(t => t.to), new_state);
          new_state = [...new Set(new_state.map(t => epsilonTable[t]))].sort().join(",");


          // let new_state = [...new Set(new_trs.map(t => t.to).map(e => e.split(",")).reduce(function (prev, curr) {return prev.concat(curr)}))].sort();
          // verify if new state exists else add to new states list
          if (!new_dfa.states.includes(new_state) && !pending_new_states.includes(new_state)) {
            pending_new_states.push(new_state);
          }
          let new_transition = {"from": qi.sort().join(","), "to":new_state, "symbol": letter};

          if (new_dfa.transitions.filter(t => t.from === qi.sort().join(",") && t.to === new_state && t.symbol === letter).length < 1) { // verifying if already has this transition
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
  // removing huge name states
  const hugeNameStates = new_dfa.states.filter(s => s.length > 40);
  hugeNameStates.map(
    state => {
        // troca por um nome aleatório aí
        const randId = getRandomInt(666);
        const newStateRand = `newState-${randId}`;

        // refactoring
        new_dfa.transitions.map(t => {
          if (t.from === state) {
            t.from = newStateRand;
          }
          if (t.to === state) {
            t.to = newStateRand;
          }
        });

        // removing old name and adding new
        removeElement(state, new_dfa.final);
        new_dfa.final.push(newStateRand);

        // removing old name and adding new
        removeElement(state, new_dfa.states);
        new_dfa.states.push(newStateRand);



    }
  );

  // loading and drawing the result
  loadFile(new_dfa, false);
}

function minimizeDFA(json) {
  const alphabet = [... new Set(json.transitions.map(a => a.symbol))].sort();

  // checking if it is a NFA
  const isNFA = checkEpsilonTransition(json.transitions);

  if (isNFA) {
    determinizeNFA(json); // then transform NFA to DFA
  }
  // the function name say clearly what it does
  removeUnreachableStates(json);

  // do not know what to do
  let groupStates = [];
  // pares de estados
  groupStates.push(json.transitions.filter(t => json.final.includes(t.from)));
  let elseGroup = json.transitions.filter(t => !json.final.includes(t.from));
  for (const t of elseGroup) {

  }


}
