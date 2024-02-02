const router = require("express").Router();
const ctrls = require("../controllers/blog");
const { verifyAccessToken, isAdmin } = require("../middleware/verifytoken");

router.get("/", ctrls.getBlogs);
router.post("/", [verifyAccessToken, isAdmin], ctrls.createBlog);
router.get("/:bid", ctrls.getBlog);
router.put("/:bid", [verifyAccessToken, isAdmin], ctrls.updateBlog);
router.delete("/:bid", [verifyAccessToken, isAdmin], ctrls.deleteBlog);
module.exports = router;
