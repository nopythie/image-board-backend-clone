const imageType = require("image-type");

function validateImageType(buffer) {
  const type = imageType(buffer);

  if (type) {
    const mimeTypes = [
      "image/jpeg",
      "image/gif",
      "image/png",
      "image/jpg",
      "image/svg+xml",
    ];
    if (mimeTypes.includes(type.mime)) {
      return { ok: true, type: type.mime };
    }
  }

  return { ok: false, error: "Invalid image type." };
}

module.exports = { validateImageType };
