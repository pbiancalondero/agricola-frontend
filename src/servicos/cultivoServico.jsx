export const getCultivosAPI = async () => {
  const response = await fetch(`${process.env.REACT_APP_ENDERECO_API}/cultivo`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return await response.json();
};

export const getCultivoPorIdAPI = async (id) => {
  const response = await fetch(`${process.env.REACT_APP_ENDERECO_API}/cultivo/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return await response.json();
};

export const deleteCultivoPorIdAPI = async (id) => {
  const response = await fetch(`${process.env.REACT_APP_ENDERECO_API}/cultivo/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  return await response.json();
};

export const cadastraOuAtualizaCultivoAPI = async (objeto, metodo) => {
  const response = await fetch(`${process.env.REACT_APP_ENDERECO_API}/cultivo`, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(objeto),
  });
  return await response.json();
};
