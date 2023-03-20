const undoable = (reducer) => {
  // Call the reducer with empty action to populate the initial state
  const initialState = {
    past: [],
    present: reducer(undefined, {}),  // the parameter will be set as default value if i pass undefined(but not apply for passing null)
    future: []
  }

  // Return a reducer that handles undo and redo
  return (state = initialState, action) => {
    const { past, present, future } = state

    switch (action.type) {
      case 'UNDO':
        if (past.length == 0) return state
        const previous = past[past.length - 1]
        const newPast = past.slice(0, past.length - 1)
        return {
          past: newPast,
          present: previous,
          future: [present, ...future]
        }
      case 'REDO':
        if (future.length == 0) return state
        const next = future[0]
        const newFuture = future.slice(1)
        return {
          past: [...past, present],
          present: next,
          future: newFuture
        }
      default:
        // Delegate handling the action to the passed reducer
        const newPresent = reducer(present, action)
        if (present === newPresent) {  // getter
          return state
        }
        const obj = {
          past: [...past, present],
          present: newPresent,
          future: []
        }
        obj.past = obj.past.filter(element => { return element != undefined })  // 처음 기본값으로 undefined 들어가게 되니깐
        return obj
    }
  }
}

export default undoable