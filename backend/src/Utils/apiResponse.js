class apiResonse {
    constructor(statusCode, message, data, success){
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400;
    }
}

export default apiResonse;