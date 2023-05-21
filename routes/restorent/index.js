const express = require("express")

const router = express.Router()

let {loginpage,login} = require("../../controllers/restorent/main");

router.get("/",loginpage);

router.post("/home",login)


module.exports = router