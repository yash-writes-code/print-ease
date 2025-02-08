import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const stageRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    const loadImages = async () => {
      const imageObjects = await Promise.all(
        initialImages.map((file) => {
          return new Promise((resolve) => {
            const url = URL.createObjectURL(file);
            const img = new window.Image();
            img.src = url;
            img.onload = () => {
              resolve({
                id: file.name,
                img,
                x: 50,
                y: 50,
                width: 100,
                height: 100,
              });
            };
          });
        })
      );
      setImages(imageObjects);

      return () => {
        imageObjects.forEach((img: any) => URL.revokeObjectURL(img.img.src));
      };
    };

    loadImages();
  }, [initialImages]);

  useEffect(() => {
    if (trRef.current && selectedImage) {
      const selectedNode = stageRef.current.findOne(`#${selectedImage}`);
      if (selectedNode) {
        trRef.current.nodes([selectedNode]);
        trRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedImage, images]);

  const handleExportCollage = async () => {
    const stage = stageRef.current;
    const dataURL = stage.toDataURL({ pixelRatio: 2 }); // Increases resolution
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

  const handleDragMove = (id: string, e: any) => {
    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === id ? { ...img, x: e.target.x(), y: e.target.y() } : img
      )
    );
  };

  const handleTransform = (id: string, e: any) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const newWidth = node.width() * scaleX;
    const newHeight = node.height() * scaleY;
    node.scaleX(1);
    node.scaleY(1);
    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === id
          ? {
              ...img,
              x: node.x(),
              y: node.y(),
              width: newWidth,
              height: newHeight,
            }
          : img
      )
    );
  };

  const handleDeleteImage = () => {
    if (!selectedImage) return;
    setImages(images.filter((image) => image.id !== selectedImage));
    setSelectedImage(null);
  };

  const handleAlignImages = () => {
    const margin = 10;
    if (images.length === 2) {
      setImages([
        { ...images[0], x: margin, y: margin, width: 240, height: 480 },
        { ...images[1], x: 260, y: margin, width: 240, height: 480 },
      ]);
    } else if (images.length === 4) {
      setImages([
        { ...images[0], x: margin, y: margin, width: 240, height: 240 },
        { ...images[1], x: 260, y: margin, width: 240, height: 240 },
        { ...images[2], x: margin, y: 260, width: 240, height: 240 },
        { ...images[3], x: 260, y: 260, width: 240, height: 240 },
      ]);
    } else {
      Swal.fire(
        "Error",
        "Alignment is only supported for 2 or 4 images.",
        "error"
      );
    }
  };

  return (
    <div className="w-screen flex flex-col items-center">
      <Stage
        width={500}
        height={500}
        ref={stageRef}
        className="border border-gray-500 bg-gray-300"
        onMouseDown={(e) => {
          // Deselect when clicked on empty area
          if (e.target === e.target.getStage()) {
            setSelectedImage(null);
          }
        }}
      >
        <Layer>
          {images.map((image) => (
            <React.Fragment key={image.id}>
              <KonvaImage
                id={image.id}
                image={image.img}
                x={image.x}
                y={image.y}
                width={image.width}
                height={image.height}
                draggable
                onDragMove={(e) => handleDragMove(image.id, e)}
                onTransformEnd={(e) => handleTransform(image.id, e)}
                onClick={() => setSelectedImage(image.id)}
              />
              {selectedImage === image.id && (
                <Transformer
                  ref={trRef}
                  resizeEnabled={true}
                  rotateEnabled={true}
                  enabledAnchors={[
                    "top-left",
                    "top-right",
                    "bottom-left",
                    "bottom-right",
                    "middle-left",
                    "middle-right",
                    "top-center",
                    "bottom-center",
                  ]}
                  boundBoxFunc={(oldBox, newBox) => {
                    if (newBox.width < 50 || newBox.height < 50) {
                      return oldBox;
                    }
                    return newBox;
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </Layer>
      </Stage>

      <div className="flex mt-4 gap-4">
        <button
          onClick={handleExportCollage}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Export Collage
        </button>
        {selectedImage && (
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
        {(images.length === 2 || images.length === 4) && (
          <button
            onClick={handleAlignImages}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Align Images
          </button>
        )}
      </div>
    </div>
  );
};

export default CollageEditor;
