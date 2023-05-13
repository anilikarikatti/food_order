
const {getConnectionPool,getFormattedQuery} = require("../../config/db")

    
let loginpage = (req,res)=>{
    
        res.render("restorent/login.html")
   
}


let login =async (req,res)=>{

    let connection = await getConnectionPool();

    let query = 'select * from restorents where email = ? and password=?';

    let query1 = "select o.customer_id,o.quantity,o.total_price,c.name,c.mobile_number,f.name as food_name,r.name as restorent_name,f.image from orders as o left join customer as c  on c.id = o.customer_id left join foods as f on f.id = o.food_id left join restorents as r on r.id = o.restorent_id  where r.email = ? order by o.id desc";

    let {email,password} = req.body;
    console.log(req.body);

    try {
        let formatedquery = await getFormattedQuery(connection , query , [email,password]);

        connection.execute(formatedquery,async(err,result)=>{
            console.log(result.length);
            let name = result[0].name;

            let formatedquery1 = await getFormattedQuery(connection , query1 , [email]);

            console.log(formatedquery1);
            connection.execute(formatedquery1,(err,result)=>{
                console.log(result);
                res.render("restorent/home.html",{name:name,data:result})
                
            })
            
                
                })


            
        
    } catch (error) {
        
    }
    finally{
        connection.release()
    }

    
}


module.exports = {login,loginpage}