import request from "./index";

const getRequest = async (url, param, setLoading) => {
  if (setLoading) {
    setLoading(true);
  }
  try {
    console.log("begin getRequest", `url:${url}  param:${param}`);
    const result = await request.get(url, param);
    console.log(
      "end getRequest",
      `url:${url}  param:${param} result:${JSON.stringify(result)}`
    );
    return result;
  } catch (error) {
    return { status: 400, message: error.message, data: {} };
  } finally {
    if (setLoading) setLoading(false); // Request finished
  }
};

export default getRequest;
