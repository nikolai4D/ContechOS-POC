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


export const getType = (obj) => {
  return `${obj.charAt(0).toLowerCase()}${obj.slice(1)}s` // From Config to configs, AdminConfig to adminConfigs etc.
}