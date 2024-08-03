import { Readable } from "stream";
import path from "path";
import fs from "fs";

async function uploadCSV(fileBuffer) {
  try {
    const __dirname = path.resolve();
    const uploadDir = path.join(__dirname, "public", "temp");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadFilePath = path.join(uploadDir, "upload.csv");
    const fileStream = Readable.from([fileBuffer]);
    const writeStream = fs.createWriteStream(uploadFilePath);

    fileStream.pipe(writeStream);

    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    console.log(uploadFilePath);
    return uploadFilePath;
  } catch (error) {
    console.error("Error uploading CSV file:", error);
    throw new Error("Failed to upload CSV file");
  }
}

export default uploadCSV;
