import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import styles from "../../styles/Blog.module.css";
import sanitize from "sanitize-html";
import Footer from "../Footer";
import PropTypes from "prop-types";
import { BlogPost } from "makuwro";

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
  const [updateTime, setUpdateTime] = useState();
  const [newSlug, setNewSlug] = useState();
  const [formatterExpanded, setFormatterExpanded] = useState(false);

  useEffect(() => {

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

    if (db && updateTime && post) {

      db.transaction("blogPosts", "readwrite").objectStore("blogPosts").put({id: post.id, content: content.current});

    }

  }, [db, updateTime, post]);

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
          document.title = post.title;

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

        setEditing(true);
        setContentState(post.content || "<p placeholder=\"You can start drafting by clicking here!\"></p>");

      } else {

        // Reset the content if it wasn't edited.
        setContentState(post.content || "<p>This blog post doesn't exist... yet :)</p>");

        // Disable edit mode.
        setEditing(false);

      }

    }

  }, [post, searchParams]);

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
    setUpdateTime(new Date());

  }

  /**
     * Gets the first paragraph parent element.
     * @param {Node} node The child child to search.
     * @returns {Element} The first paragraph parent element.
     */
  function getParagraphElement(element) {

    let paragraphElement = element;
    while (paragraphElement.tagName !== "P") {

      paragraphElement = paragraphElement.parentNode;

    }
    return paragraphElement;

  }

  /**
   * 
   * @param {string} [alignment] 
   */
  function alignSelection(alignment = "") {

    // First thing's first: let's get the start and end paragraphs.
    const selection = window.getSelection();
    const {startContainer, endContainer} = selection.getRangeAt(0);

    const startParagraph = getParagraphElement(startContainer);
    const endParagraph = getParagraphElement(endContainer);

    if (startParagraph === endParagraph) {

      startParagraph.style.textAlign = alignment;

    } else {

      const children = Array.from(contentContainer.current.children);
      const startIndex = children.indexOf(startParagraph);
      const endIndex = children.indexOf(endParagraph);
      for (let i = startIndex; endIndex >= i; i++) {

        children[i].style.textAlign = alignment;

      }

    }

  }

  function downloadHTML() {

    const fakeLink = document.createElement("a");
    fakeLink.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content.current));
    fakeLink.setAttribute("download", `${titleRef.current}.html`);
    fakeLink.click();

  }

  /**
   * 
   * @param {KeyboardEvent} event 
   */
  function handleInput(event) {

    const selection = window.getSelection();

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

    } else if (event.code === "Backspace") {

      // The user wants to remove content.
      // Check if we're at the beginning of the first paragraph.
      if (Array.from(contentContainer.current.children).indexOf(selection.anchorNode) === 0 && /<p.*>(<br>)?<\/p>/gm.test(event.target.innerHTML)) {

        return event.preventDefault();

      } else if (event.type === "keydown") {

        // Check if we're at the beginning of the element.
        const range = selection.getRangeAt(0);
        const {startContainer, startOffset, endContainer} = range;

        // Now check if the element is at the beginning of the paragraph.
        const startParagraph = getParagraphElement(startContainer);
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
          newStartParagraph.innerHTML += paragraphToRemove.innerHTML;

          // Remove the previous paragraph that we were on.
          paragraphToRemove.remove();

          // Restore caret position.
          range.selectNodeContents(newStartParagraph);
          range.setStart(newStartParagraph.childNodes[nodeIndex], newCaretPosition);

          // We don't want to highlight anything, so set the end position to the start.
          range.collapse(true);

        }

      }

    } else if (event.type === "keydown" && !event.shiftKey && event.ctrlKey && event.code !== "Control") {

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

      }

      if (tagName) {

        // We don't want the default formatter to mess things up, so let's cancel the default action.
        event.preventDefault();

        // Now, let's format this bad boy.
        formatSelection(tagName, selection);

        return;

      }

    }

    content.current = event.target.innerHTML;
    setUpdateTime(new Date());

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
    document.title = titleRef.current;

  }

  async function changeBlogURL() {

    // Get a new slug from the user.
    let slug;
    while (!slug) {

      slug = prompt(`The current slug for this blog post is "${post.slug}".\n\nWhat would you like to change it to? Try to only use alphanumeric characters, hyphens, and periods.`);
      
      // If the user pressed OK without typing anything, newBlogSlug will be null.
      // They might've meant to press Cancel.
      if (!slug || slug === post.slug) {
        
        return;

      }

    }

    // Request the server to change the slug.
    await post.update({slug});

    // Change the URL on the search bar.
    setNewSlug(slug);

  }

  return ready && (
    <main id={styles.post} className={leaving ? "leaving" : ""} onTransitionEnd={() => {

      if (leaving) {

        setLocation(location);

      }

    }}>
      {post ? (
        <>
          <section id={styles.formatter} className={formatterExpanded ? styles.expanded : null}>
            <section>
              <button onClick={() => formatSelection("b")} type="button" title="Bold">
                <b>B</b>
              </button>
              <button onClick={() => formatSelection("i")} type="button" title="Italicize">
                <i>I</i>
              </button>
              <button onClick={() => formatSelection("u")} type="button" title="Underline">
                <u>U</u>
              </button>
              <button onClick={() => formatSelection("strike")} type="button" title="Strikethrough">
                <strike>S</strike>
              </button>
              <button onClick={() => formatSelection("a")} type="button" title="Link">
                <span className="material-icons-round">
                  link
                </span>
              </button>
              <button onClick={() => setFormatterExpanded((expanded) => !expanded)} type="button" title="Expand">
                <span className="material-icons-round">
                  {`expand_${formatterExpanded ? "more" : "less"}`}
                </span>
              </button>
            </section>
            <section>
              <button onClick={() => alignSelection()} type="button" title="Align paragraph to the left">
                <span className="material-icons-round">
                  format_align_left
                </span>
              </button>
              <button onClick={() => alignSelection("center")} type="button" title="Align paragraph to the center">
                <span className="material-icons-round">
                  format_align_center
                </span>
              </button>
              <button onClick={() => alignSelection("right")} type="button" title="Align paragraph to the right">
                <span className="material-icons-round">
                  format_align_right
                </span>
              </button>
              <button onClick={() => alignSelection("justify")} type="button" title="Justify paragraph">
                <span className="material-icons-round">
                  format_align_justify
                </span>
              </button>
            </section>
            <section>
              <button>Lexend Deca</button>
              <button type="button" id={styles.fontSize} onClick={() => formatSelection("size")}>16</button>
            </section>
            <button type="button" title="Change font color">
              Change font color
            </button>
            <button type="button" title="Change highlight color">
              Change highlight color
            </button>
            <button type="button" title="Clear formatting">
              Clear formatting
            </button>
            <button type="button" title="Bullet list">Bullet list</button>
            <button type="button" title="Revert to backup">Revert to backup</button>
            <button onClick={downloadHTML} type="button" title="Save to device">Save to device</button>
            <button type="button" title="Collaboration settings">Collaboration settings</button>
            <button onClick={changeBlogURL} type="button" title="Change blog URL">Change blog URL</button>
          </section>
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