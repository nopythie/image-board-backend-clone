const {
  ListObjectsCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const bucketName = process.env.CYCLIC_BUCKET_NAME;
const { S3Client } = require("@aws-sdk/client-s3");
const s3 = new S3Client();

const deleteObjects = async (bucketName) => {
  try {
    // Liste tous les objets dans le bucket
    const data = await s3.send(new ListObjectsCommand({ Bucket: bucketName }));

    // Supprime chaque objet individuellement
    for (const content of data.Contents) {
      const deleteObjectParams = {
        Bucket: bucketName,
        Key: content.Key,
      };

      await s3.send(new DeleteObjectCommand(deleteObjectParams));

      console.log(`Objet ${content.Key} supprimé.`);
    }

    console.log("Tous les objets ont été supprimés avec succès.");
  } catch (error) {
    console.error("Erreur lors de la suppression des objets :", error);
  }
};

const listObjects = async () => {
  const params = {
    Bucket: bucketName,
  };
  const command = new ListObjectsCommand(params);
  try {
    const data = await s3.send(command);
    console.log("Objets dans le bucket:");
    data.Contents.forEach((object) => {
      console.log(object.Key);
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const downloadImageFromS3 = async (imagePath) => {
  const params = {
    Bucket: bucketName,
    Key: imagePath,
  };

  try {
    const data = await s3.getObject(params).promise();
    return data.Body;
  } catch (error) {
    console.error(
      "Erreur lors du téléchargement de l'image depuis S3 :",
      error
    );
    throw new Error("Impossible de télécharger l'image depuis S3");
  }
};

module.exports = {
  deleteObjects,
  listObjects,
  downloadImageFromS3,
};
