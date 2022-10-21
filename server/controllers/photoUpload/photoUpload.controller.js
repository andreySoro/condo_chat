const getUploadedImagesUrl = require("../../utils/imageUpload");
const getUidFromToken = require("../../utils/getUidFromToken");
const User = require('../../models/User');

const photoUpload = async (req, res) => {
  const UserId = req.UserId;
  const token = await getUidFromToken(req.headers.authorization.split(" ")[1]);
  console.log(req.body.photos);
  console.log(req.body.folder);
  if (!req.body.photos || (!req.body.folder && req.body.folder !== 0)) {
    return res.status(400).send("Photo or folder is not provided");
  }
  const folder = ["profile", "posts", "comments"];
  
  const uploadedImages = await getUploadedImagesUrl(
    req.body.photos,
    folder[req.body.folder],
    token,
  );

  if (!uploadedImages || uploadedImages.length === 0) {
    return res.status(400).send({
      data: [],
      error: { message: "Photo is not provided or nothing was uploaded" },
    });
  }

  // Upon successful upload complete any bookkeeping tasks for the user
  //  regarding the upload.
  if (req.body.folder === 0) {
    // If it was a profile image, set the users profileImgUri
    //  to the new Uri.
    console.log(`Attempting to set User profileImgUri to: ${uploadedImages[0]}`);
    const userUpdate = await User.findOneAndUpdate(
      { id: UserId },
      {
        $set: {
          profileImgUri: uploadedImages[0]
        }
      },
      { new: true }
    );
    // Catch error and handle before committing.
  }

  return res.status(200).json({ uploadedImages });
};

const profilePhotoUpload = async (req, res) => {
  // For old approach, likely no longer need.
  // const UserId = req.UserId;
  if (req.files.length !== 1) {
    return res.status(401).send({
      data: [],
      error: {
        message: "Please provide only a single image file."
      }
    })
  }

  // Check that the extension is either a jpg, jpeg, or png.
  const extension = req.body.photos[0].originalname.split('.')[1];

  if (extension !== 'jpg'
    && extension !== 'jpeg'
    && extension !== 'png') {
    return res.status(401).send({
      data: [],
      error: { message: "Please provide a file with one of the following extensions: [jpg, jpeg, png]" }
    })
  }

  const uploadedImages = await getUploadedImagesUrl(
    req?.body?.photos,
    `profile`,
    1 // You may only upload a single file for this endpoint.
  );

  if (!uploadedImages || uploadedImages.length === 0) {
    return res.status(400).send({
      data: [],
      error: { message: "Photo is not provided or nothing was uploaded" },
    });
  }

  return res.status(200).json({ uploadedImages });
}

module.exports = {
  photoUpload,
  profilePhotoUpload,
};
