import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { gravaAutenticacao, getToken } from '../seguranca/Autenticacao';
import CampoEntrada from '../comuns/CampoEntrada';
import Alerta from '../comuns/Alerta';
import Carregando from '../comuns/Carregando';

function Login() {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [alerta, setAlerta] = useState({ status: "", message: "" });
    const [autenticado, setAutenticado] = useState(false);
    const [carregando, setCarregando] = useState(false);

    const acaoLogin = async e => {
        e.preventDefault();

        try {
            const body = { email, senha };
            setCarregando(true);

            await fetch(`${process.env.REACT_APP_ENDERECO_API}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })
                .then(response => response.json())
                .then(json => {
                    if (json.auth === false) {
                        setAlerta({ status: "error", message: json.message });
                    }
                    if (json.auth === true) {
                        gravaAutenticacao(json);
                        setAutenticado(true);
                    }
                });

        } catch (err) {
            console.error(err.message);
            setAlerta({ status: "error", message: err.message });

        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        const token = getToken();
        if (token) setAutenticado(true);
    }, []);

    if (autenticado) {
        return <Navigate to="/privado" />;
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-6">
                    <Carregando carregando={carregando}>
                        <Alerta alerta={alerta} />
                        <form onSubmit={acaoLogin}>
                            <h1 className="h3 mb-3 fw-normal text-center">
                                Login de Usuário
                            </h1>

                            <CampoEntrada
                                value={email}
                                id="txtEmail"
                                name="email"
                                label="Email"
                                tipo="email"
                                onchange={e => setEmail(e.target.value)}
                                msgvalido="Email OK"
                                msginvalido="Informe o email"
                                requerido={true}
                                readonly={false}
                                maxCaracteres={40}
                            />

                            <CampoEntrada
                                value={senha}
                                id="txtSenha"
                                name="senha"
                                label="Senha"
                                tipo="password"
                                onchange={e => setSenha(e.target.value)}
                                msgvalido="Senha OK"
                                msginvalido="Informe a senha"
                                requerido={true}
                                readonly={false}
                                maxCaracteres={40}
                            />

                            <button className="w-100 btn btn-lg btn-success mb-3" type="submit">
                                Efetuar login
                            </button>

                            <div className="text-center">
                                <small>Ainda não possui conta?</small>
                                <br />
                                <Link to="/criar-conta" className="btn btn-link">
                                    Criar conta
                                </Link>
                            </div>
                        </form>
                    </Carregando>
                </div>
            </div>
        </div>
    );
}

export default Login;
