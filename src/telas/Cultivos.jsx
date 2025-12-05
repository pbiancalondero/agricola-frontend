import { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Card } from 'react-bootstrap';
import {
  getCultivosAPI,
  cadastraOuAtualizaCultivoAPI,
  deleteCultivoPorIdAPI
} from '../servicos/cultivoServico';
import { getProdutoresAPI } from '../servicos/produtorServico';
import { getUsuario } from '../seguranca/Autenticacao';

function Cultivos() {
  const usuarioLogado = getUsuario(); // contém id e tipo A/U

  const isAdmin = () => usuarioLogado?.tipo === "A";

  const [cultivos, setCultivos] = useState([]);
  const [produtores, setProdutores] = useState([]);

  const [form, setForm] = useState({
    id: '',
    tipo_cultura: '',
    area: '',
    data_plantio: '',
    data_colheita: '',
    id_produtor: ''
  });

  const [usarNovoTipo, setUsarNovoTipo] = useState(false);
  const [novoTipo, setNovoTipo] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  // =====================================================
  // CARREGAR CULTIVOS + PRODUTORES (COM VALIDAÇÃO)
  // =====================================================
  const carregarDados = async () => {
    const cultivosData = await getCultivosAPI();
    const produtoresData = await getProdutoresAPI();

    const listaCultivos =
      Array.isArray(cultivosData)
        ? cultivosData
        : Array.isArray(cultivosData?.dados)
          ? cultivosData.dados
          : [];

    const listaProdutores =
      Array.isArray(produtoresData)
        ? produtoresData
        : Array.isArray(produtoresData?.dados)
          ? produtoresData.dados
          : [];

    // 🔒 RESTRIÇÃO: Se NÃO for admin, só mostra cultivos do próprio produtor
    const cultivosFiltrados = isAdmin()
      ? listaCultivos
      : listaCultivos.filter(c => Number(c.id_produtor) === Number(usuarioLogado.id));

    // 🔒 RESTRIÇÃO: usuários comuns só podem ver eles mesmos na lista
    const produtoresFiltrados = isAdmin()
      ? listaProdutores
      : listaProdutores.filter(p => Number(p.id) === Number(usuarioLogado.id));

    setCultivos(cultivosFiltrados);
    setProdutores(produtoresFiltrados);
  };

  const tiposUnicos = Array.from(new Set(cultivos.map(c => c.tipo_cultura))).filter(Boolean);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const selecionarCultivo = (idSelecionado) => {
    if (!idSelecionado) {
      resetarFormulario();
      return;
    }

    const cultivoSelecionado = cultivos.find(c => String(c.id) === String(idSelecionado));

    if (cultivoSelecionado) {
      setForm({
        id: cultivoSelecionado.id,
        tipo_cultura: cultivoSelecionado.tipo_cultura,
        area: cultivoSelecionado.area,
        data_plantio: cultivoSelecionado.data_plantio?.split("T")[0] || "",
        data_colheita: cultivoSelecionado.data_colheita?.split("T")[0] || "",
        id_produtor: cultivoSelecionado.id_produtor
      });
      setUsarNovoTipo(false);
      setNovoTipo('');
    }
  };

  const resetarFormulario = () => {
    setForm({
      id: '',
      tipo_cultura: '',
      area: '',
      data_plantio: '',
      data_colheita: '',
      id_produtor: isAdmin() ? '' : usuarioLogado.id // 🔒 usuário padrão fica amarrado ao próprio id
    });
    setUsarNovoTipo(false);
    setNovoTipo('');
  };

  // =====================================================
  // SALVAR / ATUALIZAR CULTIVO
  // =====================================================
  const salvar = async () => {
    const tipoFinal = usarNovoTipo ? novoTipo.trim() : form.tipo_cultura;

    if (!tipoFinal || !form.area || !form.data_plantio) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const metodo = form.id ? "PUT" : "POST";

    const dados = {
      tipo_cultura: tipoFinal,
      area: form.area,
      data_plantio: form.data_plantio,
      data_colheita: form.data_colheita || null,
      id_produtor: isAdmin() ? Number(form.id_produtor) : Number(usuarioLogado.id) // 🔒 usuário comum sempre salva com seu próprio id
    };

    if (metodo === "PUT") {
      dados.id = form.id;
    }

    await cadastraOuAtualizaCultivoAPI(dados, metodo);
    resetarFormulario();
    await carregarDados();
  };

  const editar = (c) => selecionarCultivo(c.id);

  const excluir = async (id) => {
    // 🔒 usuário comum NÃO pode excluir
    if (!isAdmin()) {
      alert("Você não tem permissão para excluir cultivos.");
      return;
    }

    if (window.confirm("Excluir cultivo?")) {
      await deleteCultivoPorIdAPI(id);
      carregarDados();
    }
  };

  return (
    <div>
      <Card className="p-4 shadow-sm">
        <h3 className="mb-3">Cadastro de Cultivos</h3>

        <Form>
          <Row className="g-3">

            <Col md={3}>
              <Form.Group>
                <Form.Label>Tipo de Cultura</Form.Label>

                {!usarNovoTipo ? (
                  <div style={{ display: "flex", gap: "6px" }}>
                    <Form.Select
                      name="tipo_cultura"
                      value={form.tipo_cultura}
                      onChange={(e) => {
                        const v = e.target.value;

                        if (v === "__novo__") {
                          setUsarNovoTipo(true);
                          setNovoTipo('');
                          return;
                        }

                        setForm({ ...form, tipo_cultura: v });
                      }}
                    >
                      <option value="">Selecione</option>
                      {tiposUnicos.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                      <option value="__novo__"> Novo tipo...</option>
                    </Form.Select>

                    <Button
                      variant="outline-primary"
                      onClick={() => {
                        setUsarNovoTipo(true);
                        setNovoTipo('');
                      }}
                    >
                      Novo
                    </Button>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: "6px" }}>
                    <Form.Control
                      type="text"
                      placeholder="Digite novo tipo"
                      value={novoTipo}
                      onChange={(e) => setNovoTipo(e.target.value)}
                    />

                    <Button
                      variant="outline-danger"
                      onClick={() => {
                        setUsarNovoTipo(false);
                        setNovoTipo('');
                      }}
                    >
                      X
                    </Button>
                  </div>
                )}
              </Form.Group>
            </Col>

            <Col md={2}>
              <Form.Group>
                <Form.Label>Área (ha)</Form.Label>
                <Form.Control
                  type="number"
                  name="area"
                  step="0.01"
                  value={form.area}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={2}>
              <Form.Group>
                <Form.Label>Plantio</Form.Label>
                <Form.Control
                  type="date"
                  name="data_plantio"
                  value={form.data_plantio}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col md={2}>
              <Form.Group>
                <Form.Label>Colheita</Form.Label>
                <Form.Control
                  type="date"
                  name="data_colheita"
                  value={form.data_colheita}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            {/* PRODUTOR — RESTRITO */}
            <Col md={2}>
              <Form.Group>
                <Form.Label>Produtor</Form.Label>
                <Form.Select
                  name="id_produtor"
                  value={form.id_produtor}
                  disabled={!isAdmin()} // 🔒 comum não pode escolher
                  onChange={(e) =>
                    setForm({ ...form, id_produtor: Number(e.target.value) })
                  }
                >
                  <option value="">Selecione</option>
                  {produtores.map(p => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={1} className="d-flex align-items-end justify-content-center">
              <Button
                variant="success"
                style={{ width: "160px", whiteSpace: "nowrap" }}
                onClick={salvar}
              >
                {form.id ? "Atualizar" : "Salvar"}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Table striped bordered hover className="mt-4">
        <thead className="table-success">
          <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Área</th>
            <th>Plantio</th>
            <th>Colheita</th>
            <th>Produtor</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {cultivos.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.tipo_cultura}</td>
              <td>{c.area}</td>
              <td>{c.data_plantio ? new Date(c.data_plantio).toLocaleDateString() : "-"}</td>
              <td>{c.data_colheita ? new Date(c.data_colheita).toLocaleDateString() : "-"}</td>
              <td>{produtores.find(p => p.id === c.id_produtor)?.nome || c.id_produtor}</td>

              <td>
                <Button size="sm" variant="warning" onClick={() => editar(c)}>Editar</Button>{' '}

                {/* 🔒 EXCLUIR — apenas admin */}
                {isAdmin() && (
                  <Button size="sm" variant="danger" onClick={() => excluir(c.id)}>
                    Excluir
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Cultivos;
