import React, { useState } from "react";
import Cropper from "react-easy-crop";

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

const getCroppedImg = async (imageSrc, crop, resize) => {
  try {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    /* setting canvas width & height allows us to 
    resize from the original image resolution */
    canvas.width = resize.width;
    canvas.height = resize.height;

    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // As a blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/png");
    });
  } catch (error) {
    console.log(error);
  }
};

const ImageCropper = ({ getBlob, inputImg, aspect, shape, size, resize }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [minZoom, setMinZoom] = useState(1);
  const [zoom, setZoom] = useState(1.5);

  const onCropComplete = async (_, croppedAreaPixels) => {
    const croppedImage = await getCroppedImg(
      inputImg,
      croppedAreaPixels,
      resize
    );
    getBlob(croppedImage);
  };

  return (
    <div
      className="crop-container"
      style={{ position: "relative", width: size.width, height: size.height }}
    >
      <Cropper
        image={inputImg}
        crop={crop}
        zoom={zoom}
        aspect={aspect}
        cropShape={shape}
        cropSize={size}
        showGrid={false}
        zoomSpeed={0.2}
        onMediaLoaded={(imageSize) => {
          imageSize.naturalHeight <= imageSize.naturalWidth
            ? setMinZoom(size.height / imageSize.height)
            : setMinZoom(size.width / imageSize.width);
        }}
        minZoom={minZoom}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
      />
    </div>
  );
};

export default ImageCropper;
