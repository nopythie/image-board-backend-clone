const sharp = require("sharp");

export default async function getImageMetadata(path) {
  try {
    const metadata = await sharp(path).metadata();
    return metadata;
  } catch (error) {
    console.error("Error getting image metadata", error);
    throw error;
  }
}
