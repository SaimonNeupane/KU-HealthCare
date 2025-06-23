
class HttpError extends  Error{
    statusCode:number
    status:string
    
    constructor(statusCode:number , message:string) {
        super(message);
        this.statusCode=statusCode;
        this.message=message
        this.status=this.statusCode>=400 && this.statusCode <500?'Fail':'Error'

    }
}

export  default  HttpError