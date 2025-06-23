import { Request,Response,NextFunction, Router } from "express";
// import { check } from "../controllers/labAssistantController";
// import AuthenticateToken from "../middleware/authenticateToken";
// import authorization from "../middleware/authorization";
const router:Router=Router()

console.log('lab assistant route')

// router.get('/check/',AuthenticateToken,authorization('lab'),check)
router.get('/u',(req:Request,res:Response,next:NextFunction):any=>{
    return res.status(200).json({
        hel:'kajhsdf'
    })
})

router.get('/helo',()=>{
    console.log('tait')
})

export default router