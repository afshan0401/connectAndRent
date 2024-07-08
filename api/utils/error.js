//FN CREATION FOR ERROR HANDLING (ERROR HANDLER FN)
//MANUAL STATUS CODE MESSAGE
export const errorHandler = (statusCode, message) => {
    const error = new Error(); //error constructor
    error.statusCode = statusCode;
    error.message = message;
    return error;
}