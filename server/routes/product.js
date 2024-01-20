const router = require("express").Router();
const ctrls = require("../controllers/product");
const { verifyAccessToken, isAdmin } = require("../middleware/verifytoken");

router.post("/", [verifyAccessToken, isAdmin], ctrls.createProduct);
router.get("/", ctrls.getAllProduct);

router.delete("/:pid", ctrls.deleteProduct);
router.put("/:pid", [verifyAccessToken, isAdmin], ctrls.updateProduct);
router.get("/:pid", ctrls.getProduct);

module.exports = router;
