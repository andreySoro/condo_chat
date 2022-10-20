const {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
  uploadString,
} = require("firebase/storage");
const storage = require("../config/firebaseAppConfig");

async function getUploadedImagesUrl(files, folder, fileLimit = Number.MAX_SAFE_INTEGER) {
  const images = [];
  if (Array.isArray(files)) {
    if (files.length > fileLimit) {
      console.error('Provided images exceed file limit.');
      return images;
    }
    for (let i = 0; i < files.length; i++) {
      const image = files[i];
      try {
        const imageUrl = await uploadImages(image, folder);
        images.push(imageUrl);
      } catch (error) {
        console.log("Error while uploading image", error);
      }
    }
  } else {
    try {
      const imageUrl = await uploadImages(files, folder);
      images.push(imageUrl);
    } catch (error) {
      console.log("Error while uploading image", error);
    }
  }
  return images;
}

// Date.now() call etc should not be part of the basic upload image call,
//  in case we need to specifically name images themselves a more generic approach
//  should be taken, and we can add name as an argument so that when these
//  actions need to be performed, they can be performed outside the function
//  call.
// Additionally, we need a way to check for images that already exist under the
//  same name and to modify the name if so, to avoid overwriting old images that
//  we may still want.
async function uploadImages(image, folder) {
  const imageRef = ref(
    storage,
    `images/${folder}/` + Date.now() + "-" + image.fileName
  );

  return await uploadString(imageRef, image.base64, "base64", {
    contentType: image.type || image.mimetype,
  })
    .then((snapshot) => getDownloadURL(snapshot.ref))
    .catch((error) => error.message);
}

module.exports = getUploadedImagesUrl;
