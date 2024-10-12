import { verify } from "../utils/token.js";
import UserData from "../models/user.js";

const authenticateMiddleware = async (req, res, next) => {
    try {
        const token = await req.header('Authorization')?.replace('Bearer ', '');
        // console.log('Token:', token);
        if (!token) {
            throw new Error('Authorization token not found');
        }

        // console.log('Token:', token);
        const decoded = verify(token);
        console.log(decoded);
        
                // _id คือข้อมูลใน mongodb
        const user = await UserData.findOne({ _id: decoded.id });
        // console.log("user test", user);

        if (!user) {
            throw new Error('User not found');
        }

        req.user = user;
        next();
        
    } catch (error) {
        next(error);
    }
}

export default authenticateMiddleware;
