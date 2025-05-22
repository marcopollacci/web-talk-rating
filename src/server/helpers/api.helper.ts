export const executeApiCall = async <T>(
  funcToCall: any
): Promise<{ status: number; message: T | string }> => {
  let status = 200;
  let message;
  try {
    message = await funcToCall.call();
  } catch (error) {
    status = 500;
    message = 'KO';
  }
  return {
    status,
    message,
  };
};
