class ErrorHelper {
  static parseError(errorMessage) {
    console.log({ errorMessage });
    const splitMetamaskError = errorMessage.message.split("stack").shift();
    let error = splitMetamaskError.replace(
      'Internal JSON-RPC error.\n{\n  "message": "VM Exception while processing transaction: revert ',
      ""
    );
    error = error.replace('",\n  "', "");
    return error;
  }
}

export default ErrorHelper;
