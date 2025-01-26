
import { NextRequest, NextResponse } from "next/server";
import { BlobServiceClient } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";
import mongoose from "mongoose";
// import FileModel from "@/app/models/File"; // Adjust import path for your File model
// import PrintDoc from "@/app/models/PrintDoc"; // Adjust import path for your PrintDoc model
import axios from "axios";
import { Config } from "@/interfaces";

// Helper function to convert a readable stream to a Buffer
async function streamToBuffer(stream: ReadableStream): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false, // Disable body parsing
  },
};

export async function POST(req: NextRequest) {
  try {
    // Parse FormData from the request
    const formData = await req.formData();

    // Extract paymentId, userId, and storeId
    const paymentId = formData.get("paymentId") as string;
    const userId = formData.get("user_id") as string;
    const storeId = "1"

    if (!paymentId || !userId || !storeId) {
      return NextResponse.json(
        { error: "Missing required fields: paymentId, user_id, or store_id" },
        { status: 400 }
      );
    }

    const filesWithConfigs: Array<{ file: File; config: Config }> = [];
    formData.forEach((value, key) => {
      if (key.startsWith("file_")) {
        const index = key.split("_")[1];
        const file = value as File;
        const configKey = `config_${index}`;
        const config = formData.get(configKey);

        if (config) {
          filesWithConfigs.push({
            file,
            config: JSON.parse(config as string),
          });
        }
      }
    });

    if (filesWithConfigs.length === 0) {
      return NextResponse.json(
        { error: "No files or configurations provided" },
        { status: 400 }
      );
    }

    const ACCOUNT_NAME = process.env.NEXT_PUBLIC_ACCOUNT_NAME || "";
    const CONTAINER_NAME = "user-files";

    // Initialize Blob Service Client
    const blobServiceClient = new BlobServiceClient(
      `https://${ACCOUNT_NAME}.blob.core.windows.net`,
      new DefaultAzureCredential()
    );

    // Get container client and ensure the container exists
    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    const createContainerResponse = await containerClient.createIfNotExists();
    if (createContainerResponse.succeeded) {
      console.log(`Container "${CONTAINER_NAME}" created successfully.`);
    }

    const uploadedFileIds: mongoose.Types.ObjectId[] = [];
    let cost=0;
    for (const { file, config } of filesWithConfigs) {
      const blockBlobClient = containerClient.getBlockBlobClient(file.name);

      // Convert the file stream to Buffer
      const buffer = await streamToBuffer(file.stream());
      console.log(`Uploading file: ${file.name} with config:`, config);

      const uploadBlobResponse = await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: { blobContentType: file.type }, // Set MIME type
      });
      const link = blockBlobClient.url;
      cost += config.totalPrice;

  
      const file_create = await axios.post('http://localhost:3000/api/file',{
        userId : userId,
        link:link,
        color:config.color,
        orientation : config.orientation,
        sided:config.sided,
        remarks:config.remarks,
        copies:config.copies,
        specificRange:config.specificRange,
        pagesToPrint :config.pagesToPrint,
      })
      uploadedFileIds.push(file_create.data.id);
      

      console.log(
        `Uploaded "${file.name}" successfully. Request ID: ${uploadBlobResponse.requestId}`
      );
    }

    // Create a new PrintDoc instance
    const printDoc_create = await axios.post("http://localhost:3000/api/printdoc",{
      userID: userId,
      fileID: uploadedFileIds,
      storeID: "0001",
      status: "pending",
      type: "print",
      cost: cost,
      paymentId: paymentId,
    });
    
    console.log("printdoc instance created");
    

    return NextResponse.json(
      { message: "Files uploaded and PrintDoc created successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error uploading files or creating PrintDoc:", error);
    
    //CODE FOR REFUND GOES HERE
    return NextResponse.json(
      { error: "Failed to process the request", details: error.message },
      { status: 500 }
    );
  }
}
