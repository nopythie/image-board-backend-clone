const { validateMIMEType } = require("validate-image-type");
const { imageType } = require("image-type");
async function validateImageType(path) {
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
