import React, { cloneElement, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import styles from "../styles/Blog.module.css";
import Footer from "./Footer";

export default function BlogPost({currentUser, addNotification}) {

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

    setContent({comps: [<p key={.0}>testing!</p>, <p key={.1}>Test</p>]});

  }, [post]);

  useEffect(() => {

    if (editing && content && (content.selection || content.newParagraph || content.deleteParagraph) && selectedParagraph?.current) {

      const currentSelection = document.getSelection();
      const range = document.createRange();
      range.setStart(selectedParagraph.current.childNodes[0], !content.deleteParagraph ? (content.selection?.startOffset || 0) + (content.increment || 0) : selectedParagraph.current.childNodes[0].textContent.length + content.increment);
      range.collapse(true);
      currentSelection.removeAllRanges();
      currentSelection.addRange(range);

    }

  }, [content]);

  useEffect(() => {

    if (ready) {

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
          headers: {
            token: currentUser.token
          }
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
    if ((!ctrlKey || backspace || del) && (keyCode === 32 || backspace || del || (keyCode >= 48 && keyCode <= 90) || (keyCode >= 96 && keyCode <= 111) || (keyCode >= 160 && keyCode <= 165) || (keyCode >= 186 && keyCode <= 223))) {

      // Prevent contenteditable from taking over.
      event.preventDefault();

      // We have to add or remove characters!
      setContent((content) => {

        const deleteParagraph = backspace && (atBeginning || !sameContainer);
        const newContent = {comps: [...content.comps], selection: !deleteParagraph ? {startOffset} : null, increment: backspace || del ? 0 : 1, deleteParagraph};
        let i = content.comps.length;
        let previousContent = "";
        while (i--) {

          const isTarget = i === index;

          if (isTarget && deleteParagraph) {

            // Append the text to the previous element
            previousContent = content.comps[i].props.children;

            // Remove <br /> tags
            if (previousContent.type === "br") {

              previousContent = "";

            } else {

              newContent.increment -= previousContent.length - 1;

            }

            // Delete this paragraph.
            newContent.comps.splice(i, 1);

          } else {

            let child;
            if (isTarget) {

              child = content.comps[i].props.children;
              const isEmpty = child.type === "br";
              let backspaceIncrement = 0;
              const removing = backspace || del;
              if (backspace) {

                if (!ctrlKey && !highlighted) {

                  // If the text isn't highlighted, just remove a character.
                  backspaceIncrement = 1;

                } else if (ctrlKey) {

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
              child = isEmpty ? event.key : [child.slice(0, startOffset - backspaceIncrement), removing ? "" : event.key, child.slice((highlighted ? endOffset : startOffset) + (del ? 1 : 0))].join("");

              if (!child) {

                child = <br />;

              }

            } else {
              
              child = content.comps[i].props.children;

            }

            if (deleteParagraph && i + 1 === index) {

              if (child.type === "br") {

                child = previousContent || <br />;

              } else {

                child += previousContent;

              }

            }

            newContent.comps[i] = <p ref={isTarget || (deleteParagraph && i + 1 === index) ? selectedParagraph : null} key={i}>
              {child}
            </p>;

          }

        }

        // React really likes glitching out the caret when the content is updated, so let's do an illusion. 
        // I think this is way better than the caret resetting to position 0 of the document, and then
        // speeding back to where it should be.
        selection.removeAllRanges();

        return newContent;

      });

    } else if (keyCode === 13) {

      // We have to add a new paragraph!
      setContent((content) => {

        const newContent = {comps: [...content.comps], selection: null, newParagraph: true, increment: 0, deleteParagraph: false};
        let i;
        let endIndex;
        if (!sameContainer) {

          onP = startContainer.nodeName === "P";
          endIndex = (onP ? [...endContainer.parentNode.childNodes] : [...endContainer.parentNode.parentNode.childNodes]).indexOf(onP ? endContainer : endContainer.parentNode);

        }
        
        // We're only adding a paragraph if it's in the same container.
        // Otherwise, we're just replacing paragraphs.
        i = content.comps.length + (sameContainer ? 1 : 0);
        while (i--) {

          let child;
          let afterIndex = i - 1 === index;
          
          if (index === i) {

            if (atBeginning) {

              // We don't need to cut off anything; just move the content down.
              child = <br />;

            } else {

              // Only cut off the part that we're adding to a new paragraph.
              child = content.comps[i].props.children.substring(0, startOffset);

            }

          } else if (afterIndex) {

            child = content.comps[i - 1].props.children;

            if (!atBeginning) {

              if (sameContainer) {

                child = child.substring(highlighted ? endOffset : startOffset);

              } else {

                child = endContainer.textContent.substring(endOffset);

              }

              // If the string is empty, we need to add a <br /> because Chromium doesn't like when a paragraph is empty :( 
              // In other words, it's not selectable.
              child = child || <br />;

            }

          } else {

            if (!sameContainer && i <= endIndex) {

              // This paragraph is in the range, so it should be removed.
              newContent.comps.splice(i, 1);
              continue;

            }

            // This content doesn't need to be changed.
            child = (content.comps[i] || content.comps[i - 1]).props.children || <br />;

          }

          // Return the paragraph component, and the selectedParagraph ref 
          // so that the caret position is reset to the correct position
          newContent.comps[i] = <p key={i} ref={afterIndex ? selectedParagraph : null}>{child}</p>;

        }

        // React really likes glitching out the caret when the content is updated, so let's do an illusion. 
        // I think this is way better than the caret resetting to position 0 of the document, and then
        // speeding back to where it should be.
        selection.removeAllRanges();

        return newContent;

      });

      // We're handling the content, so prevent the default behavior
      event.preventDefault();

    } else if (!ctrlKey && keyCode !== 37 && keyCode !== 38 && keyCode !== 39 && keyCode !== 40) {

      // We're handling the content, so prevent the default behavior
      event.preventDefault();

    }

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
    <main id={styles.post} className={leaving ? "leaving" : ""}>
      {post.id ? (
        <>
          <section id={styles.metadata}>
            <section id={styles.cover}>
              <img src="https://d1e00ek4ebabms.cloudfront.net/production/ad60a0ef-f43b-4a8c-9279-a3f118c98911.png" />
            </section>
            <section id={styles.postInfo}>
              <h1 contentEditable={editing} placeholder="Insert title here"></h1>
              {(editing || post.tagline) && (
                <p contentEditable={editing} placeholder="Insert tagline here...or not :P"></p>
              )}
              <Link to={""} id={styles.creator}>
                <img src="https://media.discordapp.net/attachments/539176248673566760/942512442427203624/kyew18norlh81.png?width=583&height=583" />
                <span>Christian Toney</span>
              </Link>
              <section id={styles.actions}>
                <button onClick={async () => editing ? await save() : navigate("?mode=edit")}>{editing ? "Save" : "Edit"}</button>
                {!editing && <button>Publish</button>}
                <button className="destructive" onClick={deletePost}>Delete</button>
              </section>
            </section>
          </section>
          <section id={styles.content} contentEditable={editing} onKeyDown={handleInput} onCut={handleCut} onPaste={handlePaste} suppressContentEditableWarning ref={contentContainer}>
            {content ? content.comps : (editing ? (
              <p placeholder="You can start drafting by clicking here!"></p>
            ) : (
              <p>This blog post doesn't exist...yet ;)</p>
            ))}
          </section>
        </>
      ) : "That one doesn't exist!"}
      <Footer />
    </main>
  );

}