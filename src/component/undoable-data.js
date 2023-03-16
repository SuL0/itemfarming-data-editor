import { isEmpty } from "lodash"
import { immerable, current } from "immer"

class UndoableData {
  [immerable] = true

  constructor() {
    this.data = {};
    this.caretaker = new Caretaker();
  }

  isEmpty() {
    return isEmpty(this.data && this.caretaker.mementos)
  }
  setData(newData) {
    this.caretaker.addMemento(new Memento(current(this.data)));
    this.data = newData;
  }
  

  // undo 하면 caretaker currentMemento가 -1이 된 채로 유지돼야 하는데, 자꾸 제자리로 돌아옴..
  undo() {
    const previousData = this.caretaker.getPreviousMemento().getData();
    this.data = previousData;
  }

  redo() {
    const nextData = this.caretaker.getNextMemento().getData();
    this.data = nextData;
  }
}

class Memento {
  constructor(data) {
    this.data = data;
  }

  getData() {
    return this.data;
  }
}

class Caretaker {
  constructor() {
    this.mementos = [];
    this.currentMemento = -1;
  }

  addMemento(memento) {
    // Remove any mementos that come after the current memento
    this.mementos = this.mementos.slice(0, this.currentMemento + 1);

    // Add the new memento to the list
    this.mementos.push(memento);

    this.currentMemento = this.mementos.length - 1;
  }

  getPreviousMemento() {
    if (this.currentMemento > 1) {
      this.currentMemento--;
      return this.mementos[this.currentMemento];
    } else {
      return this.mementos[1];
    }
  }

  getNextMemento() {
    if (this.currentMemento < this.mementos.length) {
      this.currentMemento++;
      return this.mementos[this.currentMemento];
    } else {
      return this.mementos[this.mementos.length];
    }
  }
}

export default UndoableData