const getUploadedImagesUrl = require("../../utils/imageUpload");
const getUidFromToken = require("../../utils/getUidFromToken");

const photoUpload = async (req, res) => {
  const token = await getUidFromToken(req.headers.authorization.split(" ")[1]);
  if (!req.body.photos || !req.body.folder) {
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
  return res.status(200).json({ uploadedImages });
};

module.exports = photoUpload;
