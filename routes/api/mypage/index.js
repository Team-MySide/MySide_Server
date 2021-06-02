var express = require('express');
var router = express.Router();

router.use('/', require('./mypage.js'));
router.use('/health', require('./health.js'));
router.use('/profile', require('./profile.js'));
router.use('/faq', require('./faq.js'));


module.exports = router;
