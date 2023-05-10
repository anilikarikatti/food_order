
const {getConnectionPool,getFormattedQuery} = require("../../config/db")

const login = async(req,res)=>{

    let {email,password}  = req.body;

    console.log(req.body);
    let query = 'select * from admin where email=?';

    let connection =await getConnectionPool()

    let formatdquery = await getFormattedQuery(connection,query,[email]);
    try {
        connection.query(formatdquery,(err,result)=>{
            console.log(result);
            if(result.length > 0){
                if(result[0].email == email && result[0].password == password){
                        res.render("admin/food_upload.html")
                    
                }
                else{
                    res.render("admin/adminLogin.html",{err:"wrong credentials"})
                }
            }
            else{
                res.render("admin/adminLogin.html",{err:"wrong credentials"})
            }
        })
    } catch (error) {
        console.log(error);
    }
    finally{
        connection.release()
    }
    
}

const getrestorents = async(req,res)=>{
    let connection = await getConnectionPool();

    let query = 'select * from restorents';

    try{
        connection.execute(query,(err,rows)=>{
        // console.log(rows);
        res.json(rows)

        });
    }
    catch(e){
        console.log(e);
    }
    finally{
        connection.release();
    }

}

const upload = async(req,res)=>{

    let connection = await getConnectionPool();

    let query = 'insert into foods(name,image,price) values(?,?,?)';
    
    let query1= 'insert into foods_hotel(food_id,restorent_id) values(?,?)';

    let {food_name,restorent,food_price} = req.body;
    let {filename} = req.file;

    console.log(req.body);
    // console.log(req.file.filename);
    // console.log("anil"); 

    try{
        if(food_name != undefined && filename != undefined){
            let formatdquery = await getFormattedQuery(connection,query,[food_name,filename,food_price])

            console.log(formatdquery);
            
            await connection.execute(formatdquery,async(err,rows)=>{

                let row_id = await rows.insertId;
               if(Array.isArray(restorent)) {
                    for(let i of restorent){
                        await connection.execute(query1,[row_id,i],async(err,rows)=>{
                            // console.log("inseted");
                            console.log(row_id,i);
                            console.log(rows);
                        })
                    }
               }
               else{
                await connection.execute(query1,[row_id,restorent],async(err,rows)=>{
                    // console.log("inseted");
                    console.log("executeed");
                })
               }
                // res.json("successfull")
                res.render("admin/food_upload.html",{data:"sucessfull"})

                
            });

       
        
        }
      

        
    }
    catch(e){
        console.log(e);
    }

    finally{
        connection.release();
    }

    
}

module.exports = {login,upload,getrestorents}