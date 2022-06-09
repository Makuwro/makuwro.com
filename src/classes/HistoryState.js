export default class HistoryState {

  static maxEntries = 50;

  index = 0;
  state = [];
  
  constructor() {

  }

  push({type, node, position, text}) {

    console.log(this.index);

    // Check if the index was changed.
    if (this.index !== 0) {

      // Remove each reverted entry.
      this.state.splice(0, this.index);

      // Reset the index to 0.
      this.index = 0;

    } 

    // Add this entry to the state.
    this.state.unshift({
      type,
      node,
      position,
      text
    });

    // Check if the state is overflown.
    if (this.state.length > HistoryState.maxEntries) {

      this.state.pop()

    }

  }

  undo() {

    // Check if there's something to undo.
    if (this.state[this.index]) {

      // Get the current history entry.
      const {node, type, position, text} = this.state[this.index];

      switch (type) {

        case "addText":
          // Erase the text at the position.
          node.textContent = `${node.textContent.slice(0, position)}${node.textContent.slice(position + text.length)}`
          break;

      }

      // Increment the current index.
      this.index++;

      // Restore the caret position.
      const range = window.getSelection().getRangeAt(0);
      range.setStart(node, position);
      range.setEnd(node, position);
      range.collapse();

    }

  }

  redo() {

    // Check if there's something to redo.
    if (this.state[this.index - 1]) {

      // Get the current history entry.
      const {node, type, position, text} = this.state[this.index - 1];

      switch (type) {

        case "addText":
          // Erase the text at the position.
          node.textContent = `${node.textContent.slice(0, position)}${text}${node.textContent.slice(position + text.length)}`
          break;

      }

      // Decrement the current index.
      this.index--;

      // Restore the caret position.
      const range = window.getSelection().getRangeAt(0);
      range.setStart(node, position + text.length);
      range.setEnd(node, position + text.length);
      range.collapse();
      
    }

  }

}