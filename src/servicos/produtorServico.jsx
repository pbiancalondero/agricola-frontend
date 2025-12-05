import { getToken } from '../seguranca/Autenticacao';

export const getProdutoresAPI = async () => {
    const response = await fetch(`${process.env.REACT_APP_ENDERECO_API}/produtor`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "authorization": getToken()
        },
    });
    return await response.json();
};

export const getProdutorPorIdAPI = async (id) => {
    const response = await fetch(`${process.env.REACT_APP_ENDERECO_API}/produtor/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "authorization": getToken()
        },
    });
    return await response.json();
};

export const deleteProdutorPorIdAPI = async (id) => {
    const response = await fetch(`${process.env.REACT_APP_ENDERECO_API}/produtor/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "authorization": getToken()
        },
    });
    return await response.json();
};

export const cadastraOuAtualizaProdutorAPI = async (objeto, metodo) => {
    const response = await fetch(`${process.env.REACT_APP_ENDERECO_API}/produtor`, {
        method: metodo, // "POST" para cadastrar, "PUT" para atualizar
        headers: {
            "Content-Type": "application/json",
            "authorization": getToken()
        },
        body: JSON.stringify(objeto),
    });
    return await response.json();
};
