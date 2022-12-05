import mongoose from 'mongoose'




  const dbServer= ()=> mongoose.connect("mongodb+srv://fou3ed:HJz1hkPtuQdWaMnu@cluster0.tbocpnt.mongodb.net/messaging?retryWrites=true&w=majority",()=>{
        console.log("connected")
    },
    e=>console.error(e)
    )
export default dbServer