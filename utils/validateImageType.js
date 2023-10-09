import { fileTypeFromBuffer } from "file-type";
export default async function validateImageType(path) {
  console.log(await fileTypeFromBuffer(path));
}
/* async function validateImageType(path) {

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
 */
