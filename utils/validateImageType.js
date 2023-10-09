import { fileTypeFromBuffer } from "file-type";

const allowedMimeTypes = [
  "image/jpeg",
  "image/gif",
  "image/png",
  "image/jpg",
  "image/svg+xml",
];

export default async function validateImageType(imageBuffer) {
  try {
    const fileInfo = await fileTypeFromBuffer(imageBuffer);
    console.log(fileInfo);
    if (fileInfo && allowedMimeTypes.includes(fileInfo.mime)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error validating image type", error);
    throw error;
  }
}
