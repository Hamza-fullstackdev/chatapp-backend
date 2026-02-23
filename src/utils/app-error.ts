type CustomError = Error & {
  statusCode: number;
  message: string;
};

const errorHandler = (statusCode: number, message: string): CustomError => {
  const error = new Error() as CustomError;
  error.statusCode = statusCode;
  error.message = message;
  return error;
};

export default errorHandler;
