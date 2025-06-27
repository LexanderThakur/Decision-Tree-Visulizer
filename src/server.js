import express from 'express'
import path,{dirname} from 'path'
import { fileURLToPath } from 'url'
import fetch from 'node-fetch';
const app=express()

const PORT=  process.env.PORT || 3000;


const __filename=fileURLToPath(import.meta.url)
const __dirname=dirname(__filename)


app.use(express.json())
app.use(express.static(path.join(__dirname,"../public/")))


app.get('/',(req,res)=>{

res.sendFile(path.join(__dirname,'public','index.html'))

})


app.post('/Generate',async (req,res)=>{
    const {n_Samples,num_Clusters,variance,max_depth}=req.body;

    


    try{
        const flaskResponse=await fetch('https://decision-tree-visulizer-1.onrender.com',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({n_Samples,num_Clusters,variance,max_depth})

        });

        const flaskData=await flaskResponse.json();
        console.log(flaskData.message)
        res.json({flaskData} );  
    }
    catch(err){
        console.log("fail",err.message)
    }

       

})

app.listen(PORT,()=>{


    console.log(`server on ${PORT} `)
})

