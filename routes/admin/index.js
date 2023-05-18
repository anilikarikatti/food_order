const express = require("express");

const router = express.Router();

const multer = require("multer")

const path = require("path")

let uploadFile = multer({dest:path.join(__dirname,'../../public/uploads')})

// console.log(uploadFile);

// console.log(__dirname+"public");

// console.log();


let {login,upload,getrestorents} = require("../../controllers/admin/login")


router.post("/login",login);

router.post("/upload",uploadFile.single('photo'),upload)

router.get("/getrestorents",getrestorents);

module.exports = router;