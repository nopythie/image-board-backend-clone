import { validateMIMEType } from "validate-image-type";
import { fileTypeFromBuffer } from "file-type";

async function validateImageType(path) {
  console.log(await fileTypeFromBuffer(path));
  const buffer = imageType(path);
  const result = await validateMIMEType(buffer, {
    allowMimeTypes: [
      "image/jpeg",
      "image/gif",
      "image/png",
      "image/jpg",
      "image/svg+xml",
    ],
  });
  return result;
}

module.exports = { validateImageType };
