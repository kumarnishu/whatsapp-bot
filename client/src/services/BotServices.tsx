import { apiClient } from "./utils/AxiosInterceptor";

// setup whatsapp
export const SetUpWhatsapp = async () => {
    return await apiClient.post(`setup/whatsapp`);
};
