import { $authHost, $host } from "./index";

export const createViolationReport = async (violationReport) => {
    try {
        const { data } = await $authHost.post('api/violation-reports', violationReport);
        return data;
    } catch (error) {
        throw new Error('Ошибка создания нарушения: ' + error.message);
    }
};

export const getAllViolationReports = async () => {
    const { data } = await $host.get('api/violation-reports');
    return data;
};

export const getViolationReportById = async (id) => {
    try {
        const { data } = await $host.get(`api/violation-reports/${id}`);
        return data;
    } catch (error) {
        throw new Error('Ошибка получения нарушения по ID: ' + error.message);
    }
};

export const deleteViolationReport = async (id) => {
    try {
        const { data } = await $authHost.delete(`api/violation-reports/${id}`);
        return data;
    } catch (error) {
        throw new Error('Ошибка удаления нарушения: ' + error.message);
    }
};

export const updateViolationReportStatus = async (id, status) => {
    try {
        const { data } = await $authHost.put(`api/violation-reports/${id}`, { status });
        return data;
    } catch (error) {
        throw new Error('Ошибка обновления статуса нарушения: ' + error.message);
    }
};

export const getUserViolationReports = async () => {
    const { data } = await $authHost.get('api/violation-reports/current');
    return data;
};

