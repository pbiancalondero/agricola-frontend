import { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Card } from 'react-bootstrap';

import {
  getSafrasAPI,
  cadastraOuAtualizaSafraAPI,
  deleteSafraPorIdAPI
} from '../servicos/safraServico';

import { getCultivosAPI } from '../servicos/cultivoServico';
import { getProdutoresAPI } from '../servicos/produtorServico';

function Safras() {
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
    getSafrasAPI().then(setSafras);
    getCultivosAPI().then(setCultivos);
    getProdutoresAPI().then(setProdutores);
  }, []);

  const salvar = async () => {
    const metodo = form.id ? 'PUT' : 'POST';
    await cadastraOuAtualizaSafraAPI(form, metodo);

    setForm({
      id: '',
      ano: '',
      quantidade_colhida: '',
      id_cultivo: '',
      id_produtor: ''
    });

    getSafrasAPI().then(setSafras);
  };

  const editar = (s) => {
    const cultivo = cultivos.find(c => c.id === s.id_cultivo);

    setForm({
      id: s.id,
      ano: s.ano,
      quantidade_colhida: s.quantidade_colhida,
      id_cultivo: s.id_cultivo,
      id_produtor: cultivo ? cultivo.id_produtor : ""
    });
  };

  const excluir = async (id) => {
    await deleteSafraPorIdAPI(id);
    getSafrasAPI().then(setSafras);
  };

  const getNomeCultivo = (id) =>
    cultivos.find(c => c.id === id)?.tipo_cultura || "—";

  const getNomeProdutor = (idCultivo) => {
    const cultivo = cultivos.find(c => c.id === idCultivo);
    if (!cultivo) return "—";
    const produtor = produtores.find(p => p.id === cultivo.id_produtor);
    return produtor ? produtor.nome : "—";
  };

  const cultivosFiltrados =
    form.id_produtor
      ? cultivos.filter(c => c.id_produtor === Number(form.id_produtor))
      : cultivos;

  return (
    <div>
      <Card className="p-4 shadow-sm">
        <h3>Cadastro de Safras</h3>
        <Form>
          <Row>

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
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

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
                  {cultivosFiltrados.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.tipo_cultura}
                    </option>
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
              <Button
                variant="success"
                onClick={salvar}
                style={{ minWidth: '130px' }}
              >
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
                <Button size="sm" variant="warning" onClick={() => editar(s)}>
                  Editar
                </Button>{' '}
                <Button size="sm" variant="danger" onClick={() => excluir(s.id)}>
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>

      </Table>
    </div>
  );
}

export default Safras;
