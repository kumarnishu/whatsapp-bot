import { IFlow } from "../types/flow.types";
import { apiClient } from "./utils/AxiosInterceptor";



export const CreateFlow = async (body: IFlow) => {
    return await apiClient.post(`flows`, body);
};

export const UpdateFlow = async ({ id, body }: { id: string, body: IFlow }) => {
    return await apiClient.put(`flows/${id}`, body);
};
export const GetFlows = async () => {
    return await apiClient.get(`flows`);
};

export const DestroyFlow = async (id: string) => {
    return await apiClient.delete(`flows/${id}`);
};
export const GetTrackers = async () => {
    return await apiClient.get(`trackers`);
}

export const UpdateCustomerName = async ({ id, body }: { id: string, body: { customer_name: string } }) => {
    return await apiClient.put(`trackers/${id}`, body)
}
export const ToogleBotStatus = async ({ body }: { body: { phone_number: string, bot_number: string } }) => {
    return await apiClient.post(`toogle`, body);
}

