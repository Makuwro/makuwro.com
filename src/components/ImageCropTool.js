import React, { useState, useEffect, useRef } from "react";
import Popup from "./Popup";
import styles from "../styles/ImageCropTool.module.css";

export default function ImageCropTool({imageUrl}) {

  const [visible, setVisible] = useState(false);
  const [initialCoords, setInitialCoords] = useState();
  const [translation, setTranslation] = useState([0, 0]);
  const [scale, setScale] = useState(1);
  const [grabbing, setGrabbing] = useState(false);
  const [height, setHeight] = useState(null);
  const [width, setWidth] = useState(null);
  const backgroundRef = useRef();
  const imageRef = useRef();
  const circleRef = useRef();
  const banner = imageUrl?.[2];

  useEffect(() => {

    if (grabbing) {

      const updateCoords = ({clientX, clientY}) => {

        if (initialCoords) {

          setTranslation((currentTranslation) => {
            
            // Check if the image will hit a boundary
            const backgroundBoundary = backgroundRef.current.getBoundingClientRect();
            const imageBoundary = imageRef.current.getBoundingClientRect();
            const circleBoundary = !banner && circleRef.current.getBoundingClientRect();
            let newX = clientX - initialCoords[0];
            let newY = clientY - initialCoords[1];

            if (imageBoundary.left + (newX - currentTranslation[0]) > (circleBoundary || backgroundBoundary).left) {
              
              newX = currentTranslation[0] + ((circleBoundary || backgroundBoundary).left - imageBoundary.left);
              
            } else if (imageBoundary.right + (newX - currentTranslation[0]) < (circleBoundary || backgroundBoundary).right) {

              newX = currentTranslation[0] + ((circleBoundary || backgroundBoundary).right - imageBoundary.right);
  
            }

            if (imageBoundary.top + (newY - currentTranslation[1]) > backgroundBoundary.top) {

              newY = currentTranslation[1] + (backgroundBoundary.top - imageBoundary.top);
  
            } else if (imageBoundary.bottom + (newY - currentTranslation[1]) < backgroundBoundary.bottom) {

              newY = currentTranslation[1] + (backgroundBoundary.bottom - imageBoundary.bottom);

            }

            return [newX, newY];
            
          });

        } else {

          setInitialCoords([clientX - translation[0], clientY - translation[1]]);

        }
    
      };

      const removeMouseListener = () => {

        document.removeEventListener("touchmove", updateCoords);
        document.removeEventListener("touchend", removeMouseListener);
        document.removeEventListener("mousemove", updateCoords);
        document.removeEventListener("mouseup", removeMouseListener);

        if (initialCoords) {

          setGrabbing(false);

        }

      };

      
      document.addEventListener("touchmove", updateCoords);
      document.addEventListener("touchend", removeMouseListener);
      document.addEventListener("mousemove", updateCoords);
      document.addEventListener("mouseup", removeMouseListener);

      return () => removeMouseListener();

    } else if (initialCoords) {

      setInitialCoords();

    }

  }, [initialCoords, grabbing]);

  useEffect(() => {

    // TODO: Fix the translation as the image scales.

  }, [scale]);

  useEffect(() => {

    if (imageUrl) {

      setVisible(true);

    }

  }, [imageUrl]);

  function cropSelection() {
    
    // Create a canvas.
    const canvas = document.createElement("canvas");
    canvas.width = banner ? 686 : 320;
    canvas.height = banner ? 114 : 320;

    // Create a canvas context.
    const ctx = canvas.getContext("2d");

    // Restore the original image height and width.
    const {height: originalHeight, width: originalWidth} = imageRef.current.cloneNode();

    // Draw the image to the canvas.
    const imageBoundary = imageRef.current.getBoundingClientRect();
    let secondBoundary = (banner ? backgroundRef : circleRef).current.getBoundingClientRect();
    ctx.drawImage(imageRef.current, 0, 0, originalWidth, originalHeight, imageBoundary.left - secondBoundary.left, imageBoundary.top - secondBoundary.top, height ? (originalWidth / originalHeight) * canvas.wid * scale : canvas.width * scale, width ? (originalHeight / originalWidth) * canvas.height * scale : canvas.height * scale);

    // Turn the canvas into a blob.
    canvas.toBlob((blob) => {
      
      // And then send it back to whatever requested the cropped image.
      imageUrl[1](blob);

    });

  }

  return visible ? (
    <Popup title="Crop image" id={styles.main} warnUnfinished onClose={() => setVisible(false)}>
      <section 
        style={banner ? {
          height: "114px"
        } : null}
        id={styles.fullImage} 
        onMouseDown={({button}) => button === 0 && setGrabbing(true)} 
        onTouchStart={() => setGrabbing(true)} 
        ref={backgroundRef}
        onClose={() => imageUrl[1]()}
      >
        {!banner ? (
          <section id={styles.circle} ref={circleRef}>

          </section>
        ) : null}
        <img 
          src={imageUrl[0]}
          crossOrigin="anonymous"
          ref={imageRef}
          style={{
            transform: `translate(${translation[0]}px, ${translation[1]}px) scale(${scale})`,
            height,
            width: banner ? null : width,
            minWidth: banner ? "100%" : null
          }}
          onLoad={({target: {height, width}}) => {

            if (width > height) {

              setHeight("320px");

            } else {

              setWidth("320px");

            }

          }}
        />
      </section>
      <section>
        <input type="range" step="0.01" max="3" min="1" value={scale} onInput={(({target}) => setScale(target.value))} />
        <button onClick={cropSelection}>
          Crop!
        </button>
      </section>
    </Popup>
  ) : null;

}