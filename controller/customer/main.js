const {getConnectionPool,getFormattedQuery} = require("../../config/db")


let mainPage = async (req,res)=>{

    // console.log(req.url);
    // let {data} = req.query
    // console.log(data,req.query);
    let connection = await getConnectionPool();

    let query = 'select * from foods'

    try{
        await connection.execute(query,(err,rows)=>{
            // console.log(rows);
            res.render("html/index.html",{rows:rows});

        })
    }
    catch(e){
        console.log(e);
    }
    finally{
        connection.release()
    }
}


let loginpage = (req,res)=>{
    console.log(req.session.email);
    if(!req.session.email){
        res.render("html/login.html")
    }
    else{
        res.redirect("/customer/home")

    }
}


let login =async (req,res)=>{

    let connection = await getConnectionPool();

    let query = 'select * from customer where email = ? and password=?'

    let {email,password} = req.body;
    console.log(req.body);

    try {
        let formatedquery = await getFormattedQuery(connection , query , [email,password]);

        console.log(formatedquery);
        connection.execute(formatedquery,(err,result)=>{
            console.log(result.length);

            if(result.length > 0){
                console.log("entered");
                if(!req.session.email){
                    req.session.email = email;

                    console.log(req.session.email);
                    // res.render('html/index.html')
                    // mainPage()
                    res.redirect('/customer/home')
                }


            }
            else{
                res.redirect("/customer/loginpage")
            }
        })
    } catch (error) {
        
    }
    finally{
        connection.release()
    }

    
}

let addCart = async(req,res)=>{
    let {name,image,prize,id} = req.query;
    console.log(req.query);

    let connection  = await getConnectionPool();

    let query = "select restorents.name,restorents.id from restorents left join foods_hotel on restorents.id = foods_hotel.restorent_id where foods_hotel.food_id = ?";

    try{
        let formatedquery = await getFormattedQuery(connection,query,id);

        console.log(formatedquery);
        connection.execute(formatedquery,(err,result)=>{
            console.log(result);
            
            res.render("html/order.html",{name:name,image:image,price:prize,id:id,result:result});
        })

    }
    catch(e){

        console.log(e);
        res.render("html/home.html")
        }
        finally{
            connection.release()
        }

   
}



let order = async(req,res)=>{
    
    // console.log(req.body);
    let {quantity,totprice,id,restorent_id} = req.body;


    let connection = await getConnectionPool();
    let email = req.session.email;

    let query = "select id from customer where email=?"

    let query1= "insert into orders(customer_id,food_id,quantity,restorent_id,total_price) values(?,?,?,?,?)";
    try{
        let formatedquery = await getFormattedQuery(connection,query,email);

        connection.execute(formatedquery,async(err,result)=>{
            console.log(result);
        let formatedquery1 = await getFormattedQuery(connection,query1,[result[0].id,id,quantity,restorent_id,totprice]);

        console.log(formatedquery1);

            connection.execute(formatedquery1,(err,result)=>{
                res.redirect("/customer/yourorders?succ=you order successfull");
            })

        })
    }
    catch(err){
        console.log(err);
        res.redirect("/customer/order");
    }
    finally{
        connection.release()
    }
    // res.json("ordered")
}


let ordersbycustomer = async(req,res)=>{
    let connection = await getConnectionPool();
    let email = req.session.email;

    console.log(req.query);
    let {succ} = req.query;
    console.log(succ);

    query = "select o.customer_id,o.quantity,o.total_price,c.name,f.name as food_name,r.name as restorent_name,f.image from orders as o left join customer as c  on c.id = o.customer_id left join foods as f on f.id = o.food_id left join restorents as r on r.id = o.restorent_id  where c.email= ? order by o.id desc"

    try {
        let formatedquery = await getFormattedQuery(connection,query,email);


        connection.execute(formatedquery,(err,result)=>{
            res.render("html/yourorders.html",{data:result,name:result[0].name,succ1:succ},)
            
        })


        
    } catch (error) {
        console.log(error);
    }
    finally{
        connection.release()
    }
}


let register = (req,res)=>{
    res.render("html/register.html")
}



let registerUser = async(req,res)=>{
    let connection = await getConnectionPool();

    let {name,email,password,mobile_number} = req.body;


    query = "insert into customer(name,email,mobile_number,password) values(?,?,?,?)";

    try {
        let formatedquery = await getFormattedQuery(connection,query,[name,email,mobile_number,password]);

        console.log(formatedquery);

        connection.execute(formatedquery,(err,result)=>{
            // res.render("html/.html")
            res.redirect("/customer/loginpage")
            
        })


        
    } catch (error) {
        console.log(error);
        res.redirect("/customer/registerpage")
    }
    finally{
        connection.release()
    }
}
module.exports = {mainPage,loginpage,login,addCart,order,ordersbycustomer,register,registerUser}