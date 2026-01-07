import request from "./index";

const putRequest = async (url, param, setLoading) => {
  if (setLoading) {
    setLoading(true);
  }
  try {
    const result = await request.put(url, param);
    return result;
  } catch (error) {
    return { status: 400, message: error.message, data: {} };
  } finally {
    if (setLoading) setLoading(false); // Request finished
  }
};

export default putRequest;
