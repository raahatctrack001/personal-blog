class apiResponse {
    constructor(statusCode, message, data, success){
        // super(message); // no need of super here
        this.statusCode = statusCode || 500;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400;
    }
}

export default apiResponse;