import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface CollageEditorProps {
  initialImages: File[];
  onSave: (file: File) => void;
  onCancel: () => void;
}

const CollageEditor: React.FC<CollageEditorProps> = ({
  initialImages,
  onSave,
  onCancel,
}) => {
  const [images, setImages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [containerSize, setContainerSize] = useState({
    width: 500,
    height: 500,
  });

  useEffect(() => {
    const imageObjects = initialImages.map((file, index) => ({
      id: index,
      url: URL.createObjectURL(file),
      x: 50,
      y: 50,
      width: 150,
      height: 150,
    }));
    setImages(imageObjects);

    return () => {
      imageObjects.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [initialImages]);

  useEffect(() => {
    const updateContainerSize = () => {
      const width = window.innerWidth < 500 ? window.innerWidth - 20 : 500;
      const height = window.innerHeight < 500 ? window.innerHeight - 20 : 500;
      setContainerSize({ width, height });
    };

    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);

    return () => {
      window.removeEventListener("resize", updateContainerSize);
    };
  }, []);

  const handleDragResize = (id: number, data: any) => {
    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === id
          ? {
              ...img,
              x: data.x,
              y: data.y,
              width: data.width,
              height: data.height,
            }
          : img
      )
    );
  };

  const handleDeleteImage = () => {
    if (selectedImage === null) return;
    const deletedImg = images.find((img) => img.id === selectedImage);
    if (deletedImg) URL.revokeObjectURL(deletedImg.url);
    setImages(images.filter((img) => img.id !== selectedImage));
    setSelectedImage(null);
  };

  const handleExportCollage = async () => {
    const collageElement = document.getElementById("collage-container");
    if (!collageElement) return;

    const canvas = await html2canvas(collageElement, { scale: 2 });
    const dataURL = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(dataURL);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(dataURL, "PNG", 0, 0, pdfWidth, pdfHeight);
    const pdfBlob = pdf.output("blob");
    const file = new File([pdfBlob], "collage.pdf", {
      type: "application/pdf",
    });
    onSave(file);
  };

  const handleAddImage = (newFiles: File[]) => {
    const validFiles = newFiles.filter(
      (file) => file.type === "image/jpeg" || file.type === "image/png"
    );

    if (validFiles.length !== newFiles.length) {
      Swal.fire(
        "Error",
        "Invalid Format. Only JPG and PNG files are allowed.",
        "error"
      );
      return;
    }

    const newImageObjects = validFiles.map((file) => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      x: 50,
      y: 50,
      width: 150,
      height: 150,
    }));

    setImages([...images, ...newImageObjects]);
  };

  const handleAlignImages = () => {
    const margin = 10;
    const { width, height } = containerSize;
    const halfWidth = (width - margin * 3) / 2;
    const halfHeight = (height - margin * 3) / 2;
    const thirdWidth = (width - margin * 3) / 2;
    const thirdHeight = (height - margin * 3) / 2;

    const layouts: {
      [key: number]: { x: number; y: number; width: number; height: number }[];
    } = {
      2: [
        { x: margin, y: margin, width: width - margin * 2, height: halfHeight },
        {
          x: margin,
          y: halfHeight + margin * 2,
          width: width - margin * 2,
          height: halfHeight,
        },
      ],
      3: [
        { x: margin, y: margin, width: thirdWidth, height: thirdHeight },
        {
          x: thirdWidth + margin * 2,
          y: margin,
          width: thirdWidth,
          height: thirdHeight,
        },
        {
          x: width / 4,
          y: thirdHeight + margin * 2,
          width: width / 2,
          height: thirdHeight,
        },
      ],
      4: [
        { x: margin, y: margin, width: halfWidth, height: halfHeight },
        {
          x: halfWidth + margin * 2,
          y: margin,
          width: halfWidth,
          height: halfHeight,
        },
        {
          x: margin,
          y: halfHeight + margin * 2,
          width: halfWidth,
          height: halfHeight,
        },
        {
          x: halfWidth + margin * 2,
          y: halfHeight + margin * 2,
          width: halfWidth,
          height: halfHeight,
        },
      ],
    };

    if (!layouts[images.length]) {
      Swal.fire(
        "Error",
        "Alignment is only supported for 2, 3, or 4 images.",
        "error"
      );
      return;
    }

    setImages(
      images.map((img, i) => ({ ...img, ...layouts[images.length][i] }))
    );
  };

  return (
    <div className="w-screen flex flex-col items-center">
      <div
        id="collage-container"
        className="relative border border-gray-500 bg-gray-300"
        style={{ width: containerSize.width, height: containerSize.height }}
      >
        {images.map((image) => (
          <Rnd
            key={image.id}
            size={{ width: image.width, height: image.height }}
            position={{ x: image.x, y: image.y }}
            bounds="parent"
            onDragStop={(e, d) =>
              handleDragResize(image.id, { ...image, x: d.x, y: d.y })
            }
            onResizeStop={(e, direction, ref, delta, position) =>
              handleDragResize(image.id, {
                ...image,
                width: ref.offsetWidth,
                height: ref.offsetHeight,
                x: position.x,
                y: position.y,
              })
            }
            style={{
              border: selectedImage === image.id ? "2px solid blue" : "none",
              cursor: "grab",
            }}
            onClick={() => setSelectedImage(image.id)}
          >
            <img
              src={image.url}
              alt="collage"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                pointerEvents: "none",
              }}
            />
          </Rnd>
        ))}
      </div>

      <div className="flex mt-4 gap-4 justify-between">
        <div className="flex flex-col gap-2">
          <button
            onClick={handleExportCollage}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Export Collage
          </button>

          {selectedImage !== null && (
            <button
              onClick={handleDeleteImage}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              <DeleteIcon /> Delete Image
            </button>
          )}
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => document.getElementById("add-image")?.click()}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            <AddIcon /> Add Image
          </button>
          <input
            id="add-image"
            type="file"
            accept=".jpg,.jpeg,.png"
            multiple
            onChange={(e) => handleAddImage(Array.from(e.target.files!))}
            className="hidden"
          />
          {(images.length === 2 ||
            images.length === 3 ||
            images.length === 4) && (
            <button
              onClick={handleAlignImages}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Align Images
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollageEditor;
