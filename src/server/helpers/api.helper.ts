export const executeApiCall = async <T>(
  funcToCall: () => unknown,
): Promise<{ status: number; message: T | string }> => {
  let status = 200;
  let message: T | string;
  try {
    // callers declare T; the DB layer returns untyped rows
    message = (await funcToCall()) as T;
  } catch {
    status = 500;
    message = 'KO';
  }
  return {
    status,
    message,
  };
};
