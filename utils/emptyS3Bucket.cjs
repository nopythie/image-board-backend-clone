const {
  ListObjectsCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const deleteObjects = async (s3Client, bucketName) => {
  try {
    // Liste tous les objets dans le bucket
    const data = await s3Client.send(
      new ListObjectsCommand({ Bucket: bucketName })
    );

    // Supprime chaque objet individuellement
    for (const content of data.Contents) {
      const deleteObjectParams = {
        Bucket: bucketName,
        Key: content.Key,
      };

      await s3Client.send(new DeleteObjectCommand(deleteObjectParams));

      console.log(`Objet ${content.Key} supprimé.`);
    }

    console.log("Tous les objets ont été supprimés avec succès.");
  } catch (error) {
    console.error("Erreur lors de la suppression des objets :", error);
  }
};

module.exports = {
  deleteObjects,
};
