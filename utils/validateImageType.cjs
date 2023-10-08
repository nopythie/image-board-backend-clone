const { validateMIMEType } = require("validate-image-type");

async function validateImageType(path) {
  const result = await validateMIMEType(path, {
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
