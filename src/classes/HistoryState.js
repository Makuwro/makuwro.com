export default class HistoryState {

  index = 0;
  state = [];
  
  constructor(maxEntries = 50) {

    this.maxEntries = maxEntries;

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
      let newCaretPosition = position;

      switch (type) {

        case "addText":
          node.textContent = `${node.textContent.slice(0, position)}${node.textContent.slice(position + text.length)}`;
          break;

        case "removeText":
          node.textContent = `${node.textContent.slice(0, position)}${text}${node.textContent.slice(position)}`;
          newCaretPosition += text.length;
          break;

        case "replaceText":
          break;

        case "mergeParagraphs":
          break;

        default:
          console.warn(`[History State] ${type} is not a valid entry type.`);
          break;

      }

      // Increment the current index.
      this.index++;

      // Restore the caret position.
      const range = window.getSelection().getRangeAt(0);
      range.setStart(node, newCaretPosition);
      range.setEnd(node, newCaretPosition);
      range.collapse();

    }

  }

  redo() {

    // Check if there's something to redo.
    if (this.state[this.index - 1]) {

      // Get the current history entry.
      const {node, type, position, text} = this.state[this.index - 1];
      let newCaretPosition = position + text.length;

      switch (type) {

        case "addText":
          node.textContent = `${node.textContent.slice(0, position)}${text}${node.textContent.slice(position + text.length)}`;
          break;

        case "removeText":
          node.textContent = `${node.textContent.slice(0, position)}${node.textContent.slice(position + text.length)}`;
          newCaretPosition -= text.length;
          break;

        case "replaceText":
          break;

        default:
          console.warn(`[History State] ${type} is not a valid entry type.`);
          break;

      }

      // Decrement the current index.
      this.index--;

      // Restore the caret position.
      const range = window.getSelection().getRangeAt(0);
      range.setStart(node, newCaretPosition);
      range.setEnd(node, newCaretPosition);
      range.collapse();
      
    }

  }

}