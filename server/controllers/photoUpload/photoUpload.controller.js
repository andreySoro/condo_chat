const getUploadedImagesUrl = require("../../utils/imageUpload");

const photoUpload = async (req, res) => {
  if (!req.files || !req.body) {
    return res.status(400).send("Photo is not provided");
  }
  console.log(req.body);
  const uploadedImages = await getUploadedImagesUrl(
    [JSON.parse(req.body.photo)],
    "posts"
  );
  return res.status(200).json({ uploadedImages });
};

module.exports = photoUpload;
