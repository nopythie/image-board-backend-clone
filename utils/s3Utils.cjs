const {
  ListObjectsCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const deleteObjects = async (s3, bucketName) => {
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

const listObjects = async (s3, bucketName) => {
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

module.exports = {
  deleteObjects,
  listObjects,
};
