import { NextRequest, NextResponse } from "next/server";
import { BlobServiceClient } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";
import formidable from "formidable"

// Configure formidable to parse multipart form-data
export const config = {
  api: {
    bodyParser: false, // Disable default body parsing
  },
};


async function streamToBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    if (value) {
      chunks.push(value);
    }
    done = readerDone;
  }

  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("file") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files uploaded" },
        { status: 400 }
      );
    }

    const ACCOUNT_NAME = process.env.NEXT_PUBLIC_ACCOUNT_NAME || "";
    const CONTAINER_NAME = "user-files"; // Replace with your container name

    // Initialize Blob Service Client
    const blobServiceClient = new BlobServiceClient(
      `https://${ACCOUNT_NAME}.blob.core.windows.net`,
      new DefaultAzureCredential()
    );

    // Get container client
    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

    // Ensure container exists
    const createContainerResponse = await containerClient.createIfNotExists();
    if (createContainerResponse.succeeded) {
      console.log(`Container "${CONTAINER_NAME}" created successfully.`);
    }

    const uploadResults = [];
    for (const file of files) {
      const blockBlobClient = containerClient.getBlockBlobClient(file.name);

      // Convert stream to Buffer
      const buffer = await streamToBuffer(file.stream());
      console.log(`Uploading file: ${file.name}`);

      const uploadBlobResponse = await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: { blobContentType: file.type }, // Set MIME type
      });

      uploadResults.push({
        fileName: file.name,
        requestId: uploadBlobResponse.requestId,
        url: blockBlobClient.url,
      });

      console.log(
        `Uploaded "${file.name}" successfully. Request ID: ${uploadBlobResponse.requestId}`
      );
    }

    return NextResponse.json(
      { message: "Files uploaded successfully", cnt: uploadResults },
      { status: 200 }
    );
  } catch (error:any) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { error: "Failed to upload files", details: error.message },
      { status: 500 }
    );
  }
}