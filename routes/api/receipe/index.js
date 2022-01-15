var express = require('express');
var router = express.Router();



router.use("/", require("./receipe"));
router.use("/month", require("./month"));
router.use("/like", require("./like"));
router.use("/save", require("./save"));
router.use("/share", require("./share"));
router.use("/mypage", require("./mypage"));
router.use("/mainfood", require("./mainfood"));


module.exports = router;