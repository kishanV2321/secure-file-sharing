class ApiResponse {
    constructor(statusCode, data, message="success"){
        this.success = statusCode
        this.data = data
        this.message = message
    }
}

export {ApiResponse}