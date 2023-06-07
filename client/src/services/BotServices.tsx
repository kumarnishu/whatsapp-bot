import { apiClient } from "./utils/AxiosInterceptor";

// setup whatsapp
export const SetUpWhatsapp = async (client_id:string) => {
    return await apiClient.post(`setup/whatsapp/${client_id}`);
};
export const LogoutWhatsapp = async (client_id: string) => {
    return await apiClient.post(`logout/whatsapp/${client_id}`);
};