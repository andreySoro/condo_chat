const {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
  uploadString,
} = require("firebase/storage");
const storage = require("../config/firebaseAppConfig");

async function getUploadedImagesUrl(files, storeId) {
  const images = [];
  if (Array.isArray(files)) {
    for (let i = 0; i < files.length; i++) {
      const image = files[i];
      try {
        const imageUrl = await uploadImages(image, storeId);
        images.push(imageUrl);
      } catch (error) {
        console.log("Error while uploading image", error);
      }
    }
  } else {
    try {
      const imageUrl = await uploadImages(files, storeId);
      images.push(imageUrl);
    } catch (error) {
      console.log("Error while uploading image", error);
    }
  }
  return images;
}

async function uploadImages(image, storeId) {
  const imageRef = ref(
    storage,
    `images/${storeId}/` + Date.now() + "-" + image.fileName
  );

  return await uploadString(imageRef, image.base64, "base64", {
    contentType: image.type,
  })
    .then((snapshot) => getDownloadURL(snapshot.ref))
    .catch((error) => error.message);
}

module.exports = getUploadedImagesUrl;
