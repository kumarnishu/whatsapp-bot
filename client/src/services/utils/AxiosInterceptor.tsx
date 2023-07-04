import axios from "axios";

let BaseURL = "/api/v1/"
if (process.env.REACT_APP_SERVER_URL)
    BaseURL = process.env.REACT_APP_SERVER_URL + BaseURL
const apiClient = axios.create({
    baseURL: BaseURL,
    withCredentials: true
})

apiClient.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (error.response.data.message === "please login to access this resource" || error.response.data.message === "login again ! session expired") {
        alert("loggedt out")
        window.location.reload()
    }
    return Promise.reject(error);
});

export {
    BaseURL,
    apiClient
}