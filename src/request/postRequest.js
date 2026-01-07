import request from "./index";

const postRequest = async (url, param, setLoading) => {
  if (setLoading) {
    setLoading(true);
  }

  try {
    const result = await request.post(url, param, {});

    return result;
  } catch (error) {
    return { status: 400, message: error.message, data: {} };
  } finally {
    if (setLoading) setLoading(false);
  }
};

export default postRequest;
