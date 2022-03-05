import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import styles from "../styles/Blog.module.css";
import Footer from "./Footer";

export default function BlogPost({currentUser, addNotification, shownLocation, setLocation}) {

  const {username, slug} = useParams();
  const [editing, setEditing] = useState(false);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(true);
  const [post, setPost] = useState({});
  const [content, setContent] = useState(null);
  const selectedParagraph = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contentContainer = useRef();

  useEffect(() => {

    if (post.content) {

      const matches = [...post.content.matchAll(/\n?(.+)/gm)];
      const content = [];
      for (let i = 0; matches.length > i; i++) {

        content.push(<p key={i}>{matches[i][1]}</p>);

      }

      setContent({comps: content});

    }

    console.log(post);

  }, [post]);

  useEffect(() => {

    if (editing && content && (content.selection || content.newParagraph) && selectedParagraph?.current) {

      const currentSelection = document.getSelection();
      const range = document.createRange();
      range.setStart(selectedParagraph.current.childNodes[0], !content.deleteParagraph ? (content.selection?.startOffset || 0) + (content.increment || 0) : selectedParagraph.current.childNodes[0].textContent.length + content.increment);
      range.collapse(true);
      currentSelection.removeAllRanges();
      currentSelection.addRange(range);

    }

  }, [content]);

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

    // Try to get the blog post
    if (!post.id) {

      try {

        const response = await fetch(`${process.env.RAZZLE_API_DEV}contents/blog/${username}/${slug}`, {
          headers: currentUser.token ? {
            token: currentUser.token
          } : {}
        });
  
        if (response.ok) {
  
          setPost(await response.json());
  
        } else {
  
          console.log(await response.json());
          setPost({});
  
        }
  
      } catch (err) {
  
        console.log(err);
  
      }
      setReady(true);

    }

  }, [username, slug]);

  useEffect(async () => {
    
    // Check if we need to toggle edit mode
    if (searchParams.get("mode") === "edit") {

      if (!content) setContent({comps: [<p key={.1} placeholder="You can start drafting by clicking here!"></p>]});
      setEditing(true);

    } else {

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
      const {current: {children}} = contentContainer;
      let source = "";
      for (let i = 0; children.length > i; i++) {

        const child = children[i];
        const nodeName = child.nodeName;
        switch (nodeName) {

          case "P":
            for (let x = 0; child.childNodes.length > x; x++) {

              const grandChild = child.childNodes[x];
              const grandNodeName = grandChild.nodeName;
              if ((grandChild.nodeValue !== null && grandChild.nodeValue.trim() === "") || grandNodeName === "BR") continue;

              source += (i !== 0 && x === 0 ? "\n" : "");

              switch (grandNodeName) {

                case "A":
                  source += `[${grandChild.innerText}](${grandChild.href})`;
                  break;

                case "B":
                  source += `**${grandChild.innerText}**`;
                  break;

                case "I":
                  source += `*${grandChild.innerText}*`;
                  break;
                
                case "U":
                  source += `__${grandChild.innerText}__`;
                  break;

                default:
                  source += grandChild.nodeValue;
                  break;

              }

            }
            break;

          case "H1":
          case "H2":
          case "H3":
            source += `${i !== 0 ? "\n" : ""}${(nodeName === "H1" || children[i - 1] && children[i - 1].nodeName !== "H1") && i !== 0 ? "\n" : ""}${"#".repeat(nodeName.substring(1))} ${child.innerText}`;
            break;

          case "UL":
            for (let x = 0; child.childNodes.length > x; x++) {

              console.log(child.childNodes[x].nodeName);

            }

            source += `${i !== 0 ? "\n" : ""}* ${child.innerText}`;
            break;

          default:
            break;

        }

      }

      // Make sure the source was altered
      if (source !== post.content) {

        // Prepare the body
        const formData = new FormData();
        formData.append("content", source);

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

  function handleInput(event) {

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
    if (!sameContainer) {

      onP = startContainer.nodeName === "P";
      endIndex = (onP ? [...endContainer.parentNode.childNodes] : [...endContainer.parentNode.parentNode.childNodes]).indexOf(onP ? endContainer : endContainer.parentNode);

    }
    if ((!ctrlKey || backspace || del) && (keyCode === 32 || backspace || del || (keyCode >= 48 && keyCode <= 90) || (keyCode >= 96 && keyCode <= 111) || (keyCode >= 160 && keyCode <= 165) || (keyCode >= 186 && keyCode <= 223))) {
      
      // We're handling the content, so prevent the default behavior
      event.preventDefault();

      // We have to add or remove characters!
      setContent((content) => {

        const newContent = {comps: [...content.comps], selection: {startOffset}, increment: backspace || del ? 0 : 1};
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

            const oldChild = content.comps[i + 1].props.children;
            child = content.comps[i].props.children + (oldChild && oldChild.type !== "br" ? oldChild : "");

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
            console.log(child);

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

  function handleCut(event) {

    event.preventDefault();

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
            {(post.coverPath || editing) && (
              <section id={styles.cover}>
                {post.coverPath && (
                  <img src={`https://cdn.makuwro.com/${post.coverPath}`} />
                )}
              </section>
            )}
            <section id={styles.postInfo}>
              <Link to={`/${post.owner.username}`} id={styles.creator}>
                <img src={`https://cdn.makuwro.com/${post.owner.avatarPath}`} />
                <span>Christian Toney</span>
              </Link>
              <h1 contentEditable={editing} placeholder={editing ? "Untitled blog" : null}>{post.title || (!editing ? "Untitled blog" : null)}</h1>
              {(editing || post.tagline) && (
                <p contentEditable={editing} placeholder={editing ? "No tagline" : null}></p>
              )}
              <section id={styles.actions}>
                {currentUser && currentUser.id === post.owner.id ? (
                  <>
                    <button onClick={async () => editing ? await save() : navigate("?mode=edit")}>{editing ? "Save" : "Edit"}</button>
                    <button className={post.published ? "destructive" : styles.unpublished}>Publish</button>
                    <button className="destructive" onClick={deletePost}>Delete</button>
                  </>
                ) : <button className="destructive" onClick={() => navigate("?action=report-abuse")}>Report</button>}
              </section>
            </section>
          </section>
          <section id={styles.content} contentEditable={editing} onKeyDown={handleInput} onCut={handleCut} onPaste={handlePaste} suppressContentEditableWarning ref={contentContainer}>
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