import express from 'express'
import path,{dirname} from 'path'
import { fileURLToPath } from 'url'
const app=express()

const PORT=  8083


const __filename=fileURLToPath(import.meta.url)
const __dirname=dirname(__filename)


app.use(express.json())
app.use(express.static(path.join(__dirname,"../public/")))


app.get('/',(req,res)=>{

res.sendFile(path.join(__dirname,'public','index.html'))

})

app.listen(PORT,()=>{


    console.log(`server on ${PORT}`)
})

