class apiError extends Error{
    constructor(statusCode, message="Something wend WRONG!", errors = [], stack=""){
        super(message);
        this.statusCode = statusCode;
        this.message = message,
        this.data = null;
        this.success = false;
        this.error = errors
        if(stack){
            this.stack = stack;
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
export default apiError;