const getUploadedImagesUrl = require("../../utils/imageUpload");

const photoUpload = async (req, res) => {
  console.log(req.body);
  // if (!req.body.images || !req.files) {
  //   return res.status(400).send("Photo is not provided");
  // }
  const uploadedImages = await getUploadedImagesUrl(req.body, "posts");
  return res.status(200).json({ uploadedImages });
};

module.exports = photoUpload;
