
const admin = require("firebase-admin")
const uuid = require("uuid");

async function getUploadedImagesUrl(files, folder, userId) {
  const images =[]
  const filePath = `images/${folder}/${userId}/${Date.now() + "-"+ files.originalname}`;
  const bucket = admin.storage().bucket()
  const uploadImage = (filePath, file) => {
    return new Promise((resolve, reject) => {
      const blob = bucket.file(filePath);
      const uuidToken = uuid.v4()
      const blobStream = blob.createWriteStream({
        gzip: true,
        resumable: false,
        contentType: file.mimetype,
        metadata: {
          metadata: {
            firebaseStorageDownloadTokens: uuidToken,
          }
        }
      });
      blobStream.on('error', (error) => {
        reject(error);
      });
      blobStream.on('finish', () => {
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media&token=${uuidToken}`;
        resolve(publicUrl);
      });
      blobStream.end(file.buffer, 'base64');
    });
  }

  const url = await uploadImage(filePath, files).then(data => data)
  images.push(url)
  return images
}

module.exports = getUploadedImagesUrl;
