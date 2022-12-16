'use strict' 
import  {printMsg,getCnv} from './newFn.js' 
class actions { 
   constructor() { 
      this.msg = printMsg(); 
      this.get = getCnv();
      this.h="aloo"
   } 
   test() { 
      console.log("This one should print hello world : ", this.msg) 
      console.log("The one should print the getCnv function: ",this.get) 
   } 
} 

//creating an instance  
const foued = new actions(); 
export default foued