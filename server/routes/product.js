const router = require("express").Router();
const ctrls = require("../controllers/product");
const { verifyAccessToken, isAdmin } = require("../middleware/verifytoken");
const uploader = require("../config/cloudinary.config");

router.post("/", [verifyAccessToken, isAdmin], ctrls.createProduct);
router.get("/", ctrls.getAllProduct);
router.put("/ratings", verifyAccessToken, ctrls.ratings);

router.delete("/:pid", ctrls.deleteProduct);
router.put("/:pid", [verifyAccessToken, isAdmin], ctrls.updateProduct);
router.put(
  "/uploadimage/:pid",
  [verifyAccessToken, isAdmin],
  uploader.single("images"),
  ctrls.uploadImagesProduct
);
router.get("/:pid", ctrls.getProduct);

module.exports = router;
