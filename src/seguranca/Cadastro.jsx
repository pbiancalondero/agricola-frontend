import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alerta from '../comuns/Alerta';
import CampoEntrada from '../comuns/CampoEntrada';

function Cadastro() {
  const [nome, setNome] = useState("");
  const [propriedade, setPropriedade] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState("U");
  const [senha, setSenha] = useState("");
  const [alerta, setAlerta] = useState({ status: "", message: "" });
  const navigate = useNavigate();

  const criarConta = async (e) => {
    e.preventDefault();

    try {
      const body = { nome, propriedade, municipio, email, tipo, senha };

      const resposta = await fetch(`${process.env.REACT_APP_ENDERECO_API}/produtor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const json = await resposta.json();

      if (resposta.status !== 201) {
        setAlerta({ status: "error", message: json.message });
        return;
      }

      setAlerta({ status: "success", message: "Conta criada com sucesso!" });

      setTimeout(() => navigate("/login"), 1200);

    } catch (err) {
      setAlerta({ status: "error", message: err.message });
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <Alerta alerta={alerta} />

          <form onSubmit={criarConta}>
            <h1 className="h3 mb-3 fw-normal">Criar Conta</h1>

            <CampoEntrada
              value={nome}
              id="txtNome"
              label="Nome"
              tipo="text"
              onchange={e => setNome(e.target.value)}
              requerido={true}
              maxCaracteres={60}
            />

            <CampoEntrada
              value={propriedade}
              id="txtPropriedade"
              label="Propriedade"
              tipo="text"
              onchange={e => setPropriedade(e.target.value)}
              requerido={true}
              maxCaracteres={60}
            />

            <CampoEntrada
              value={municipio}
              id="txtMunicipio"
              label="Município"
              tipo="text"
              onchange={e => setMunicipio(e.target.value)}
              requerido={true}
              maxCaracteres={40}
            />

            <CampoEntrada
              value={email}
              id="txtEmail"
              label="E-mail"
              tipo="email"
              onchange={e => setEmail(e.target.value)}
              requerido={true}
              maxCaracteres={40}
            />

            <div className="mb-3">
              <label htmlFor="txtTipo" className="form-label">Tipo de Conta</label>
              <select
                id="txtTipo"
                className="form-control"
                value={tipo}
                onChange={e => setTipo(e.target.value)}
                required
              >
                <option value="U">Usuário Padrão</option>
                <option value="A">Administrador</option>
              </select>
            </div>

            <CampoEntrada
              value={senha}
              id="txtSenha"
              label="Senha"
              tipo="password"
              onchange={e => setSenha(e.target.value)}
              requerido={true}
              maxCaracteres={40}
            />

            <button className="w-100 btn btn-lg btn-success" type="submit">
              Criar conta
            </button>

            <div className="text-center mt-3">
              <a href="/login">Já tenho conta</a>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

export default Cadastro;