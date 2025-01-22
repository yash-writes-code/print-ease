import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

export const CollageEditor = ({
  initialImages = [],
  onSave,
  onCancel,
}: {
  initialImages?: File[];
  onSave: (collage: File) => void;
  onCancel: () => void;
}) => {
  const [images, setImages] = useState<File[]>(initialImages);
  const [positions, setPositions] = useState<{ [key: string]: any }>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleAddImages = (newFiles: File[]) => {
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

    setImages([...images, ...validFiles]);
  };

  const handleExportCollage = async () => {
    const collageElement = document.getElementById("collage-container");
    if (collageElement) {
      // Capture the full content of the container including the scrollable area
      const canvas = await html2canvas(collageElement, {
        scale: 2,
        scrollX: collageElement.scrollLeft, // Ensure scroll is accounted for
        scrollY: collageElement.scrollTop, // Ensure scroll is accounted for
        width: collageElement.scrollWidth, // Full width of the container
        height: collageElement.scrollHeight, // Full height of the container
      });

      const imgData = canvas.toDataURL("image/jpeg");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      const pdfBlob = pdf.output("blob");
      const file = new File([pdfBlob], "collage.pdf", {
        type: "application/pdf",
      });
      onSave(file);
    }
  };

  const handleImageResize = (imageName: string, position: any) => {
    setPositions((prev) => ({
      ...prev,
      [imageName]: position,
    }));
  };

  const handleDeleteImage = () => {
    if (!selectedImage) return;

    setImages(images.filter((image) => image.name !== selectedImage));
    setPositions((prev) => {
      const newPositions = { ...prev };
      delete newPositions[selectedImage];
      return newPositions;
    });
    setSelectedImage(null);
  };

  const handleAlignment = (type: "2x2" | "4x4") => {
    const containerWidth = 500; // A4 width in mm
    const containerHeight = 500; // A4 height in mm
    const margin = 10; // Margin between images

    let rows = 0,
      cols = 0;

    // Define grid dimensions based on the type
    if (type === "2x2") {
      rows = 2; // 2 rows
      cols = 1; // 1 column (2 images total)
    } else if (type === "4x4") {
      rows = 2; // 2 rows
      cols = 2; // 2 columns (4 images total)
    }

    // Ensure the number of images matches the required layout
    const requiredImages = rows * cols;
    if (images.length !== requiredImages) {
      Swal.fire(
        "Error",
        `You need exactly ${requiredImages} images for ${type} alignment.`,
        "error"
      );
      return;
    }

    // Calculate image dimensions considering margins
    const imageWidth = (containerWidth - margin * (cols + 1)) / cols;
    const imageHeight = (containerHeight - margin * (rows + 1)) / rows;

    // Calculate positions for each image
    const newPositions: { [key: string]: any } = {};
    images.forEach((image, index) => {
      const row = Math.floor(index / cols); // Row index
      const col = index % cols; // Column index

      newPositions[image.name] = {
        x: margin + col * (imageWidth + margin), // X-coordinate (spacing between columns)
        y: margin + row * (imageHeight + margin), // Y-coordinate (spacing between rows)
        width: imageWidth, // Image width
        height: imageHeight, // Image height (adjusted with margins)
      };
    });

    setPositions(newPositions);
  };

  return (
    <div className="absolute flex flex-col items-center">
      {/* Alignment Buttons */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => handleAlignment("2x2")}
          className="mt-4 p-[3px] relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg" />
          <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
            2x2
          </div>
        </button>
        <button
          onClick={() => handleAlignment("4x4")}
          className="mt-4 p-[3px] relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg" />
          <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
            4x4
          </div>
        </button>
      </div>

      {/* Collage Container */}
      <div
        id="collage-container"
        className="relative bg-gray-300 border border-gray-500"
        style={{
          width: "500px", // A4 width in mm
          height: "500px", // A4 height in mm
          margin: "0 auto", // Center the container
          overflow: "hidden", // Hide overflow to ensure full page fit
        }}
      >
        {images.map((image, index) => {
          const imageUrl = URL.createObjectURL(image);
          const position = positions[image.name] || {
            x: 50 * index,
            y: 50 * index,
            width: 100,
            height: 100,
          };
          return (
            <Rnd
              key={index}
              position={{
                x: position.x,
                y: position.y,
              }}
              size={{
                width: position.width,
                height: position.height,
              }}
              bounds="parent"
              enableResizing
              onDragStop={(e, d) =>
                handleImageResize(image.name, {
                  ...position,
                  x: d.x,
                  y: d.y,
                })
              }
              onResizeStop={(e, direction, ref, delta, position) =>
                handleImageResize(image.name, {
                  ...position,
                  width: parseFloat(ref.style.width),
                  height: parseFloat(ref.style.height),
                })
              }
              onClick={() => setSelectedImage(image.name)}
            >
              <img
                src={imageUrl}
                alt={`collage-${index}`}
                className={`absolute object-cover ${
                  selectedImage === image.name ? "ring-2 ring-blue-500" : ""
                }`}
                style={{ width: "100%", height: "100%" }}
              />
            </Rnd>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row mt-4 gap-4 flex-wrap justify-center">
        <button onClick={handleExportCollage} className="mt-4 p-[3px] relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 rounded-lg" />
          <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
            Export Collage
          </div>
        </button>
        <button
          className="mt-4 p-[3px] relative"
          onClick={() => document.getElementById("add-more-images")?.click()}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg" />
          <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
            Add More Images
          </div>
        </button>
        {selectedImage && (
          <button className="mt-4 p-[3px] relative" onClick={handleDeleteImage}>
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 rounded-lg" />
            <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
              <DeleteIcon /> Delete Image
            </div>
          </button>
        )}
        <button className="mt-4 p-[3px] relative" onClick={onCancel}>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg" />
          <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
            Cancel
          </div>
        </button>
      </div>
      <input
        id="add-more-images"
        type="file"
        accept=".jpg,.jpeg,.png"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            handleAddImages(Array.from(e.target.files));
          }
        }}
      />
    </div>
  );
};
