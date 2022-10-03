const getUploadedImagesUrl = require("../../utils/imageUpload");

const photoUpload = async (req, res) => {
  console.log(req.body);
  // if (!req.body.images || !req.files) {
  //   return res.status(400).send("Photo is not provided");
  // }
  const uploadedImages = await getUploadedImagesUrl(req.body, "posts");
  if (!uploadedImages || uploadedImages.length === 0) {
    return res.status(400).send({
      data: [],
      error: { message: "Photo is not provided or nothing was uploaded" },
    });
  }
  return res.status(200).json({ uploadedImages });
};

module.exports = photoUpload;
