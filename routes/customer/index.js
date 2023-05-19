const express = require("express");

const router = express.Router();

const {authCustomer} = require("../../middlewares/customer/auth")

let {mainPage,loginpage,login,addCart,order,ordersbycustomer,register,registerUser} = require("../../controllers/customer/main")

router.get("/home",mainPage)

router.get("/loginpage",loginpage);

router.post("/login",login);

router.get("/registerpage",register)

router.post("/register",registerUser)

router.get("/addCart",authCustomer,addCart);
// authCustomer,
router.post("/order",authCustomer,order);

router.get("/yourorders",authCustomer,ordersbycustomer);

module.exports = router;