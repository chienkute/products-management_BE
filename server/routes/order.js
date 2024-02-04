const router = require("express").Router();
const ctrls = require("../controllers/order");
const { verifyAccessToken, isAdmin } = require("../middleware/verifytoken");

router.post("/", verifyAccessToken, ctrls.createOrder);

module.exports = router;
