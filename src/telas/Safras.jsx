import { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Card } from 'react-bootstrap';

import {
  getSafrasAPI,
  cadastraOuAtualizaSafraAPI,
  deleteSafraPorIdAPI
} from '../servicos/safraServico';

import { getCultivosAPI } from '../servicos/cultivoServico';
import { getProdutoresAPI } from '../servicos/produtorServico';
import { getUsuario } from '../seguranca/Autenticacao';

function Safras() {
  const usuarioLogado = getUsuario(); // { id, email, tipo, nome, ... }
  const isAdmin = usuarioLogado?.tipo === 'A';
  const meuProdutorId = usuarioLogado?.id ?? usuarioLogado?.produtorId ?? null;

  const [safras, setSafras] = useState([]);
  const [cultivos, setCultivos] = useState([]);
  const [produtores, setProdutores] = useState([]);

  const [form, setForm] = useState({
    id: '',
    ano: '',
    quantidade_colhida: '',
    id_cultivo: '',
    id_produtor: ''
  });

  useEffect(() => {
    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const carregarDados = async () => {
    const produtoresData = await getProdutoresAPI();
    const listaProdutores = Array.isArray(produtoresData) ? produtoresData : (produtoresData?.dados ?? []);
    setProdutores(listaProdutores);

    const cultivosData = await getCultivosAPI();
    const listaCultivos = Array.isArray(cultivosData) ? cultivosData : (cultivosData?.dados ?? []);
    // se não for admin, filtra cultivos do próprio produtor
    const cultivosVisiveis = isAdmin ? listaCultivos : listaCultivos.filter(c => Number(c.id_produtor) === Number(meuProdutorId));
    setCultivos(cultivosVisiveis);

    const safrasData = await getSafrasAPI();
    const listaSafras = Array.isArray(safrasData) ? safrasData : (safrasData?.dados ?? []);
    // se não for admin, só safras cujos cultivos pertencem ao produtor logado
    const safrasVisiveis = isAdmin
      ? listaSafras
      : listaSafras.filter(s => {
          const cultivo = listaCultivos.find(c => Number(c.id) === Number(s.id_cultivo));
          return cultivo && Number(cultivo.id_produtor) === Number(meuProdutorId);
        });
    setSafras(safrasVisiveis);
  };

  const salvar = async () => {
    if (!form.ano || !form.quantidade_colhida || !form.id_cultivo) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    // garantir que, para usuário padrão, sempre salve com o produtor dele
    const cultivoEscolhido = cultivos.find(c => Number(c.id) === Number(form.id_cultivo));
    const idProdutorParaSalvar = isAdmin
      ? (form.id_produtor || (cultivoEscolhido ? cultivoEscolhido.id_produtor : null))
      : meuProdutorId;

    if (!idProdutorParaSalvar) {
      alert("Não foi possível determinar o produtor para essa safra.");
      return;
    }

    const metodo = form.id ? 'PUT' : 'POST';
    const dados = {
      ano: form.ano,
      quantidade_colhida: form.quantidade_colhida,
      id_cultivo: Number(form.id_cultivo),
      // backend pode derivar id_produtor pelo cultivo; mesmo assim passamos:
      id_produtor: Number(idProdutorParaSalvar)
    };

    if (metodo === 'PUT') dados.id = form.id;

    await cadastraOuAtualizaSafraAPI(dados, metodo);

    setForm({ id: '', ano: '', quantidade_colhida: '', id_cultivo: '', id_produtor: '' });
    await carregarDados();
  };

  const editar = (s) => {
    // checagem: se não for admin, só edita se safra pertence ao produtor logado
    if (!isAdmin) {
      const cultivo = cultivos.find(c => Number(c.id) === Number(s.id_cultivo))
        || null;
      const dono = cultivo ? Number(cultivo.id_produtor) : null;
      if (dono !== Number(meuProdutorId)) {
        alert("Você só pode editar suas próprias safras.");
        return;
      }
    }

    const cultivo = cultivos.find(c => Number(c.id) === Number(s.id_cultivo));

    setForm({
      id: s.id,
      ano: s.ano,
      quantidade_colhida: s.quantidade_colhida,
      id_cultivo: s.id_cultivo,
      id_produtor: cultivo ? cultivo.id_produtor : ''
    });
  };

  const excluir = async (id) => {
    // só admin pode excluir
    if (!isAdmin) {
      alert("Apenas administradores podem excluir safras.");
      return;
    }

    if (!window.confirm("Tem certeza que deseja excluir esta safra?")) return;

    await deleteSafraPorIdAPI(id);
    await carregarDados();
  };

  const getNomeCultivo = (id) => cultivos.find(c => Number(c.id) === Number(id))?.tipo_cultura || "—";

  const getNomeProdutor = (idCultivo) => {
    const cultivo = cultivos.find(c => Number(c.id) === Number(idCultivo));
    if (!cultivo) return "—";
    const produtor = produtores.find(p => Number(p.id) === Number(cultivo.id_produtor));
    return produtor ? produtor.nome : "—";
  };

  // cultivos disponíveis para o select: se admin -> todos visíveis; se U -> apenas seus cultivos (já filtrados em carregarDados)
  const cultivosDisponiveis = cultivos;

  return (
    <div>
      <Card className="p-4 shadow-sm">
        <h3>Cadastro de Safras</h3>
        <Form>
          <Row>
            {/* se admin, mostra select de produtores; se U, não precisa (id_produtor será o do produtor logado) */}
            {isAdmin && (
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Produtor</Form.Label>
                  <Form.Select
                    value={form.id_produtor}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        id_produtor: Number(e.target.value),
                        id_cultivo: ""
                      })
                    }
                  >
                    <option value="">Selecione</option>
                    {produtores.map((p) => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            )}

            <Col md={3}>
              <Form.Group>
                <Form.Label>Cultura</Form.Label>
                <Form.Select
                  value={form.id_cultivo}
                  onChange={(e) =>
                    setForm({ ...form, id_cultivo: Number(e.target.value) })
                  }
                >
                  <option value="">Selecione</option>
                  {cultivosDisponiveis.map((c) => (
                    <option key={c.id} value={c.id}>{c.tipo_cultura}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={2}>
              <Form.Group>
                <Form.Label>Ano</Form.Label>
                <Form.Control
                  value={form.ano}
                  onChange={(e) => setForm({ ...form, ano: e.target.value })}
                />
              </Form.Group>
            </Col>

            <Col md={2}>
              <Form.Group>
                <Form.Label>Quantidade (ton)</Form.Label>
                <Form.Control
                  value={form.quantidade_colhida}
                  onChange={(e) =>
                    setForm({ ...form, quantidade_colhida: e.target.value })
                  }
                />
              </Form.Group>
            </Col>

            <Col md={2} className="d-flex align-items-end">
              <Button variant="success" onClick={salvar} style={{ minWidth: '130px' }}>
                {form.id ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Table striped bordered hover className="mt-4">
        <thead className="table-success">
          <tr>
            <th>ID</th>
            <th>Ano</th>
            <th>Quantidade</th>
            <th>Cultura</th>
            <th>Produtor</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {safras.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.ano}</td>
              <td>{s.quantidade_colhida}</td>
              <td>{getNomeCultivo(s.id_cultivo)}</td>
              <td>{getNomeProdutor(s.id_cultivo)}</td>

              <td>
                <Button size="sm" variant="warning" onClick={() => editar(s)}>Editar</Button>{' '}
                {isAdmin && (
                  <Button size="sm" variant="danger" onClick={() => excluir(s.id)}>Excluir</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>

      </Table>
    </div>
  );
}

export default Safras;
