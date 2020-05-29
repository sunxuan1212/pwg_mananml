import React, { useState, useEffect } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

const LightboxModal = (props) => {
  const { images = [], visible = false, initialIndex = null, handleClose } = props;
  const [ currentIndex, setCurrentIndex ] = useState(0);
  useEffect(()=>{
    if (initialIndex != null) {
      setCurrentIndex(initialIndex)
    }
  },[initialIndex]);

  if (images.length > 0 && visible) {
    return (
      <Lightbox
        mainSrc={images[currentIndex]}
        nextSrc={images[(currentIndex + 1) % images.length]}
        prevSrc={images[(currentIndex + images.length - 1) % images.length]}
        onCloseRequest={handleClose}
        onMovePrevRequest={() => {
          setCurrentIndex((currentIndex + images.length - 1) % images.length)
        }}
        onMoveNextRequest={() => {
          setCurrentIndex((currentIndex + 1) % images.length)
        }}
      />
    ) 
  }
  return null;
}

export default LightboxModal;