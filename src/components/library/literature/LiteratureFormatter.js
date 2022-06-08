import React, { useState, useEffect, useRef } from "react";
import styles from "../../../styles/Literature.module.css";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import FormatterFileInfoComponent from "./formatter/file/FormatterFileInfoComponent";
import FormatterFileVersioningComponent from "./formatter/file/FormatterFileVersioningComponent";
import FormatterFileExportComponent from "./formatter/file/FormatterFileExportComponent";
import FormatterFileDeleteComponent from "./formatter/file/FormatterFileDeleteComponent";
import FormatterEditHistoryComponent from "./formatter/edit/FormatterEditHistoryComponent";
import FormatterEditFontComponent from "./formatter/edit/FormatterEditFontComponent";
import FormatterEditListsComponent from "./formatter/edit/FormatterEditListsComponent";
import FormatterEditParagraphComponent from "./formatter/edit/FormatterEditParagraphComponent";
import FormatterInsertImagesComponent from "./formatter/insert/FormatterInsertImagesComponent";
import FormatterInsertTemplatesComponent from "./formatter/insert/FormatterInsertTemplatesComponent";
import FormatterSharePermissionsComponent from "./formatter/share/FormatterSharePermissionsComponent";
import FormatterHelpCreativeSupportComponent from "./formatter/help/FormatterHelpCreativeSupportComponent";
import FormatterHelpTechincalSupportComponent from "./formatter/help/FormatterHelpTechnicalSupportComponent";
import FormatterHelpSafetySecurityComponent from "./formatter/help/FormatterHelpSafetySecurityComponent";

export default function LiteratureFormatter({enabled, expanded, formatSelection, title, content, contentContainer, getParagraphElement, post, onExpansionChange, setNewSlug, setDesktopFormatterRef}) {
  
  const [formatterExpanded, setFormatterExpanded] = useState(false);
  const [selectedNavKey, setSelectedNavKey] = useState();
  const [formatterConfig, setFormatterConfig] = useState();
  const desktopFormatterRef = useRef();
  const navigate = useNavigate();

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

      const children = Array.from(contentContainer.children);
      const startIndex = children.indexOf(startParagraph);
      const endIndex = children.indexOf(endParagraph);
      for (let i = startIndex; endIndex >= i; i++) {

        children[i].style.textAlign = alignment;

      }

    }

  }

  /**
   * 
   */
  function downloadHTML() {

    const fakeLink = document.createElement("a");
    fakeLink.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    fakeLink.setAttribute("download", `${title}.html`);
    fakeLink.click();

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

  function requestImage() {

    // Verify that the user is selecting a paragraph.
    const selection = window.getSelection();
    const {anchorNode} = selection;
    
    if (anchorNode && getParagraphElement(anchorNode)) {

      // Create a fake file input.
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.onchange = async (event) => {

        try {
          
          const range = selection.getRangeAt(0);
          const {startContainer, startOffset, endContainer} = range;
          const startParagraph = getParagraphElement(startContainer);
          const endParagraph = getParagraphElement(endContainer);

          if (startParagraph !== endParagraph) {

            // Remove the selection.
            range.extractContents();

            // Move all end container children to the start container.
            while (endParagraph.childNodes.length) {

              startParagraph.appendChild(endParagraph.firstChild);

            }

            // Remove the end paragraph.
            endParagraph.remove();

            // Normalize the start paragraph.
            startParagraph.normalize();

          }

          // Get the file.
          const file = event.target.files[0];

          // Upload the file to the server.
          const {imagePath} = await post.uploadImage(file);

          // Create an img tag.
          const img = document.createElement("img");

          img.onload = () => {

            // Create a fragment containing the previous nodes, the <img>, and the next text.
            const fragment = document.createDocumentFragment();

            function getElementBeforeParagraph() {

              let paragraphElement = startContainer;
              while (paragraphElement.parentNode.tagName !== "P") {

                paragraphElement = paragraphElement.parentNode;

              }
              return paragraphElement;

            }

            // Make two clones of the element.
            const elementBeforeParagraph = getElementBeforeParagraph();
            const left = elementBeforeParagraph.cloneNode(true);
            const right = elementBeforeParagraph.cloneNode(true);

            // Split the text content.
            left.textContent = startContainer.textContent.slice(0, startOffset);
            right.textContent = startContainer.textContent.slice(startOffset);

            // Append the children.
            fragment.appendChild(left);
            fragment.appendChild(img);
            fragment.appendChild(right);

            // Replace the child with the fragment.
            startParagraph.replaceChild(fragment, startContainer);

          };

          img.onerror = () => {

            

          };

          // Set the <img> source with the image path.
          img.src = `https://cdn.makuwro.com/${imagePath}`;

        } catch (err) {

          alert(err);

        }

      };

      // Simulate a click on the fake file input in order to request for an image.
      input.click();

    }

  }

  /**
   * 
   * @param {*} listType 
   */
  function toggleList(listType) {

    // Verify that the user is selecting a paragraph.
    const selection = window.getSelection();
    const {anchorNode} = selection;
    
    if (anchorNode && getParagraphElement(anchorNode)) {

      // Get the start and ending paragraph.
      const range = selection.getRangeAt(0);
      const {startContainer, endContainer} = range;
      const startParagraph = getParagraphElement(startContainer);
      const endParagraph = getParagraphElement(endContainer);

      // Now get the indexes of them.
      const children = Array.from(contentContainer.children);
      const startIndex = children.indexOf(startParagraph);
      const endIndex = children.indexOf(endParagraph);

      // Check if there's a list container before the selection.
      const listContainer = children[startIndex - 1]?.nodeName === listType.toUpperCase() ? children[startIndex - 1] : document.createElement(listType);

      // Iterate through each selected paragraph.
      for (let i = startIndex; endIndex >= i; i++) {

        // Convert the paragraph to a list.
        const item = document.createElement("li");
        
        // Move all paragraph children to the current container.
        /** @type {Element} */
        const paragraph = children[i];
        while (paragraph.childNodes.length) {

          item.appendChild(paragraph.firstChild);

        }

        // Append the list item to the list container.
        listContainer.appendChild(item);

        if (i !== startIndex) {

          // Remove the paragraph.
          paragraph.remove();

        }
        

      }

      // Append the <ul> before the start paragraph.
      contentContainer.insertBefore(listContainer, startParagraph);

      // Remove the start paragraph.
      startParagraph.remove();

    }

  }

  async function deleteLiterature() {

    if (confirm("Are you sure you want to delete this literature? After this, all comments and content, including attached images, will be deleted.\n\nNo takesies-backsies!")) {

      try {
        
        await post.delete();
        navigate(`/${post.owner.username}/blog`);

      } catch ({message}) {

        alert(`Couldn't delete this literature: ${message}`);

      }

    }

  }

  function changeHeadingType(headingType) {

    // Verify that the user is selecting a paragraph.
    const selection = window.getSelection();
    const {anchorNode} = selection;
    
    if (anchorNode && getParagraphElement(anchorNode)) {

      // Get the start and ending paragraph.
      const range = selection.getRangeAt(0);
      const {startContainer, endContainer} = range;
      const startParagraph = getParagraphElement(startContainer);
      const endParagraph = getParagraphElement(endContainer);

      // Now get the indexes of them.
      const children = Array.from(contentContainer.children);
      const startIndex = children.indexOf(startParagraph);
      const endIndex = children.indexOf(endParagraph);

      // Iterate through each selected paragraph.
      for (let i = startIndex; endIndex >= i; i++) {

        // Convert the selected elements to the new headings.
        const element = children[i];
        const newElement = document.createElement(headingType);

        while (element.childNodes.length) {

          newElement.appendChild(element.firstChild);

        }

        // Insert the new heading before the old element.
        contentContainer.insertBefore(newElement, element);

        // Delete the old element.
        element.remove();

      }

    }

  }

  useEffect(() => {

    if (enabled) {

      const menu = {
        "File": [
          {
            name: "Info",
            children: <FormatterFileInfoComponent />
          },
          {
            name: "Version history",
            children: <FormatterFileVersioningComponent />
          },
          {
            name: "Export",
            children: <FormatterFileExportComponent downloadHTML={downloadHTML} />
          },
          {
            name: "Delete",
            children: <FormatterFileDeleteComponent deleteLiterature={deleteLiterature} />
          }
        ],
        "Edit": [
          {
            name: "History",
            children: <FormatterEditHistoryComponent />
          },
          {
            name: "Font",
            children: <FormatterEditFontComponent styles={styles} formatSelection={formatSelection} changeHeadingType={changeHeadingType} />
          },
          {
            name: "Paragraph",
            children: <FormatterEditParagraphComponent alignSelection={alignSelection} />
          },
          {
            name: "Lists",
            children: <FormatterEditListsComponent toggleList={toggleList} />
          }
        ],
        "Insert": [
          {
            name: "Images",
            children: <FormatterInsertImagesComponent requestImage={requestImage} />
          },
          {
            name: "Templates",
            children: <FormatterInsertTemplatesComponent />
          }
        ],
        "Share": [
          {
            name: "Permissions",
            children: <FormatterSharePermissionsComponent navigate={navigate} />
          }
        ],
        "Help": [
          {
            name: "Creative support",
            children: <FormatterHelpCreativeSupportComponent />
          },
          {
            name: "Technical support",
            children: <FormatterHelpTechincalSupportComponent />
          },
          {
            name: "Safety & security",
            children: <FormatterHelpSafetySecurityComponent navigate={navigate} />
          }
        ]
      };
      const keys = Object.keys(menu);
      const formatterConfig = {
        navChildren: [],
        currentMenu: null
      };
      for (let i = 0; keys.length > i; i++) {

        // Create the nav button.
        const key = keys[i];
        const isSelected = selectedNavKey === key;
        formatterConfig.navChildren.push(
          <button 
            onClick={() => {

              if (isSelected) {

                setSelectedNavKey();
                setFormatterExpanded(false);

              } else {

                setSelectedNavKey(key);
                setFormatterExpanded(true);

              }

            }}
            className={isSelected ? styles.selected : null} 
            key={key}
          >
            {key}
          </button>
        );

        if (isSelected) {

          // Iterate through each child section.
          const currentMenu = menu[key];
          formatterConfig.currentMenu = currentMenu.map((section) =>
            <section key={section.name}>
              {section.children}
              <section className={styles.formatterLabel}>
                {section.name}
              </section>
            </section>
          );

        }

      }
      setFormatterConfig(formatterConfig);

    }

  }, [selectedNavKey, enabled]);

  useEffect(() => {

    if (expanded && !selectedNavKey) {

      setSelectedNavKey("Edit");

    } else if (!expanded) {

      setSelectedNavKey();

    }

    setFormatterExpanded(expanded);

  }, [expanded]);

  useEffect(() => {

    onExpansionChange(formatterExpanded);

  }, [formatterExpanded]);

  useEffect(() => {

    setDesktopFormatterRef(desktopFormatterRef);

  }, []);

  return (
    <section id={styles.formatter} className={`${enabled ? styles.enabled : ""}${formatterExpanded ? ` ${styles.expanded}` : ""}`}>
      <section id={styles.mobileFormatter}>
        <section id={styles.quickOptions}>
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
            <button onClick={() => formatSelection("a")} type="button" title="Link">
              <span id={styles.textColor}>C</span>
            </button>
            <button onClick={() => formatSelection("a")} type="button" title="Link">
              🖌️
            </button>
            <button onClick={() => formatSelection("a")} type="button" title="Link">
              <span className="material-icons-round">
                format_indent_increase
              </span>
            </button>
            <button onClick={() => formatSelection("a")} type="button" title="Link">
              <span className="material-icons-round">
                format_indent_decrease
              </span>
            </button>
            <button onClick={requestImage} type="button" title="Link">
              <span className="material-icons-round">
                add_photo_alternate
              </span>
            </button>
          </section>
          <button id={styles.expansionToggle} onClick={() => setFormatterExpanded((expanded) => !expanded)} type="button" title="Expand">
            <span className="material-icons-round">
              {`expand_${formatterExpanded ? "more" : "less"}`}
            </span>
          </button>
        </section>
        <section id={styles.expandedMenu}>
          <section id={styles.alignOptions}>
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
          <section id={styles.fontSelection}>
            <button>Lexend Deca</button>
            <button type="button" className={styles.fontSize} onClick={() => formatSelection("size")}>16</button>
          </section>
          <section id={styles.otherOptions}>
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
        </section>
      </section>
      <section ref={desktopFormatterRef} id={styles.desktopFormatter}>
        <nav>
          {formatterConfig?.navChildren}
        </nav>
        <section id={styles.currentMenu}>
          {formatterConfig?.currentMenu}
        </section>
      </section>
    </section>
  );

}

LiteratureFormatter.propTypes = {
  enabled: PropTypes.bool,
  expanded: PropTypes.bool,
  title: PropTypes.string.isRequired,
  getParagraphElement: PropTypes.func.isRequired,
  contentContainer: PropTypes.object,
  content: PropTypes.string.isRequired,
  post: PropTypes.object.isRequired,
  onExpansionChange: PropTypes.func,
  formatSelection: PropTypes.func.isRequired,
  setNewSlug: PropTypes.func.isRequired,
  setDesktopFormatterRef: PropTypes.func
};