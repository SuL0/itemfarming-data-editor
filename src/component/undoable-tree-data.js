import undoable from "./undoable";

const reducer = (state=undefined, action) => {
  switch (action.type) {
    case 'SET_VALUE':
      return action.payload;
    default:
      return state
  }
}

export default function undoableTreeData() {
  return undoable(reducer)
}
