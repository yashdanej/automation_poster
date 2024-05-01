const express = require('express');
const { User } = require('../controller/userController');
const { upload } = require('../utils/upload');
const router = express.Router();

router
    .post("/", upload.single("avatar"), User)

exports.router = router;