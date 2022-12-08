import jwt from 'jwt'
import process from 'node:process';

export const auth = (req , res , next ) => {
try {
const token = req.headers.authorization.split(' ')[1]
req.user= jwt.verify(token , process.env.JWT_KEY);
next()

} catch (error) {
return res.status(401).json({
message :'auth failed'
})
}
}