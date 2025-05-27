export const executeApiCall = async <T>(
  funcToCall: Function
): Promise<{ status: number; message: T | string }> => {
  let status = 200;
  let message: T | string;
  try {
    message = await funcToCall.call(undefined);
  } catch (error) {
    status = 500;
    message = 'KO';
  }
  return {
    status,
    message,
  };
};
