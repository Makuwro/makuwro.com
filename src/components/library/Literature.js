import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import styles from "../../styles/Blog.module.css";
import ReactDOMServer from "react-dom/server";
import sanitize from "sanitize-html";
import parse, { domToReact } from "html-react-parser";
import Footer from "../Footer";
import Dropdown from "../input/Dropdown";
import PropTypes from "prop-types";
import { v4 as generateUUID } from "uuid";

export default function Literature({client, shownLocation, setLocation, setSettingsCache}) {

  const {username, slug} = useParams();
  const [editing, setEditing] = useState(false);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(true);
  const [post, setPost] = useState();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(null);
  const [searchParams] = useSearchParams();
  const [clipboardHistory, setClipboardHistory] = useState({
    title: {
      position: 0,
      history: []
    },
    content: {
      position: 0,
      history: []
    }
  });
  const location = useLocation();
  const contentContainer = useRef();
  const titleRef = useRef();
  const navigate = useNavigate();
  const [caretInfo, setCaretInfo] = useState();
  const isMounted = useRef(true);

  function fixCaret(ref, start, end) {

    const currentSelection = document.getSelection();
    const range = document.createRange();
    range.setStart(ref, start);
    if (end) {

      range.setEnd(ref, end);

    } else {
      
      range.collapse(true);

    }
    currentSelection.removeAllRanges();
    currentSelection.addRange(range);

  }

  useEffect(() => {

    // This is for detecting if the component is mounted or not.
    // Helpful in async actions.
    return () => (isMounted.current = false);

  }, []);

  useEffect(() => {

    let timeout;

    if (editing && typeof content?.selection?.paragraphIndex === "number") {

      // Find the text node.
      const {childIndex} = content.selection;
      let ref = (ref = contentContainer.current.childNodes[content.selection.paragraphIndex]) && childIndex !== undefined ? ref.childNodes[childIndex] : ref;
      while (ref.nodeType !== 3 && ref.nodeName !== "BR") {

        ref = ref.childNodes[0];

      }

      // Fix the caret.
      fixCaret(ref, content.selection.startOffset || 0, content.selection.endOffset || 0);
      
      // Use a delay for 1.5 seconds just in case we aren't finished typing.
      if (clipboardHistory.historyAltered) {

        setClipboardHistory({
          ...clipboardHistory,
          historyAltered: false
        });

      } else {

        // This is the amount of time in milliseconds before we save the state.
        // I think it'd be a nice feature for this to be customizable in the future.
        const timeoutMS = 1500;

        timeout = setTimeout(() => {

          // This is the amount of objects allowed in the clipboard history array.
          const maxHistory = 100;
          let currentContentHistory = [...clipboardHistory.content.history];
          let newPosition = clipboardHistory.content.position + 1;

          if (newPosition === maxHistory) {
            
            // Push the position back.
            newPosition--;

            // Remove the first object from the content history.
            currentContentHistory.shift();

          }

          // Save the new history state.
          setClipboardHistory((oldHistory) => ({
            ...oldHistory,
            content: {
              position: newPosition, 
              history: [
                ...currentContentHistory.slice(0, newPosition),
                content
              ]
            }
          }));

        }, timeoutMS);

      }

    }

    return () => {

      // If we change the content, don't save the old content to the history.
      clearTimeout(timeout);

    };

  }, [content]);

  useEffect(() => {

    if (editing && caretInfo) {

      fixCaret(caretInfo.ref, caretInfo.offset);

    }

  }, [caretInfo]);

  useEffect(() => {

    if (location.pathname !== "/signin" && location.pathname !== "/register" && location.pathname !== shownLocation.pathname) {

      setLeaving(true);
    
    } else if (ready && leaving) {

      console.log("Ready!");
      setTimeout(() => setLeaving(false), 0);

    }

  }, [ready, location]);

  useEffect(() => {

    (async () => {

      // Try to get the blog post
      if (!post) {

        let post;
        try {

          console.log("Getting post from the server...");
          post = await client.getBlogPost(username, slug);
    
        } catch ({message}) {
    
          setReady(true);
    
        }

        if (isMounted.current) {
          
          // Protect us from bad HTML, please!
          const sanitizedHtml = sanitize(post.content, {
            allowedAttributes: false, 
            allowedClasses: false,
            allowedTags: [
              "address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4",
              "h5", "h6", "hgroup", "main", "nav", "section", "blockquote", "dd", "div",
              "dl", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre",
              "ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn",
              "em", "i", "kbd", "mark", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp",
              "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "caption",
              "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr",
              "audio", "source", "video", "iframe"
            ]
          });

          // Now convert the HTML into a React component!
          let content = Array.isArray(content = parse(sanitizedHtml, {

            replace: (element) => {
              
              // Check if the link is an internal link (makuwro.com)
              if (element.name === "a" && element.attribs.href === "https://makuwro.com") {

                // Replace the element with a React Router link so that the page doesn't refresh
                return <Link to=""></Link>;

              } else if (element.name === "p") {

                return <p>{domToReact(element.children)}</p>;

              }

              return element;

            }

          })) ? content : [content];

          // Save the react component to the state.
          setTitle(post.title);
          setContent({comps: content});

          // Set up the initial clipboard history state for undoing and redoing.
          console.log("Setting initial clipboard history...");
          setClipboardHistory((oldHistory) => ({
            ...oldHistory,
            content: {
              position: 0,
              history: [{comps: content}]
            }
          }));

          // And we're done loading!
          setReady(true);
          setPost(post);


        }

      }

    })();

  }, [username, slug]);

  useEffect(() => {
    
    // Check if we need to toggle edit mode
    if (searchParams.get("mode") === "edit") {

      if (!content) setContent({comps: [<p key={.1} placeholder="You can start drafting by clicking here!"></p>]});
      setEditing(true);

    } else {

      // Reset the content if it wasn't edited.
      if (!post?.content && content) {
        
        setContent(null);

      }

      // Remove the selections.
      document.getSelection().removeAllRanges();

      // Disable edit mode.
      setEditing(false);

    }

  }, [searchParams]);

  async function save() {

    try {

      // Convert the elements to a Markdown string
      let contentString = "";
      for (let i = 0; content.comps.length > i; i++) {

        contentString += ReactDOMServer.renderToStaticMarkup(content.comps[i]);

      }

      // Make sure the source was altered
      if (contentString !== post.content || title !== post.title) {

        // Update the post's content
        await client.updateBlogPost(post.owner.username, post.slug, {
          title,
          content: contentString
        });

      }

      // Exit edit mode.
      navigate(`/${username}/blog/${slug}`);

    } catch (err) {

      alert(`Couldn't save your changes: ${err.message}`);

    }

  }

  function getImportantIndices(node) {

    let paragraphIndex;
    let selectedNodeIndex;

    while (paragraphIndex === undefined) {

      // Check if the current container's parent node is a paragraph.
      const {parentNode} = node;
      if (parentNode.nodeName === "P") {

        // Find the index from the paragraph's children.
        selectedNodeIndex = Array.prototype.indexOf.call(parentNode.childNodes, node);

        // Find the index from the ref list.
        paragraphIndex = Array.prototype.indexOf.call(contentContainer.current.childNodes, parentNode);

      } else {

        node = parentNode;

      }

    }

    return {paragraphIndex, selectedNodeIndex};

  }

  function createComponentFromNode(node, key, textContent = node.textContent) {

    // Get all of the tags that are selected.
    const tags = [];
    let newElement = textContent;
    while (node.nodeType !== 3 && node.nodeName !== "BR") {

      tags.push(node.nodeName.toLowerCase());
      node = node.childNodes[0];

    }

    // Iterate through the tags and remove the formatting, if necessary.
    for (let x = 0; tags.length > x; x++) {

      // We don't need to mess with these tags, so we just re-add them
      // as React components.
      newElement = React.createElement(tags[x], {
        key: x,
      }, newElement);

    }

    // Return the component as-is.
    return typeof newElement === "string" ? newElement : React.createElement(newElement.type, {key}, newElement.props.children);

  }

  function handleInput(event, cutting) {

    const {ctrlKey, key} = event;

    // Make sure we're selecting something.
    const selection = document.getSelection();
    if (!selection.focusNode) {

      return;

    }

    const {startOffset, endOffset, startContainer, endContainer} = selection.getRangeAt(0);
    const atBeginning = startOffset === 0;
    const backspace = key === "Backspace";
    const del = key === "Delete";
    const sameContainer = startContainer === endContainer;
    const highlighted = startOffset !== endOffset || !sameContainer;
    const removing = backspace || del;
    const parent = contentContainer.current;
    let {paragraphIndex: startParagraphIndex, selectedNodeIndex: startSelectedNodeIndex} = getImportantIndices(startContainer);
    let {paragraphIndex: endParagraphIndex, selectedNodeIndex: endSelectedNodeIndex} = getImportantIndices(endContainer);
    let {childNodes} = parent.childNodes[startParagraphIndex];

    if (cutting || (!ctrlKey && (key.length === 1 || removing))) {
      
      // We're adding or removing characters.
      let newContent;
      let i;
      let newParagraph;
      let nodeMovingToPreviousParagraph;
      
      // We're handling the content, so prevent the default behavior.
      event.preventDefault();

      // Check if we're cutting the selection.
      if (cutting) {

        // Save the selected text.
        navigator.clipboard.writeText(document.getSelection().toString());
  
      }

      // Now iterate through the component list from the last to the first.
      // We're doing last to first because if we need to delete a paragraph
      // from the list, it won't break the loop.
      newContent = {
        comps: [...content.comps], 
        selection: {
          startOffset: startOffset + (cutting || backspace || del ? 0 : 1),
          paragraphIndex: startParagraphIndex,
          childIndex: startSelectedNodeIndex
        }
      };
      newParagraph = [];
      for (i = 0; childNodes.length > i; i++) {

        const isTarget = i === startSelectedNodeIndex;
        const node = childNodes[i];
        let child;

        if (isTarget) {

          const {textContent, nodeType, nodeName} = node;

          if (backspace) {

            if (atBeginning) {

              if (highlighted) {

                // Replace the entire paragraph with a <br />.
                child = <br />;

              } else if (startParagraphIndex === 0) {

                // Don't change anything; we can't delete the beginning paragraph.
                return;

              } else {

                const previousChildNodes = parent.childNodes[startParagraphIndex - 1].childNodes;

                newContent.comps.splice(startParagraphIndex, 1);
                
                startParagraphIndex--;

                newContent.selection.startOffset = previousChildNodes[previousChildNodes.length - 1].textContent.length;
                newContent.selection.paragraphIndex = startParagraphIndex;
                newContent.selection.childIndex = previousChildNodes.length - 1;
                nodeMovingToPreviousParagraph = createComponentFromNode(node, previousChildNodes.length);

                break;

              }

            } else {

              let backspaceIncrement = 0;

              if (!ctrlKey && !highlighted) {

                // If the text isn't highlighted, just remove a character.
                backspaceIncrement = 1;

              } else if (ctrlKey) {

                // Control + Backspace = remove a word.
                // Look for the closest space near the caret position.
                let closestSpace;
                let offset = 0;
                do { 
                  
                  closestSpace = textContent.lastIndexOf(" ", startOffset - offset);
                  offset++;

                } while (closestSpace !== -1 && closestSpace + 1 === startOffset);
                
                backspaceIncrement = startOffset - closestSpace;
                
                if (closestSpace === -1) {

                  // We want to delete the rest of the paragraph, but there's no space left.
                  backspaceIncrement = startOffset;

                } else {

                  // We want to end with a space.
                  backspaceIncrement--;

                }

              }

              newContent.selection.startOffset -= backspaceIncrement;

              child = [
                textContent.slice(0, startOffset - backspaceIncrement), 
                "", 
                textContent.slice((highlighted ? endOffset : startOffset) + (del ? 1 : 0))
              ].join("");

            }

            if (!sameContainer) {
                  
              newContent.comps.splice(startParagraphIndex, endParagraphIndex - startParagraphIndex);

            }

          } else if (sameContainer) {

            child = [
              textContent.slice(0, startOffset), 
              removing ? "" : event.key, 
              textContent.slice((highlighted ? endOffset : startOffset) + (del ? 1 : 0))
            ].join("");

          } else {

            child = [
              textContent.slice(0, startOffset), 
              removing ? "" : event.key, 
              endContainer.textContent.slice(endOffset)
            ].join("");

          }

          // Check if this node has any tags.
          if (nodeType !== 3 && nodeName !== "BR") {
            
            // Change from "const" to "let" so we can change it
            let node = childNodes[i];
            let newElement = child;
            const tags = [];

            while (node.nodeType !== 3) {

              tags.push(node.nodeName.toLowerCase());
              node = node.childNodes[0];
        
            }

            for (let x = 0; tags.length > x; x++) {

              newElement = React.createElement(tags[x], {
                key: x,
              }, newElement);

            }

            child = newElement;

          }

        } else {

          child = createComponentFromNode(node, i);
        
        }
        
        newParagraph.push(child);

      }

      if (nodeMovingToPreviousParagraph) {

        const {childNodes} = parent.childNodes[startParagraphIndex];
        for (let i = 0; childNodes.length > i; i++) {

          newParagraph[i] = createComponentFromNode(childNodes[i], i);

        }
        newParagraph[childNodes.length] = nodeMovingToPreviousParagraph;

      }

      // Normalize text nodes.
      i = newParagraph.length;
      while (i--) {

        const component = newParagraph[i];
        if (typeof component === "string" && typeof newParagraph[i - 1] === "string") {

          // Merge the strings.
          newParagraph[i - 1] += component;
          newParagraph.splice(i, 1);

        }

      }

      newContent.comps[startParagraphIndex] = (
        <p key={generateUUID()}>
          {newParagraph}
        </p>
      );

      // React really likes glitching out the caret when the content is updated, so let's do an illusion. 
      // I think this is way better than the caret resetting to position 0 of the document, and then
      // speeding back to where it should be.
      selection.removeAllRanges();

      // Finally, set the new content.
      setContent(newContent);

    } else if (key === "Enter") {

      // We're handling the content, so prevent the default behavior
      event.preventDefault();

      const newContent = {
        comps: [...content.comps], 
        selection: {
          startOffset: 0, 
          childIndex: 0,
          paragraphIndex: startParagraphIndex + 1
        }
      };

      // We're only adding a paragraph if it's in the same container.
      // Otherwise, we're just replacing paragraphs.
      
      // Let's split the the current paragraph's content from the current caret position.
      const newParagraph = [];
      const previousParagraph = [];
      for (let i = 0; childNodes.length > i; i++) {
        
        const node = childNodes[i];
        const {textContent: previousTextContent} = node;
        const newParagraphSize = newParagraph.length;

        if (i === startSelectedNodeIndex) {

          // Let's cut the paragraph from the exact position.
          previousParagraph[i] = createComponentFromNode(node, i, previousTextContent.slice(0, highlighted ? endOffset : startOffset));

          // And add the other half of the content to the new paragraph.
          newParagraph[newParagraphSize] = createComponentFromNode(node, newParagraphSize, previousTextContent.slice(highlighted ? endOffset : startOffset));

        } else if (i > startSelectedNodeIndex) {

          // Add the rest of this content to the new paragraph. 
          newParagraph[newParagraphSize] = createComponentFromNode(node, newParagraphSize, previousTextContent);

        } else {

          // We don't need to do anything to this node.
          previousParagraph[i] = createComponentFromNode(node, i, previousTextContent);

        }

      }

      // Let's erase the paragraphs that were completely highlighted.
      if (startParagraphIndex !== endParagraphIndex) {

        newContent.comps.splice(startParagraphIndex + 1, endParagraphIndex - startParagraphIndex);

      }

      // Next, let's add the text content from the end container.
      if (!sameContainer) {

        const {childNodes} = endContainer;

        for (let i = 0; childNodes.length > i; i++) {
          
          // We only need the nodes that are the end index or after the end index.
          // We can ignore the previous ones because they were highlighted.
          const newParagraphSize = newParagraph.length;
          const node = childNodes[i];
          const {textContent} = node;

          if (i === endSelectedNodeIndex) {
            
            newParagraph[newParagraphSize] = createComponentFromNode(node, newParagraphSize, node.textContent.slice(endOffset));

          } else if (i > endSelectedNodeIndex) {

            newParagraph[newParagraphSize] = createComponentFromNode(node, newParagraphSize, textContent);

          }
          

        }

      }

      // Set the previous paragraph.
      newContent.comps[startParagraphIndex] = (
        <p key={generateUUID()}>
          {previousParagraph[0] ? previousParagraph : <br />}
        </p>
      );

      // Almost done! Let's add the new paragraph component.
      // If the paragraph array is empty, we need to add a <br /> because 
      // Chromium doesn't like when a paragraph is empty; it will be unselectable
      newContent.comps.splice(
        startParagraphIndex + 1,
        0,
        <p key={generateUUID()}>
          {newParagraph[0] ? newParagraph : <br />}
        </p>
      );

      // React really likes glitching out the caret when the content is updated, so let's do an illusion. 
      // I think this is way better than the caret resetting to position 0 of the document, and then
      // speeding back to where it should be.
      selection.removeAllRanges();

      // Finally, we update the content state.
      setContent(newContent);

    } else if (ctrlKey) {

      const changeClipboard = (increment) => {

        // First, let's stop the browser from handling this event.
        event.preventDefault();
  
        // Now, check if there's any history.
        const { position, history } = clipboardHistory.content;
        let newPosition = position + increment;
        let newContent = newContent = history[newPosition];
        if (newContent) {
  
          // Set the content.
          setContent(newContent);
          
          // And finally adjust the clipboard history to reflect this.
          setClipboardHistory((oldHistory) => ({
            ...oldHistory,
            content: {
              ...oldHistory.content,
              position: newPosition
            },
            historyAltered: true
          }));
  
          return true;
  
        } 
        
        return false;
  
      };

      switch (key.toLowerCase()) {

        // Bold
        case "b":
          event.preventDefault();
          formatSelection(0);
          break;

        // Italics
        case "i":
          event.preventDefault();
          formatSelection(1);
          break;

        // Underline
        case "u":
          event.preventDefault();
          formatSelection(2);
          break;

        // Undo
        case "z": 
          // Keeping it D.R.Y.
          if (!changeClipboard(-1)) {

            alert("There's nothing to undo");

          }
          break;

        // Redo
        case "y":
          // Keeping it D.R.Y.
          if (!changeClipboard(1)) {

            alert("There's nothing to redo");

          }
          break;

        default:
          break;

      }

    } else if (!ctrlKey && key === "ArrowLeft" && key === "ArrowUp" && key === "ArrowRight" && key === "ArrowDown") {

      // We're handling the content, so prevent the default behavior
      event.preventDefault();

    }

    // No else statement because we don't want to block events like CTRL+SHIFT+I.
    // That messed me up trying to program this editor lol

  }

  function handlePaste(event) {

    // Prevent the default event so contenteditable doesn't collide with React
    event.preventDefault();

    // Get the text and attach it to the current paragraph
    const {focusOffset, focusNode} = document.getSelection();
    const index = [...focusNode.parentNode.parentNode.childNodes].indexOf(focusNode.parentNode);
    const text = event.clipboardData.getData("text/plain");
    setContent((content) => {

      const newContent = {comps: [...content.comps], selection: {focusOffset: focusOffset + text.length}};
      for (let i = 0; content.comps.length > i; i++) {

        const isTarget = i === index;
        let child;
        if (isTarget) {

          const isEmpty = content.comps[i].props.children.type === "br";
          child = isEmpty ? event.key : [content.comps[i].props.children.slice(0, focusOffset), text, content.comps[i].props.children.slice(focusOffset)].join("");

        } else {

          child = content.comps[i].props.children;

        }

        newContent.comps[i] = (
          <p key={i}>
            {child}
          </p>
        );

        if (isTarget) {

          newContent.selection.paragraphIndex = i;

        }

      }

      return newContent;

    });

  }

  function changeTitle(event) {

    const {ctrlKey, keyCode, key} = event;
    const backspace = key === "Backspace";
    const del = key === "Delete";
    if ((!ctrlKey || backspace || del) && (keyCode === 32 || backspace || del || (keyCode >= 48 && keyCode <= 90) || (keyCode >= 96 && keyCode <= 111) || (keyCode >= 160 && keyCode <= 165) || (keyCode >= 186 && keyCode <= 223))) {

      // We're gonna handle this, browser. Pinky promise.
      event.preventDefault();

      // Get the selection data.
      const selection = document.getSelection();
      const {startOffset, endOffset} = selection.getRangeAt(0);
      const highlightOffset = startOffset !== endOffset ? 0 : 1;
      const currentTitle = selection.anchorNode.textContent;
      let newTitle;
      let offset = startOffset;
      
      // Now let's get into the processing.
      if (backspace && (!highlightOffset || startOffset)) {

        // We're deleting a character from the left.
        newTitle = currentTitle.slice(0, startOffset - highlightOffset) + currentTitle.slice(endOffset);
        offset = offset - highlightOffset;

      } else if (del && currentTitle.charAt(startOffset + highlightOffset)) {

        // We're deleting a character from the right.
        newTitle = currentTitle.slice(0, startOffset + highlightOffset) + currentTitle.slice(endOffset);

      } else if (!del && !backspace) {

        // We're just adding a normal character.
        newTitle = currentTitle.slice(0, startOffset) + key + currentTitle.slice(endOffset);
        offset++;

      }

      if (newTitle !== undefined && newTitle !== title) {

        selection.removeAllRanges();
        setTitle(newTitle || <br />);
        setCaretInfo({
          ref: titleRef,
          offset
        });

      }
      
    } else if (keyCode === 13) {

      document.activeElement.blur();

    }

  }
  
  function navigateToSettings() {

    setSettingsCache({...post, type: 2});
    navigate(`/${post.owner.username}/blog/${post.slug}/settings/sharing`);

  }

  function formatSelection(action) {

    const selection = document.getSelection();
    const range = selection.getRangeAt(0);
    const {startOffset, endOffset, startContainer, endContainer} = range;
    const parent = contentContainer.current;
    const {paragraphIndex, selectedNodeIndex} = getImportantIndices(startContainer);
    let childNodes;
    let i;
    let newParent;
    let newContent;
    let elementName;

    // Make sure we're selecting something.
    if (startOffset === endOffset && startContainer === endContainer) {

      return;

    }

    // Now, check which action we want to do.
    switch (action) {

      // Bold
      case 0: 
        elementName = "b";
        break;

      case 1:
        elementName = "i";
        break;

      case 2:
        elementName = "u";
        break;

      default:
        console.warn("Unknown format option selected.");
        return;

    }

    // Iterate through all of the child nodes in the selected parent.
    childNodes = parent.childNodes[paragraphIndex].childNodes;
    newParent = [];
    newContent = {comps: [...content.comps], selection: {startOffset, endOffset, paragraphIndex}};
    let refSet = false;
    for (i = 0; childNodes.length > i; i++) {

      let currentNode = childNodes[i];
      const {textContent, nodeType} = currentNode;

      // Find out if this is the target element by checking the start offset and the container.
      if (i === selectedNodeIndex) {

        const targetText = textContent.slice(startOffset, endOffset);
        newContent.selection.startOffset = 0;
        newContent.selection.endOffset = textContent.length;
        refSet = true;

        // Check if it's a text node.
        if (nodeType === 3) {

          // Easy: all we need to do is just splice the text node to include the formatted element.
          newParent[i] = [
            textContent.slice(0, startOffset),
            React.createElement(elementName, {
              key: i,
            }, targetText),
            textContent.slice(endOffset)
          ];
          newContent.selection.childIndex = i + 1;
          newContent.selection.startOffset = 0;
          newContent.selection.endOffset = targetText.length;
          refSet = true;

        } else {

          // Turn the node into a component.
          newParent[i] = createComponentFromNode(currentNode, i);

          // Add the element formatting.
          newParent[i] = React.createElement(elementName, {
            key: i
          }, newParent[i]);
    
          // Let's adjust the selection information accordingly.
          if (typeof newParent[i] !== "string") {
    
            // There's still more formatting in this selection. 
            newContent.selection.childIndex = i;
    
          }

        }

      } else {

        newParent[i] = createComponentFromNode(currentNode, i);

      }

    }

    // Iterate through the parent array and merge the text nodes.
    i = newParent.length;
    let temporaryContentContainer = parent.childNodes[paragraphIndex].cloneNode(true);
    while (i--) {

      // Text nodes are always just strings.
      if (typeof newParent[i] === "string" && typeof newParent[i + 1] === "string") {

        // Append the text to the current node.
        newParent[i] += newParent[i + 1];

        // Remove the previous text node.
        newParent.splice(i + 1, 1);

        // Replace the node in our container clone.
        temporaryContentContainer.childNodes[i].replaceWith(temporaryContentContainer.childNodes[i].textContent);

      }

    }
    
    newContent.comps[paragraphIndex] = (
      <p key={paragraphIndex}>
        {newParent}
      </p>
    );

    if (!refSet) {

      // Simulate a selection on our fake container.
      let rangeClone = range.cloneRange();
      rangeClone.selectNodeContents(temporaryContentContainer);
      rangeClone.setStart(temporaryContentContainer.childNodes[selectedNodeIndex], startOffset);
      rangeClone.setEnd(temporaryContentContainer.childNodes[selectedNodeIndex], endOffset);

      // Merge all text nodes so that the indexes are accurate.
      temporaryContentContainer.normalize();

      // Set the offsets and the child index.
      newContent.selection.startOffset = rangeClone.startOffset;
      newContent.selection.endOffset = rangeClone.endOffset;
      newContent.selection.childIndex = Array.prototype.indexOf.call(rangeClone.endContainer.parentNode.childNodes, rangeClone.endContainer);

    }

    // Finally, change the content.
    setContent(newContent);

  }

  return ready && (
    <main id={styles.post} className={leaving ? "leaving" : ""} onTransitionEnd={() => {

      if (leaving) {

        setLocation(location);

      }

    }}>
      {post ? (
        <>
          <section id={styles.formatter} className={editing ? styles.available : null}>
            <section id={styles.mobileTools}>

            </section>
            <section id={styles.tabletTools}>
              <button 
                title="Bolden or unbolden text"
                onClick={() => formatSelection(0)}
              ><b>B</b></button>
              <button 
                title="Italicize or unitalicize text"
                onClick={() => formatSelection(1)}
              ><i>I</i></button>
              <button 
                title="Underline or un...underline text"
                onClick={() => formatSelection(2)}
              ><u>U</u></button>
              <button 
                title="Strikethrough or unstrikethrough text"
                onClick={() => formatSelection(3)}
              ><strike>S</strike></button>
              <button title="Change text color">
                <img src="/icons/color-palette.svg" />
              </button>
              <button title="Highlight text">H</button>
              <button title="Link to another website">
                <img src="/icons/link.svg" />
              </button>
              <button 
                title="Reset text formatting"
                onClick={() => formatSelection(4)}
              >
                <img src="/icons/format-color.svg" />
              </button>
              <Dropdown>
                <li>Normal text</li>
                <li>Heading 1</li>
                <li>Heading 2</li>
                <li>Heading 3</li>
                <li>Heading 4</li>
                <li>Heading 5</li>
                <li>Heading 6</li>
              </Dropdown>
            </section>
          </section>
          <section id={styles.belowFormatter}>
            <section id={styles.metadata}>
              <section id={styles.postInfo}>
                <section id={styles.left}>
                  <h1 
                    contentEditable={editing} 
                    placeholder={editing ? "Untitled blog" : null}
                    onKeyDown={changeTitle}
                    ref={titleRef}
                    suppressContentEditableWarning
                  >
                    {title || (!editing ? "Untitled blog" : null)}
                  </h1>
                  <Link to={`/${post.owner.username}`} className={styles.creator}>
                    <img src={`https://cdn.makuwro.com/${post.owner.avatarPath}`} />
                    <span>{post.owner.displayName || `@${post.owner.username}`}</span>
                  </Link>
                </section>
                <section id={styles.actions}>
                  {client.user?.id === post.owner.id ? (
                    <>
                      <button onClick={async () => editing ? await save() : navigate("?mode=edit")}>{editing ? "Save" : "Edit"}</button>
                      <button onClick={navigateToSettings}>Settings</button>
                    </>
                  ) : <button className="destructive" onClick={() => navigate("?action=report-abuse")}>Report</button>}
                </section>
              </section>
              {(post.coverPath || editing) && (
                <section id={styles.cover}>
                  {post.coverPath && (
                    <img src={`https://cdn.makuwro.com/${post.coverPath}`} />
                  )}
                </section>
              )}
            </section>
            <section 
              id={styles.content} 
              contentEditable={editing} 
              onKeyDown={handleInput} 
              onCut={(event) => handleInput(event, true)}
              onPaste={handlePaste} 
              suppressContentEditableWarning 
              ref={contentContainer}
            >
              {content ? content.comps : (
                <p>This blog post doesn't exist...yet ;)</p>
              )}
            </section>
            <section>
              <span>Categories: </span>
              <ul>
                <li>Test</li>
              </ul>
            </section>
            <section>
              <h1>Comments</h1>
            </section>
            <Footer />
          </section>
        </>
      ) : "That one doesn't exist!"}
    </main>
  );

}

Literature.propTypes = {
  client: PropTypes.object,
  shownLocation: PropTypes.object,
  setLocation: PropTypes.func,
  setSettingsCache: PropTypes.func
};