import React, { useEffect, useRef, useState } from "react";
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
  const [title, setTitle] = useState("");
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

    if (content && (content.selection || content.newParagraph) && selectedParagraph?.current) {

      const currentSelection = document.getSelection();
      const range = document.createRange();
      range.setStart(selectedParagraph.current.childNodes[0], (content.selection?.focusOffset || 0) + (content.increment || 0));
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
    let selection = document.getSelection();
    if (!ctrlKey && (keyCode === 32 || keyCode === 8 || keyCode === 46 || (keyCode >= 48 && keyCode <= 90) || (keyCode >= 96 && keyCode <= 111) || (keyCode >= 160 && keyCode <= 165) || (keyCode >= 186 && keyCode <= 223))) {

      const {focusOffset, focusNode} = selection;
      const index = [...focusNode.parentNode.parentNode.childNodes].indexOf(focusNode.parentNode);
      setContent((content) => {

        const backspace = keyCode === 8;
        const del = keyCode === 46;
        const deleteParagraph = focusOffset === 0 && backspace;
        const newContent = {comps: [...content.comps], selection: !deleteParagraph ? {focusOffset} : null, increment: backspace ? -1 : (del ? 0 : 1)};
        let i = content.comps.length;
        while (i--) {

          const isTarget = i === index;

          if (isTarget && deleteParagraph) {

            newContent.comps.splice(i, 1);

          } else {

            let child;
            
            if (isTarget) {

              const isEmpty = content.comps[i].props.children.type === "br";

              child = isEmpty ? event.key : [content.comps[i].props.children.slice(0, focusOffset - (backspace ? 1 : 0)), backspace || del ? "" : event.key, content.comps[i].props.children.slice(focusOffset + (del ? 1 : 0))].join("");

              if (!child) {

                child = <br />;

              }

            } else {
              
              child = content.comps[i].props.children;

            }

            newContent.comps[i] = <p ref={isTarget || (deleteParagraph && i + 1 === index) ? selectedParagraph : null} key={i}>
              {child}
            </p>;

          }

        }

        return newContent;

      });

      event.preventDefault();

    } else if (keyCode === 13) {

      // We have to add a new paragraph!
      setContent((content) => {

        const newContent = {...content, selection: null, newParagraph: true, increment: 0};
        for (let i = 0; content.comps.length > i; i++) {
          
          newContent.comps[i] = <p key={i}>{newContent.comps[i].props.children}</p>;

        }
        newContent.comps[content.comps.length] = <p key={content.comps.length} ref={selectedParagraph}><br /></p>;

        return newContent;

      });

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

      const newContent = {comps: [...content.comps], selection: {focusOffset}, increment: text.length};
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
          <section id={styles.content} contentEditable={editing} onKeyDown={handleInput} onPaste={handlePaste} suppressContentEditableWarning ref={contentContainer}>
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