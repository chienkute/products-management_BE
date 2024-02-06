const router = require("express").Router();
const ctrls = require("../controllers/order");
const { verifyAccessToken } = require("../middleware/verifytoken");

router.post("/", verifyAccessToken, ctrls.createOrder);
router.get("/", verifyAccessToken, ctrls.getUserOrder);

module.exports = router;
