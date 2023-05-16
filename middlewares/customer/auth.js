
let authCustomer = (req,res,next)=>{
    if(req.session.email){
        console.log("welcome");

        next()
    }
    else{
        res.redirect("/customer/loginpage")
    }
}

module.exports = {authCustomer}