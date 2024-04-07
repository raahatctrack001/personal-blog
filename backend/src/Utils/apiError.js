class apiError extends Error{
    constructor(statusCode, message="Something wend WRONG!", errors = [], stack=""){
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.error = errors;
        this.data = null;
        this.success = false;
        if(stack){
            this.stack = stack;
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
export default apiError;