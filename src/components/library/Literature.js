import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import styles from "../../styles/Literature.module.css";
import sanitize from "sanitize-html";
import Footer from "../Footer";
import PropTypes from "prop-types";
import { BlogPost } from "makuwro";
import LiteratureFormatter from "./literature/LiteratureFormatter";
import HistoryState from "../../classes/HistoryState";

export default function Literature({ client, shownLocation, setLocation }) {

  const { username, slug } = useParams();
  const [editing, setEditing] = useState(false);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(true);
  const [post, setPost] = useState();
  const content = useRef();
  const [searchParams] = useSearchParams();
  const [db, setDB] = useState();
  const location = useLocation();
  const contentContainer = useRef();
  const titleRef = useRef();
  const navigate = useNavigate();
  const isMounted = useRef(true);
  const [contentState, setContentState] = useState();
  const [newSlug, setNewSlug] = useState();
  const [formatterEnabled, setFormatterEnabled] = useState(false);
  const [formatterExpanded, setFormatterExpanded] = useState(false);
  const [desktopFormatterRef, setDesktopFormatterRef] = useState();
  const [history, setHistory] = useState();
  const [textHistoryEntry, setTextHistoryEntry] = useState();

  useEffect(() => {

    // Try to set up IndexedDB.
    console.log("Attempting to use IndexedDB for autosaving...");
    const request = indexedDB.open("Literature");
    request.onsuccess = (event) => {
      
      const db = event.target.result;

      event.target.result.transaction("blogPosts", "readwrite").objectStore("blogPosts").oncomplete = () => {

      };
      
      setDB(db);

    };

    request.onupgradeneeded = (event) => {
      
      console.log("IndexedDB database opened!");

      /** @type {IDBDatabase} */
      const db = event.target.result;
      const objectStore = db.createObjectStore("blogPosts", {keyPath: "id"});
      objectStore.createIndex("id", "id", {unique: true});
      objectStore.createIndex("content", "content", {unique: false});

    };
    request.onerror = (event) => {

      console.warn(`Unable to access database: ${event.target.errorCode}`);
      console.warn("Data will not be autosaved.");

      alert(`Unable to access IndexedDB: ${event.target.errorCode}\nDue to this, data will not be autosaved.`);

    };

    // This is for detecting if the component is mounted or not.
    // Helpful in async actions.
    return () => (isMounted.current = false);

  }, []);

  useEffect(() => {

    if (db && post) {

      db.transaction("blogPosts", "readwrite").objectStore("blogPosts").put({id: post.id, content: content.current});

    }

  }, [db, post]);

  useEffect(() => {

    if (newSlug) {

      const path = `/${post.owner.username}/blog/${newSlug}`;
      
      if (location.pathname === path) {

        if (shownLocation.pathname === path) {

          setPost((oldPost) => new BlogPost({...oldPost, slug: newSlug}, client));
          setNewSlug();
          
        } else {
          
          setLocation(location);

        }

      } else {

        navigate(`${path}?mode=edit`, {replace: true});

      }
      
    } else if (!newSlug && location.pathname !== "/signin" && location.pathname !== "/register" && location.pathname !== shownLocation.pathname) {

      setLeaving(true);
    
    } else if (ready && leaving) {

      console.log("Ready!");
      setTimeout(() => setLeaving(false), 0);

    }

  }, [ready, location, shownLocation, newSlug]);

  useEffect(() => {

    (async () => {

      // Try to get the blog post
      if (!post && username && slug) {

        let post;
        try {

          console.log("Getting post from the server...");
          post = await client.getBlogPost(username, slug);

        } catch ({ message }) {

          setReady(true);

        }

        if (isMounted.current) {

          // Protect us from bad HTML, please!
          const sanitizedHtml = sanitize(post.content, {
            allowedAttributes: false,
            allowedClasses: false,
            allowedTags: [
              "address", "aside", "h1", "h2", "h3", "h4",
              "h5", "h6", "hgroup", "main", "nav", "section", "blockquote", "dd", "div",
              "dl", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre",
              "ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn",
              "em", "i", "kbd", "mark", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp",
              "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "caption",
              "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr",
              "audio", "source", "video", "iframe"
            ]
          });

          // Now show it on the ref!
          setContentState(sanitizedHtml);

          // Save the react component to the state.
          titleRef.current = post.title;
          document.title = post.title || "Untitled blog";

          // And we're done loading!
          setReady(true);
          setPost(post);

        }

      }

    })();

  }, [username, slug]);

  useEffect(() => {

    if (post) {

      // Check if we need to toggle edit mode
      if (searchParams.get("mode") === "edit") {

        // Set the post content. If it doesn't have any, set a default paragraph.
        setContentState(post.content || "<p placeholder=\"You can start drafting by clicking here!\"></p>");

        // Enable edit mode.
        setEditing(true);

        // Set the history state.
        setHistory(new HistoryState());

        // Enable the formatter.
        setFormatterEnabled(true);

      } else {

        // Reset the content if it wasn't edited.
        setContentState(post.content || "<p>This blog post doesn't exist... yet :)</p>");

        // Disable edit mode.
        setEditing(false);

      }

    }

  }, [post, searchParams, leaving]);

  useEffect(() => {

    content.current = contentState;

  }, [contentState]);

  async function save() {

    try {

      // Make sure the source was altered
      if ((/<p.*>(<br>)?<\/p>/gm.test(content.current) ? undefined : content.current) !== post.content || titleRef.current !== post.title) {

        // Update the post's content
        await client.updateBlogPost(post.owner.username, post.slug, {
          title: titleRef.current,
          content: content.current
        });

      }

      // Exit edit mode.
      navigate(`/${username}/blog/${slug}`);

    } catch (err) {

      console.log(err);

      alert(`Couldn't save your changes: ${err.message}`);

    }

  }

  function formatSelection(tagName, selection = window.getSelection()) {

    // Let's check if the selection is wrapped with this element already.
    const range = selection.getRangeAt(0);
    const { startOffset, endOffset, commonAncestorContainer } = range;
    const parents = [];
    let paragraphElement = commonAncestorContainer.parentNode;
    while (paragraphElement.tagName !== "P") {

      parents.unshift(paragraphElement);
      paragraphElement = paragraphElement.parentNode;

    }

    // Let's get the selected text.
    const preCaretRange = range.cloneRange();
    const selectedText = preCaretRange.toString();

    if (commonAncestorContainer.nodeType === 1) {

      parents.push(commonAncestorContainer);

    }

    // Get the link, if we're formatting a link.
    const removing = tagName !== "size" && parents.find((possibleMatch) => possibleMatch.tagName.toLowerCase() === tagName);
    let href;
    let fontSize;
    if (!removing && tagName === "a") {

      href = prompt("Please enter your link below.");

    } else if (tagName === "size") {

      fontSize = prompt("Please enter a font size in pixels below.");
      tagName = "span";

    }
    

    // Create a fragment to hold the elements.
    let parent;
    if (removing || !parents[0]) {

      parent = document.createDocumentFragment();

    } else {

      parent = parents[0].cloneNode();

    }

    // Append the text nodes prior to the selection.
    const currentTextContent = commonAncestorContainer.textContent;
    const textNodeLeft = document.createTextNode(currentTextContent.substring(0, startOffset));
    parent.appendChild(textNodeLeft);

    // Check if the parent node needs to be replaced.
    const newParents = removing ? parents.filter((node) => node.tagName.toLowerCase() !== tagName) : null;
    let node;

    if (newParents) {

      if (newParents[0]) {

        // There's another formatting node, so let's clone it.
        node = newParents[0].cloneNode(true);
        node.textContent = selectedText;

      } else {

        // The paragraph will be the parent node.
        node = document.createTextNode(selectedText);

      }

    } else {

      node = document.createElement(tagName);
      node.innerHTML = selectedText;

      if (href) {

        node.href = href;
        node.target = "_blank";

      } else if (fontSize) {

        node.style.fontSize = `${fontSize}px`;

      }

    }

    // Apend the node to the fragment.
    parent.appendChild(node);

    if (!parents[0]) {

      // Append the rest of the text nodes.
      const textNodeRight = document.createTextNode(currentTextContent.substring(endOffset));
      parent.appendChild(textNodeRight);

    }

    // Add the new fragment to the DOM.
    paragraphElement.replaceChild(parent, parents[0] || commonAncestorContainer);

    // Reposition the cursor.
    range.selectNodeContents(node);

    // Erase the empty text nodes.
    paragraphElement.normalize();

    // Save the changes.
    content.current = contentContainer.current.innerHTML;

  }

  /**
     * Gets the first paragraph parent element.
     * @param {Node} node The child child to search.
     * @returns {Element?} The first paragraph parent element.
     */
  function getParagraphElement(element) {

    let paragraphElement = element;
    while (paragraphElement && paragraphElement.parentNode !== contentContainer.current) {

      paragraphElement = paragraphElement?.parentNode;

    }
    return paragraphElement;

  }

  /**
   * 
   * @param {KeyboardEvent} event 
   */
  function handleInput(event) {

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const {startContainer, startOffset, endContainer, endOffset} = range;
    const backspace = event.code === "Backspace";

    if (event.type === "keydown" && event.code === "Tab") {

      // The user wants to add a tab.
      // We'll handle this, browser.
      event.preventDefault();

      // Remove the selected content.
      const range = selection.getRangeAt(0);
      range.extractContents();

      // Replace the content with a tab.
      const {startContainer, startOffset} = range;
      startContainer.textContent = `${startContainer.textContent.slice(0, startOffset)}	${startContainer.textContent.slice(startOffset)}`;

      // Fix the caret.
      range.setStart(startContainer, startOffset + 1);

    } else if (backspace) {

      // The user wants to remove content.
      // Check if we're at the beginning of the first paragraph.
      if (Array.from(contentContainer.current.children).indexOf(selection.anchorNode) === 0 && /<p.*>(<br>)?<\/p>/gm.test(event.target.innerHTML)) {

        return event.preventDefault();

      } else if (event.type === "keydown") {

        // Remove the placeholder attribute, if there is one.
        const startParagraph = getParagraphElement(startContainer);
        startParagraph.removeAttribute("placeholder");
        
        // Now check if the element is at the beginning of the paragraph.
        const endParagraph = getParagraphElement(endContainer);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(startParagraph);
        preCaretRange.setStart(startContainer, startOffset);

        if (preCaretRange.startOffset === 0 || startParagraph !== endParagraph) {

          // I really hate those <span> tags that generate, so let's stop the browser from doing that.
          event.preventDefault();

          // Check if the user is highlighting multiple paragraphs.
          let newStartParagraph = startParagraph.previousElementSibling;
          let paragraphToRemove = startParagraph;

          if (startParagraph !== endParagraph) {

            // Remove what's selected.
            range.extractContents();

            // Restore the new start paragraph.
            newStartParagraph = startParagraph;

            // Change the paragraph to remove.
            paragraphToRemove = endParagraph;

          }

          // Place the caret clone at the end of the previous paragraph.
          preCaretRange.selectNodeContents(newStartParagraph);
          const {lastChild} = newStartParagraph;
          preCaretRange.setStart(lastChild, lastChild.textContent.length);

          // Record the new caret position for later.
          const newCaretPosition = preCaretRange.startOffset;
          const nodeIndex = Array.from(newStartParagraph.childNodes).indexOf(lastChild);

          // Append the HTML to the previous element.
          // If the paragraph will be empty, use a <br> tag so that the 
          // user can type in the paragraph.
          newStartParagraph.innerHTML += paragraphToRemove.innerHTML || "<br>";

          // Remove the previous paragraph that we were on.
          paragraphToRemove.remove();

          // Restore caret position.
          range.selectNodeContents(newStartParagraph);
          range.setStart(newStartParagraph.childNodes[nodeIndex], newCaretPosition);

          // We don't want to highlight anything, so set the end position to the start.
          range.collapse(true);

        }

      }

    } else if (event.type === "keydown" && event.ctrlKey && event.code !== "Control") {

      let tagName;

      switch (event.code) {

        case "KeyB":
          tagName = "b";
          break;

        case "KeyI":
          tagName = "i";
          break;

        case "KeyU":
          tagName = "u";
          break;

        case "KeyM": {

          // We're indenting the paragraph!
          event.preventDefault();

          // Get the paragraph element.
          const {anchorNode} = window.getSelection();
          const paragraphElement = getParagraphElement(anchorNode);

          // Add an indent to the pragraph element.
          const currentPadding = parseInt(paragraphElement.style.paddingLeft, 10) || 0;
          paragraphElement.style.paddingLeft = currentPadding + (event.shiftKey ? -50 : 50) + "px";
          break;

        }

        case "KeyS":
          alert("Don't worry! We autosave changes to your device.");
          return event.preventDefault();

        case "KeyZ":
          history.undo();
          return event.preventDefault();

        case "KeyY":
          history.redo();
          return event.preventDefault();

      }

      if (tagName && !event.shiftKey) {

        // We don't want the default formatter to mess things up, so let's cancel the default action.
        event.preventDefault();

        // Now, let's format this bad boy.
        formatSelection(tagName, selection);

        return;

      }

    } 

    // Update the text.
    content.current = event.target.innerHTML;

    // Now, check if we should update the history entry.
    const ignoredKeys = ["Shift", "CapsLock", "NumLock", "ScrollLock", "Delete", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Pause", "MediaPlayPause", "AudioVolumeUp", "AudioVolumeDown", "AudioVolumeMute", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "Escape", "ContextMenu", "Enter"];

    if (!event.ctrlKey && !event.altKey && !event.metaKey && event.type === "keydown" && !ignoredKeys.find((key) => event.key === key)) {

      // Update the text history entry.
      setTextHistoryEntry((oldEntry) => {

        // Clear the old timeout, if we have to.
        if (oldEntry?.timeout) {

          clearTimeout(oldEntry.timeout);

        }

        // Set up the new entry.
        const timeout = setTimeout(() => {
            
          if (newEntry.text) {

            // Send this entry to the history.
            history.push(newEntry);

          }

          // Remove this entry.
          setTextHistoryEntry();

        }, 500);
        let newEntry = oldEntry ? {
          ...oldEntry,
          timeout
        } : {
          type: "addText",
          node: selection.anchorNode,
          position: selection.anchorOffset,
          text: "",
          timeout
        };

        if (backspace) {

          if (newEntry.type === "addText") {
          
            if (newEntry.text) {

              // Remove a character from the text.
              newEntry.text = newEntry.text.slice(0, newEntry.text.length - 1);

            } else if (startContainer !== endContainer || startOffset !== endOffset) {
            
              newEntry.type = "replaceText";

            } else {

              // Flip the entry type.
              newEntry.type = "removeText";

            }

          }

          switch (newEntry.type) {

            case "replaceText":
              // TODO: Replace text
              // ^^ wdfym "replace text"???
              // my boy thinks js is gonna write itself ????
              // bro what's with the emoji i'm on linux
              // excuse me, linux is a kernel not an operating system
              // true, but i am going to put you in the operating room
              break;

            case "removeText":

              // Append the new text.
              newEntry.text = `${selection.anchorNode.textContent.slice(selection.anchorOffset - 1, selection.anchorOffset)}${newEntry.text}`;

              // Update the position.
              newEntry.position -= 1;
              break;

          }

        } else {

          // Append the new text.
          newEntry.text += event.code === "Tab" ? "	" : event.key;

        }

        // Return the new entry.
        return newEntry;

      });

    }
    
  }

  /**
   * 
   * @param {ClipboardEvent} event 
   */
  async function handlePaste(event) {

    // We'll handle this, browser.
    event.preventDefault();

    // Let's iterate through each item in the clipboard data.
    const {items} = event.clipboardData;

    for (let i = 0; items.length > i; i++) {

      const item = items[i];
      if (item.kind === "file") {

        // Make sure that the file is an image.
        if (/^image\//.test(item.type)) {

          // Upload the image to the server.
          const {imagePath} = await post.uploadImage(item.getAsFile());
          event.target.innerHTML += `<img src="https://cdn.makuwro.com/${imagePath}" alt="" />`;

        }

      } else {

        const pasteText = () => new Promise((resolve) => {

          item.getAsString((string) => {
            
            event.target.innerHTML += string;
            resolve();

          });

        });

        await pasteText();

      }

    }

  }

  function changeTitle(event) {

    titleRef.current = event.target.textContent;
    document.title = titleRef.current || "Untitled blog";

  }

  // Render the component.
  return ready && (
    <main id={styles.post} className={leaving ? "leaving" : ""} onTransitionEnd={() => {

      if (leaving) {

        setLocation(location);

      }

    }}>
      {post ? (
        <>
          <LiteratureFormatter 
            setNewSlug={setNewSlug} 
            getParagraphElement={getParagraphElement} 
            title={titleRef.current} 
            enabled={formatterEnabled} 
            content={content.current}
            formatSelection={formatSelection}
            expanded={formatterExpanded}
            contentContainer={contentContainer.current} 
            post={post}
            setDesktopFormatterRef={setDesktopFormatterRef}
            onExpansionChange={setFormatterExpanded}
          />
          <section id={styles.belowFormatter}>
            <section id={styles.metadata}>
              <section id={styles.postInfo}>
                <section id={styles.left}>
                  <h1
                    contentEditable={editing}
                    placeholder={editing ? "Untitled blog" : null}
                    onKeyDown={changeTitle}
                    onKeyUp={changeTitle}
                    onPaste={handlePaste}
                    suppressContentEditableWarning
                    dangerouslySetInnerHTML={titleRef.current && editing ? { __html: titleRef.current } : null}
                  >
                    {(!editing ? (titleRef.current || "Untitled blog") : null)}
                  </h1>
                  <Link to={`/${post.owner.username}`} className={styles.creator}>
                    <img src={`https://cdn.makuwro.com/${post.owner.id}/avatar`} />
                    <span>{post.owner.displayName || `@${post.owner.username}`}</span>
                  </Link>
                </section>
                <section id={styles.actions}>
                  {client.user?.id === post.owner.id ? (
                    <>
                      <button onClick={async () => editing ? await save() : navigate("?mode=edit")}>
                        {editing ? (
                          <>
                            <span className="material-icons-round">
                              save
                            </span>
                            Save
                          </>
                        ) : (
                          <>
                            <span className="material-icons-round">
                              edit
                            </span>
                            Edit
                          </>
                        )}
                      </button>
                    </>
                  ) : <button className="destructive" onClick={() => navigate("?action=report-abuse")}>Report</button>}
                </section>
              </section>
            </section>
            <section
              id={styles.content}
              contentEditable={editing}
              onKeyDown={handleInput}
              onKeyUp={handleInput}
              onCut={(event) => handleInput(event, true)}
              onPaste={handlePaste}
              onSelect={() => {
                
                // Check if the desktop formatter is visible.
                if (window.getComputedStyle(desktopFormatterRef.current).display !== "flex") {
                  
                  // If it isn't, close the mobile formatter.
                  setFormatterExpanded(false);

                }

              }}
              suppressContentEditableWarning
              ref={contentContainer}
              dangerouslySetInnerHTML={{ __html: contentState }}
            >
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
  setLocation: PropTypes.func
};