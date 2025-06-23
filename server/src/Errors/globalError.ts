import { Request, Response } from 'express'
import HttpError from './httpError'

const GlobalError: any = (error: HttpError, req: Request, res: Response) => {
    if (error.statusCode >= 400 && error.statusCode < 500) {
        
        return res.status(error.statusCode || 500).json({
            status:error.status|| 'Error',
            statusCode:error.statusCode || 500,
            message:error.message
        })
           
        
    }
    if(error.statusCode >=500){
        return res.status(error.statusCode || 500).json({
            status:error.status || 'Error',
            statusCode:error.statusCode || 500,
            message:error.message
        })
    }

}

export default GlobalError

