const { fileTypeFromBuffer } = require("file-type");
async function validateImageType(path) {
  console.log(await fileTypeFromBuffer(path));
}

module.exports = { validateImageType };
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
