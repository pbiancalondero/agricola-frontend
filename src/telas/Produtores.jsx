import { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Card } from 'react-bootstrap';
import {
  getProdutoresAPI,
  cadastraOuAtualizaProdutorAPI,
  deleteProdutorPorIdAPI
} from '../servicos/produtorServico';

function Produtores() {
  const [produtores, setProdutores] = useState([]);
  const [form, setForm] = useState({ id: '', nome: '', propriedade: '', municipio: '' });

  const carregarProdutores = async () => {
    const data = await getProdutoresAPI();
    setProdutores(data);
  };

  useEffect(() => {
    carregarProdutores();
  }, []);

  const salvar = async () => {
    const metodo = form.id ? 'PUT' : 'POST';
    await cadastraOuAtualizaProdutorAPI(form, metodo);
    setForm({ id: '', nome: '', propriedade: '', municipio: '' });
    carregarProdutores();
  };

  const editar = (p) => setForm(p);

  const excluir = async (id) => {
    await deleteProdutorPorIdAPI(id);
    carregarProdutores();
  };

  return (
    <div>
      <Card className="p-4 shadow-sm">
        <h3>Cadastro de Produtores</h3>
        <Form>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Propriedade</Form.Label>
                <Form.Control
                  value={form.propriedade}
                  onChange={(e) => setForm({ ...form, propriedade: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Município</Form.Label>
                <Form.Control
                  value={form.municipio}
                  onChange={(e) => setForm({ ...form, municipio: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end">
              <Button variant="success" onClick={salvar}>
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
            <th>Nome</th>
            <th>Propriedade</th>
            <th>Município</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtores.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nome}</td>
              <td>{p.propriedade}</td>
              <td>{p.municipio}</td>
              <td>
                <Button size="sm" variant="warning" onClick={() => editar(p)}>
                  Editar
                </Button>{' '}
                <Button size="sm" variant="danger" onClick={() => excluir(p.id)}>
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

export default Produtores;
