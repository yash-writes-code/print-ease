"use server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload a file to Cloudinary.
 */
export async function uploadFileToCloudinary(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "user-files",
        resource_type: "auto",
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Failed to upload file to Cloudinary"));
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete a file from Cloudinary.
 */
export async function deleteFileFromCloudinary(fileUrl: string) {
  try {
    const url = new URL(fileUrl);
    const pathname = url.pathname;

    const uploadIndex = pathname.indexOf("/upload/");
    if (uploadIndex === -1) {
      throw new Error("Invalid Cloudinary URL: '/upload/' segment not found.");
    }

    // Determine resource_type from URL path before '/upload/' (e.g. /<cloud_name>/image/upload)
    const prefix = pathname.substring(0, uploadIndex);
    const prefixSegments = prefix.split("/").filter(Boolean);
    const resourceType = prefixSegments[1] || "image";

    // Extract path after '/upload/' and strip version tag if present (e.g., v1234567890/)
    const afterUpload = pathname.substring(uploadIndex + "/upload/".length);
    const publicIdWithExt = afterUpload.replace(/^v\d+\//, "");

    // For 'raw' files, public_id retains extension; for images/others, extension is omitted
    const publicId =
      resourceType === "raw"
        ? publicIdWithExt
        : publicIdWithExt.replace(/\.[^/.]+$/, "");

    let result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType as any,
    });

    if (result.result !== "ok" && result.result !== "not found") {
      const fallbackType = resourceType === "image" ? "raw" : "image";
      const fallbackId =
        fallbackType === "raw"
          ? publicIdWithExt
          : publicIdWithExt.replace(/\.[^/.]+$/, "");
      result = await cloudinary.uploader.destroy(fallbackId, {
        resource_type: fallbackType,
      });
    }

    return {
      success: result.result === "ok",
      message: `File '${publicId}' deleted: ${result.result}`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Error deleting file: ${error.message}`,
    };
  }
}