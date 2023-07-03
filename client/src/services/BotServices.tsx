import { IFlow } from "../types/flow.types";
import { apiClient } from "./utils/AxiosInterceptor";

// setup whatsapp
export const SetUpWhatsapp = async () => {
    return await apiClient.post(`setup/whatsapp`);
};

export const CreateFlow = async (body:IFlow) => {
    return await apiClient.post(`flows`,body);
};

export const GetFlows = async () => {
    return await apiClient.get(`flows`);
};

export const DestroyFlow = async (id: string) => {
    return await apiClient.delete(`flows/${id}`);
};