import { $authHost, $host } from "./index";
import jwt_decode from "jwt-decode";

export const registration = async (name, surname, patronymic, login, email, phone, password) => {
    const { data } = await $host.post('api/user/registration', { name, surname, patronymic, login, email, password, phone, role: 'USER' })
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const login_user = async (login, password) => {
    const { data } = await $host.post('api/user/login', { login, password })
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const check = async () => {
    const { data } = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const fetchUsers = async () => {
    const { data } = await $host.get('api/user',)
    return data
}

export const deleteUser = async (id) => {
    const { data } = await $authHost.delete(`api/user/${id}`);
    return data;
};

export const updateUser = async (data) => {
    const { data: updatedUser } = await $authHost.put(`api/user/current`, data); 
    return updatedUser;
};

export const getUser = async (id) => {
    const { data } = await $authHost.get(`api/user/${id}`);
    return data;
};

export const getCurrentUser = async () => {
    const { data } = await $authHost.get('api/user/current');
    return data;
};
