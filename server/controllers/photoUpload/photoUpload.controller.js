const getUploadedImagesUrl = require("../../utils/imageUpload");
const User = require("../../models/User");

const admin = require("firebase-admin");

const photoUpload = async (req, res) => {
  try {
    const UserId = req.UserId;

    if (!req.body.photos || (!req.body.folder && req.body.folder !== 0)) {
      return res.status(400).send("Photo or folder is not provided");
    }
    const folder = ["profile", "posts", "comments"];

    console.log(`IMAGE NAME:: ${req.body.photos.originalname}`);

    const uploadedImages = await getUploadedImagesUrl(
      req.body.photos,
      folder[req.body.folder],
      UserId
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
      // If it was a profile image
      if (req.body.photos.length !== 1) {
        return res.status(400).send({
          data: [],
          error: { message: "Please provide only 1 photo as a profile upload" },
        });
      }

      const user = await User.findOne({ id: UserId });
      const oldUri = user.profileImgUri;

      if (oldUri) {
        // Find and delete the old image from our bucket.
        try {
          const bucket = admin.storage().bucket();
          const oldFile = bucket.file(oldUri);

          await oldFile.delete();
        } catch (e) {
          console.error('Error deleting old image from bucket.');
          console.error(e);
        }
      }

      // Set the users profileImgUri
      //  to the new Uri.
      console.log(
        `Attempting to set User profileImgUri to: ${uploadedImages[0]}`
      );
      const userUpdate = await User.findOneAndUpdate(
        { id: UserId },
        {
          $set: {
            profileImgUri: uploadedImages[0],
          },
        },
        { new: true }
      );
      // Catch error and handle before committing.
    }

    return res.status(200).json({ uploadedImages });
  } catch (e) {
    console.error('Issue with Image Upload');
    console.error(e);
    return res.status(500).json({ data: [], error: "Unexpected error uploading image." });
  }
};

const profilePhotoUpload = async (req, res) => {
  // For old approach, likely no longer need.
  // const UserId = req.UserId;
  if (req.files.length !== 1) {
    return res.status(401).send({
      data: [],
      error: {
        message: "Please provide only a single image file.",
      },
    });
  }

  // Check that the extension is either a jpg, jpeg, or png.
  const extension = req.body.photos[0].originalname.split(".")[1];

  if (extension !== "jpg" && extension !== "jpeg" && extension !== "png") {
    return res.status(401).send({
      data: [],
      error: {
        message:
          "Please provide a file with one of the following extensions: [jpg, jpeg, png]",
      },
    });
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
};

module.exports = {
  photoUpload,
  profilePhotoUpload,
};
