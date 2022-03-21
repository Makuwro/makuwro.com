import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import styles from "../../styles/Blog.module.css";
import ReactDOMServer from "react-dom/server";
import sanitize from "sanitize-html";
import parse, { domToReact } from "html-react-parser";
import Footer from "../Footer";
import Dropdown from "../input/Dropdown";

export default function Literature({currentUser, shownLocation, setLocation, setSettingsCache}) {

  const {username, slug} = useParams();
  const [editing, setEditing] = useState(false);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(true);
  const [post, setPost] = useState({});
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

    if (!ready && post.content) {

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

    }

  }, [post]);

  useEffect(() => {

    let timeout;

    if (editing && content && (content.selection || content.newParagraph) && content.selection.paragraphIndex !== undefined) {

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

  useEffect(async () => {

    // Try to get the blog post
    if (!post.id) {

      let json = {};
      try {

        console.log("Getting post from the server...");
        const response = await fetch(`${process.env.RAZZLE_API_DEV}contents/blog/${username}/${slug}`, {
          headers: currentUser.token ? {
            token: currentUser.token
          } : {}
        });
        json = await response.json();
  
        if (!response.ok) {
  
          throw new Error(json.message);
  
        }
  
      } catch ({message}) {
  
        json = {};
        setReady(true);
  
      }

      if (isMounted.current) {

        setTitle(json.title);
        setPost(json);

      }

    }

  }, [username, slug]);

  useEffect(() => {
    
    // Check if we need to toggle edit mode
    if (searchParams.get("mode") === "edit") {

      if (!content) setContent({comps: [<p key={.1} placeholder="You can start drafting by clicking here!"></p>]});
      setEditing(true);

    } else {

      // Reset the content if it wasn't edited.
      if (!post.content && content) {
        
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

        // Prepare the body
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", contentString);

        // Update the post's content
        const response = await fetch(`${process.env.RAZZLE_API_DEV}contents/blog/${username}/${slug}`, {
          headers: {
            token: currentUser.token
          },
          method: "PATCH",
          body: formData
        });

        if (response.ok) {

          // Exit edit mode
          navigate(`/${username}/blog/${slug}`);

        }

      } else {

        // We don't need to do anything, so exit edit mode without calling the API.
        navigate(`/${username}/blog/${slug}`);

      }

    } catch (err) {



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

  function handleInput(event, cutting) {

    const {ctrlKey, key} = event;

    // Make sure we're selecting something.
    const selection = document.getSelection();
    if (!selection.focusNode) {

      return;

    }

    const {startOffset, endOffset, startContainer, endContainer} = selection.getRangeAt(0);
    let onP = startContainer.nodeName === "P";
    const atBeginning = startOffset === 0;
    const backspace = key === "Backspace";
    const del = key === "Delete";
    const sameContainer = startContainer === endContainer;
    const highlighted = startOffset !== endOffset || !sameContainer;
    const removing = backspace || del;
    let currentContainer = startContainer;
    const {paragraphIndex, selectedNodeIndex} = getImportantIndices(currentContainer);
    
    let endIndex = paragraphIndex;

    if (!sameContainer) {

      onP = startContainer.nodeName === "P";
      endIndex = (onP ? [...endContainer.parentNode.childNodes] : [...endContainer.parentNode.parentNode.childNodes]).indexOf(onP ? endContainer : endContainer.parentNode);

    }

    if (cutting || (!ctrlKey && (key.length === 1 || removing))) {
      
      // We're adding or removing characters.
      let newContent;
      let i;
      let fixFocus;
      
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
      newContent = {comps: [...content.comps], selection: {startOffset: startOffset + (cutting || backspace || del ? 0 : 1)}};
      i = content.comps.length;
      fixFocus = false;
      while (i--) {

        const isTarget = i === paragraphIndex;
        let child = content.comps[i].props.children;

        if (isTarget) {

          child = (child = content.comps[i].props).children || child;

          // If a child is empty, it'll should only have a <br /> tag.
          if (child.type === "br" || atBeginning) {

            if (backspace) {

              if (highlighted) {

                child = <br />;

              } else {

                newContent.selection.startOffset = content.comps[i - 1].props.children.length;
                newContent.comps.splice(i, 1);
                fixFocus = true;
                continue;

              }

            } else {

              child = event.key;

            }
          
          } else if (sameContainer) {

            let backspaceIncrement = 0;

            if (backspace) {

              if (!ctrlKey && !highlighted) {

                // If the text isn't highlighted, just remove a character.
                backspaceIncrement = 1;

              } else if (ctrlKey) {

                // Control + Backspace = remove a word.
                // Look for the closest space near the caret position.
                let closestSpace;
                let offset = 0;
                do { 
                  
                  closestSpace = child.lastIndexOf(" ", startOffset - offset);
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

            }

            child = [child.slice(0, startOffset - backspaceIncrement), removing ? "" : event.key, child.slice((highlighted ? endOffset : startOffset) + (del ? 1 : 0))].join("");

          } else {

            child = [child.slice(0, startOffset), removing ? "" : event.key, endContainer.textContent.slice(endOffset)].join("");

          }

        } else if (fixFocus && i + 1 === paragraphIndex) {

          let previousChild = typeof((previousChild = content.comps[i].props.children)) === "string" ? previousChild : "";
          const oldChild = content.comps[i + 1].props.children;
          child = previousChild + (oldChild && oldChild.type !== "br" ? oldChild : "");

        } else if (!sameContainer && i <= endIndex && i > paragraphIndex) {

          // This paragraph was completely highlighted, so we should remove it.
          newContent.comps.splice(i, 1);
          continue;
        
        }
        
        newContent.comps[i] = <p key={i}>
          {child || <br />}
        </p>;

        if (isTarget || (i + 1 === paragraphIndex && fixFocus)) {

          newContent.selection.paragraphIndex = i;

        }

      }

      // React really likes glitching out the caret when the content is updated, so let's do an illusion. 
      // I think this is way better than the caret resetting to position 0 of the document, and then
      // speeding back to where it should be.
      selection.removeAllRanges();

      // Finally, set the new content.
      setContent(newContent);

    } else if (key === "Enter") {

      // We're handling the content, so prevent the default behavior
      event.preventDefault();

      const newContent = {comps: [...content.comps], selection: {startOffset: 0}, newParagraph: true};

      // We're only adding a paragraph if it's in the same container.
      // Otherwise, we're just replacing paragraphs.
      let i = content.comps.length + (sameContainer ? 1 : 0);
      while (i--) {

        let child;
        let afterIndex = i - 1 === paragraphIndex;
        
        if (paragraphIndex === i) {

          if (!atBeginning) {

            // Only cut off the part that we're adding to a new paragraph.
            child = content.comps[i].props.children.slice(0, startOffset);

          }

        } else if (afterIndex) {

          child = content.comps[i - 1].props.children;

          if (!atBeginning) {

            if (sameContainer) {

              child = child.slice(highlighted ? endOffset : startOffset);

            } else {

              child = endContainer.textContent.slice(endOffset);

            }

          }

        } else if (!sameContainer && i <= endIndex) {

          // This paragraph is completely in the range, so it should be removed.
          newContent.comps.splice(i, 1);
          continue;

        } else {

          // This content doesn't need to be changed.
          child = (content.comps[i] || content.comps[i - 1]).props.children;

        }

        // Return the paragraph component.
        // Also, if the string is empty, we need to add a <br /> because Chromium doesn't like when a paragraph is empty :( 
        // In other words, it's not selectable.
        newContent.comps[i] = (
          <p key={i}>
            {child || <br />}
          </p>
        );
        
        if (afterIndex) {

          // The caret position will reset to the correct position.
          newContent.selection.paragraphIndex = i;
          
        }

      }

      // React really likes glitching out the caret when the content is updated, so let's do an illusion. 
      // I think this is way better than the caret resetting to position 0 of the document, and then
      // speeding back to where it should be.
      selection.removeAllRanges();

      // We have to add a new paragraph!
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

      const tags = [];
      let currentNode = childNodes[i];
      const {textContent, nodeType} = currentNode;

      const fixNodes = (checkNodes) => {

        // Get all of the tags that are selected.
        let newElement = textContent;
        let elementRemoved = false;
        while (currentNode.nodeType !== 3) {

          tags.push(currentNode.nodeName.toLowerCase());
          currentNode = currentNode.childNodes[0];

        }

        // Iterate through the tags and remove the formatting, if necessary.
        for (let x = 0; tags.length > x; x++) {

          if (checkNodes && elementName === tags[x]) {

            // Remember that we removed the formatting so that we don't re-add it
            // at the end.
            elementRemoved = true;

          } else {

            // We don't need to mess with these tags, so we just re-add them
            // as React components.
            newElement = React.createElement(tags[x], {
              key: x,
            }, newElement);

          }

        }

        if (elementRemoved || nodeType === 3 || i !== selectedNodeIndex) {

          // Return the component as-is.
          newParent[i] = typeof newElement === "string" ? newElement : React.createElement(newElement.type, {
            key: i
          }, newElement.props.children);

        } else {

          // Add the new formatting.
          newParent[i] = React.createElement(elementName, {
            key: i
          }, newElement);

        }

        if (i === selectedNodeIndex) {
        
          // Let's adjust the selection information accordingly.
          if (typeof newParent[i] !== "string") {

            // There's still more formatting in this selection. 
            newContent.selection.childIndex = i;
            newContent.selection.startOffset = 0;
            newContent.selection.endOffset = textContent.length;
            refSet = true;

          }

        }

      };

      // Find out if this is the target element by checking the start offset and the container.
      if (i === selectedNodeIndex) {

        const targetText = textContent.slice(startOffset, endOffset);

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

          fixNodes(true);

        }

      } else {

        fixNodes();

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
      {post.id ? (
        <>
          <section id={styles.formatter} className={editing ? styles.available : null}>
            <section>
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
              <button title="Change text color">🎨</button>
              <button title="Highlight text">H</button>
              <button title="Link to another website">🔗</button>
              <button 
                title="Reset text formatting"
                onClick={() => formatSelection(4)}
              >❌</button>
            </section>
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
                  {currentUser && currentUser.id === post.owner.id ? (
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
            <Footer />
          </section>
        </>
      ) : "That one doesn't exist!"}
    </main>
  );

}