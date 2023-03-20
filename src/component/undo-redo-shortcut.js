const createUndoRedoHandler = (dispatch) => {
  return (event) => {
    if (event.ctrlKey && event.key === 'z') {
      dispatch({ type: 'UNDO' })
    } else if (event.ctrlKey && event.key === 'y') {
      dispatch({ type: 'REDO' })
    }
  }
}

const registerUndoRedoShortcut = (dispatch) => {
  const undoRedoHandler = createUndoRedoHandler(dispatch)
  document.addEventListener('keydown', undoRedoHandler);
  return () => document.removeEventListener('keydown', undoRedoHandler); // return unregister function
}

export default registerUndoRedoShortcut