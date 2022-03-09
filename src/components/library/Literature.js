import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import styles from "../../styles/Blog.module.css";
import ReactDOMServer from "react-dom/server";
import sanitize from "sanitize-html";
import parse from "html-react-parser";
import Footer from "../Footer";

export default function Literature({currentUser, addNotification, shownLocation, setLocation, setSettingsCache}) {

  const {username, slug} = useParams();
  const [editing, setEditing] = useState(false);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(true);
  const [post, setPost] = useState({});
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(null);
  const [originalContent, setOriginalContent] = useState();
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
  const selectedParagraph = useRef();
  const titleRef = useRef();
  const navigate = useNavigate();
  const [caretInfo, setCaretInfo] = useState();

  function fixCaret(ref, start) {

    const currentSelection = document.getSelection();
    const range = document.createRange();
    range.setStart(ref.current.childNodes[0], start);
    range.collapse(true);
    currentSelection.removeAllRanges();
    currentSelection.addRange(range);

  }

  useEffect(() => {

    if (post.content) {

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

          }

          return element;

        }

      })) ? content : [content];
      setOriginalContent(content);
      setContent({comps: content});
      setReady(true);

    }

  }, [post]);

  useEffect(() => {

    if (editing && content && (content.selection || content.newParagraph) && selectedParagraph?.current) {

      fixCaret(selectedParagraph, !content.deleteParagraph ? (content.selection?.startOffset || 0) + (content.increment || 0) : selectedParagraph.current.childNodes[0].textContent.length + content.increment);

    }

  }, [content]);

  useEffect(() => {

    if (editing && caretInfo) {

      fixCaret(caretInfo.ref, caretInfo.offset);

    }

  }, [caretInfo]);

  useEffect(() => {

    if (location.pathname !== "/signin" && location.pathname !== "/register" && location.pathname !== shownLocation.pathname) {

      setLeaving(true);
    
    } else if (ready) {

      setTimeout(() => setLeaving(false), 0);

    }

    return () => {

      if (!leaving) {

        setLeaving(true);

      }

    };

  }, [ready, location]);

  useEffect(async () => {

    let mounted = true;

    // Try to get the blog post
    if (!post.id) {

      let json = {};
      try {

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
  
        console.log(message);
        json = {};
        setReady(true);
  
      }

      if (mounted) {

        setTitle(json.title);
        setPost(json);

      }

    }

    return () => {

      mounted = false;

    };

  }, [username, slug]);

  useEffect(() => {
    
    // Check if we need to toggle edit mode
    if (searchParams.get("mode") === "edit") {

      if (!content) setContent({comps: [<p key={.1} placeholder="You can start drafting by clicking here!"></p>]});
      setEditing(true);

    } else {

      if (!post.content && content) setContent(null);
      setEditing(false);

    }

  }, [searchParams]);

  async function deletePost() {

    if (confirm("Are you sure you want to delete this post? If someone reported it, it'll only be hidden until the Makuwro Safety & Security team reviews it.")) {

      try {

        const response = await fetch(`${process.env.RAZZLE_API_DEV}contents/blog/${username}/${slug}`, {
          headers: {
            token: currentUser.token
          },
          method: "DELETE"
        });

        if (response.ok) {

          navigate(`/${username}/blog`);

        } else {

          const {message} = await response.json();
          throw new Error(message);

        }

      } catch ({message}) {

        addNotification({
          title: "Couldn't delete your post",
          children: message
        });

      }

    }

  }

  async function save() {

    try {

      // Convert the elements to a Markdown string
      let contentString = "";
      let contentUntouched = true;
      for (let i = 0; content.comps.length > i; i++) {

        if (originalContent && originalContent[i]?.props.children !== content.comps[i].props.children) {

          contentUntouched = false;

        }
        contentString += ReactDOMServer.renderToStaticMarkup(content.comps[i]);

      }

      // Make sure the source was altered
      if (!contentUntouched || title !== post.title) {

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

  function handleInput(event, cutting) {

    const {keyCode, ctrlKey} = event;
    const selection = document.getSelection();
    const {startOffset, endOffset, startContainer, endContainer} = selection.getRangeAt(0);
    let onP = startContainer.nodeName === "P";
    const index = (onP ? [...startContainer.parentNode.childNodes] : [...startContainer.parentNode.parentNode.childNodes]).indexOf(onP ? startContainer : startContainer.parentNode);
    const atBeginning = startOffset === 0;
    const backspace = keyCode === 8;
    const del = keyCode === 46;
    const sameContainer = startContainer === endContainer;
    const highlighted = startOffset !== endOffset || !sameContainer;
    let endIndex = index;

    function fixClipboard() {


      

    }

    if (cutting) {

      navigator.clipboard.writeText(document.getSelection().toString());

    }

    if (!sameContainer) {

      onP = startContainer.nodeName === "P";
      endIndex = (onP ? [...endContainer.parentNode.childNodes] : [...endContainer.parentNode.parentNode.childNodes]).indexOf(onP ? endContainer : endContainer.parentNode);

    }

    if (cutting || (
      (
        !ctrlKey || backspace || del
      ) && (
        keyCode === 32 || backspace || del || (
          keyCode >= 48 && keyCode <= 90
        ) || (
          keyCode >= 96 && keyCode <= 111
        ) || (
          keyCode >= 160 && keyCode <= 165
        ) || (
          keyCode >= 186 && keyCode <= 223
        )
      )
    )) {
      
      // We're handling the content, so prevent the default behavior
      event.preventDefault();

      // We have to add or remove characters!
      setContent((content) => {

        const newContent = {comps: [...content.comps], selection: {startOffset}, increment: cutting || backspace || del ? 0 : 1};
        let i = content.comps.length;
        let fixFocus = false;
        while (i--) {

          const isTarget = i === index;
          let child;
          if (isTarget) {

            child = (child = content.comps[i].props).children || child;
            const isEmpty = child.type === "br";
            const removing = backspace || del;

            if (isEmpty || atBeginning) {

              if (backspace) {

                // Don't delete the beginning paragraph, please.
                if (content.comps[i - 1]) {

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

                newContent.increment -= backspaceIncrement;

              }

              child = [child.slice(0, startOffset - backspaceIncrement), removing ? "" : event.key, child.slice((highlighted ? endOffset : startOffset) + (del ? 1 : 0))].join("");

            } else {

              child = [child.slice(0, startOffset), removing ? "" : event.key, endContainer.textContent.slice(endOffset)].join("");

            }

          } else if (fixFocus && i + 1 === index) {

            let previousChild = typeof((previousChild = content.comps[i].props.children)) === "string" ? previousChild : "";
            const oldChild = content.comps[i + 1].props.children;
            child = previousChild + (oldChild && oldChild.type !== "br" ? oldChild : "");
            console.log(child);

          } else if (!sameContainer && i <= endIndex && i > index) {

            // This paragraph was completely highlighted, so we should remove it.
            newContent.comps.splice(i, 1);
            continue;
          
          } else {
            
            // This content doesn't need to be changed.
            child = content.comps[i].props.children;

          }

          newContent.comps[i] = <p ref={isTarget || (i + 1 === index && fixFocus) ? selectedParagraph : null} key={i}>
            {child || <br />}
          </p>;

        }

        // React really likes glitching out the caret when the content is updated, so let's do an illusion. 
        // I think this is way better than the caret resetting to position 0 of the document, and then
        // speeding back to where it should be.
        selection.removeAllRanges();

        return newContent;

      });

    } else if (keyCode === 13) {

      // We're handling the content, so prevent the default behavior
      event.preventDefault();

      // We have to add a new paragraph!
      setContent((content) => {

        const newContent = {comps: [...content.comps], selection: null, newParagraph: true, increment: 0, deleteParagraph: false};
        let i;
        
        // We're only adding a paragraph if it's in the same container.
        // Otherwise, we're just replacing paragraphs.
        i = content.comps.length + (sameContainer ? 1 : 0);
        while (i--) {

          let child;
          let afterIndex = i - 1 === index;
          
          if (index === i) {

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

          // Return the paragraph component, and the selectedParagraph ref 
          // so that the caret position is reset to the correct position.
          // Also, if the string is empty, we need to add a <br /> because Chromium doesn't like when a paragraph is empty :( 
          // In other words, it's not selectable.
          newContent.comps[i] = <p key={i} ref={afterIndex ? selectedParagraph : null}>
            {child || <br />}
          </p>;

        }

        // React really likes glitching out the caret when the content is updated, so let's do an illusion. 
        // I think this is way better than the caret resetting to position 0 of the document, and then
        // speeding back to where it should be.
        selection.removeAllRanges();

        return newContent;

      });

    } else if (ctrlKey && keyCode === 90) {

      // We have to undo something!
      // First, let's stop the browser from handling this event.
      event.preventDefault();

    } else if (ctrlKey && keyCode === 89) {

      // We have to redo something!
      // First, let's stop the browser from handling this event.
      event.preventDefault();

      // Now, check if there's any history.
      const { position, history } = clipboardHistory.content;
      const newContent = history[position + 1];
      if (newContent) {

        // Set the content.
        setContent(newContent);
        
        // And finally adjust the clipboard history to reflect this.
        setClipboardHistory((oldHistory) => ({
          ...oldHistory,
          content: {
            ...oldHistory.content,
            position: position + 1
          }
        }));

      }

    } else if (!ctrlKey && keyCode !== 37 && keyCode !== 38 && keyCode !== 39 && keyCode !== 40) {

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

      const newContent = {comps: [...content.comps], selection: {focusOffset}, increment: text.length, deleteParagraph: false};
      for (let i = 0; content.comps.length > i; i++) {

        const isTarget = i === index;
        let child;
        if (isTarget) {

          const isEmpty = content.comps[i].props.children.type === "br";
          child = isEmpty ? event.key : [content.comps[i].props.children.slice(0, focusOffset), text, content.comps[i].props.children.slice(focusOffset)].join("");

        } else {

          child = content.comps[i].props.children;

        }

        newContent.comps[i] = <p ref={isTarget ? selectedParagraph : null} key={i}>
          {child}
        </p>;

      }

      return newContent;

    });

  }

  function changeTitle(event) {

    const {ctrlKey, keyCode, key} = event;
    const backspace = keyCode === 8;
    const del = keyCode === 46;
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

  return ready && (
    <main id={styles.post} className={leaving ? "leaving" : ""} onTransitionEnd={() => {

      if (leaving) {

        setLocation(location);

      }

    }}>
      {post.id ? (
        <>
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
        </>
      ) : "That one doesn't exist!"}
      <Footer />
    </main>
  );

}