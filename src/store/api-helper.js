import axios from "axios";

export const apiCall = async (query) => {

const optionsLogin = {
    method: "POST",
    headers: { "content-type": "application/json" },
    data: {
      query
    },
    url: process.env.VUE_APP_APIURL,
  };

  let apiResponse = await axios(optionsLogin);
  return apiResponse.data.data
}



