const sharp = require("sharp");

async function getImageMetadata(path) {
  try {
    const metadata = await sharp(path).metadata();
    return metadata;
  } catch (error) {
    console.error("Error getting image metadata", error);
    throw error;
  }
}

export default getImageMetadata;
