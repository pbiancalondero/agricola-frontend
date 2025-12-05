import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Form, Row, Col, Card } from 'react-bootstrap';
import {
  getProdutoresAPI,
  cadastraOuAtualizaProdutorAPI,
  deleteProdutorPorIdAPI
} from '../servicos/produtorServico';

import { isAdmin, getUsuario } from '../seguranca/Autenticacao';

function Produtores() {
  const [produtores, setProdutores] = useState([]);
  const [form, setForm] = useState(null); // formulário só aparece ao editar
  const usuarioLogado = getUsuario();

  // carregarProdutores com tratamento seguro do retorno da API
  const carregarProdutores = useCallback(async () => {
    try {
      const data = await getProdutoresAPI();

      // garante que tenhamos um array (tenta data, data.dados ou fallback [])
      const lista = Array.isArray(data)
        ? data
        : (Array.isArray(data?.dados) ? data.dados : []);

      // se não for admin, mostra apenas o registro do próprio usuário
      if (!isAdmin()) {
        const apenasMeuRegistro = lista.filter(p => Number(p.id) === Number(usuarioLogado.id));
        setProdutores(apenasMeuRegistro);
      } else {
        setProdutores(lista);
      }
    } catch (err) {
      console.error("Erro ao carregar produtores:", err);
      setProdutores([]);
    }
  }, [usuarioLogado]);

  useEffect(() => {
    carregarProdutores();
  }, [carregarProdutores]);

  const salvar = async () => {
    if (!form) return;
    // envia todos os campos que o backend espera
    const dados = {
      id: form.id,
      nome: form.nome,
      propriedade: form.propriedade,
      municipio: form.municipio,
      email: form.email ?? "",
      tipo: form.tipo ?? "U",
      senha: form.senha ?? ""
    };

    try {
      await cadastraOuAtualizaProdutorAPI(dados, 'PUT');
      setForm(null);
      await carregarProdutores();
    } catch (err) {
      console.error("Erro ao salvar produtor:", err);
      alert("Erro ao salvar produtor.");
    }
  };

  const editar = (p) => {
    // garante campos obrigatórios no form (evita undefined)
    setForm({
      id: p.id,
      nome: p.nome ?? "",
      propriedade: p.propriedade ?? "",
      municipio: p.municipio ?? "",
      email: p.email ?? "",
      tipo: p.tipo ?? "U",
      senha: p.senha ?? "" // se não quiser mostrar senha em claro, mantém em estado para enviar ao backend
    });
  };

  const excluir = async (id) => {
    if (!isAdmin()) return;
    if (!window.confirm("Deseja realmente excluir este produtor?")) return;
    try {
      await deleteProdutorPorIdAPI(id);
      await carregarProdutores();
    } catch (err) {
      console.error("Erro ao excluir produtor:", err);
      alert("Erro ao excluir produtor.");
    }
  };

  return (
    <div>
      {/* Formulário apenas para edição */}
      {form && (
        <Card className="p-4 shadow-sm mb-4">
          <h3>Editar Produtor</h3>

          <Form>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Propriedade</Form.Label>
                  <Form.Control
                    value={form.propriedade}
                    onChange={(e) => setForm({ ...form, propriedade: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Município</Form.Label>
                  <Form.Control
                    value={form.municipio}
                    onChange={(e) => setForm({ ...form, municipio: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* campos adicionais necessários para o PUT (ocultos ou editáveis conforme queira) */}
            <Row className="mt-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group>
                  <Form.Label>Tipo</Form.Label>
                  <Form.Select
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    disabled={!isAdmin()} // apenas admin pode alterar tipo
                  >
                    <option value="U">U (Usuário)</option>
                    <option value="A">A (Admin)</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    value={form.senha}
                    onChange={(e) => setForm({ ...form, senha: e.target.value })}
                    placeholder="Preencha para alterar a senha (ou mantenha a atual)"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={3}>
                <Button className="w-100" variant="success" onClick={salvar}>
                  Salvar Alterações
                </Button>
              </Col>

              <Col md={3}>
                <Button className="w-100" variant="secondary" onClick={() => setForm(null)}>
                  Cancelar
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      )}

      {/* Tabela apenas para visualizar */}
      <Table striped bordered hover>
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
                {/* Todos podem editar (apenas o próprio se não admin) */}
                <Button size="sm" variant="warning" onClick={() => editar(p)}>
                  Editar
                </Button>

                {/* Apenas admin pode excluir */}
                {isAdmin() && (
                  <>
                    {' '}
                    <Button size="sm" variant="danger" onClick={() => excluir(p.id)}>
                      Excluir
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Produtores;
