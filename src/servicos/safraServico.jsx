export const getSafrasAPI = async () => {
  const response = await fetch(`${process.env.REACT_APP_ENDERECO_API}/safra`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return await response.json();
};

export const getSafraPorIdAPI = async (id) => {
  const response = await fetch(`${process.env.REACT_APP_ENDERECO_API}/safra/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return await response.json();
};

export const deleteSafraPorIdAPI = async (id) => {
  const response = await fetch(`${process.env.REACT_APP_ENDERECO_API}/safra/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  return await response.json();
};

export const cadastraOuAtualizaSafraAPI = async (objeto, metodo) => {
  const response = await fetch(`${process.env.REACT_APP_ENDERECO_API}/safra`, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(objeto),
  });
  return await response.json();
};
