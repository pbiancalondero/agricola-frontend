# 🌾 Sistema de Produção Agrícola — Frontend (PWA)

Este repositório contém o **frontend** do Sistema de Produção Agrícola, desenvolvido em **React** como uma **Progressive Web App (PWA)** para a disciplina de Programação para Web.
A aplicação consome uma **API REST** própria e oferece controle completo de **Produtores, Cultivos e Safras**, com **autenticação JWT** e **controle de permissões**.

---

## Tecnologias Utilizadas

* **React 19**
* **React Router DOM**
* **React Bootstrap / Bootstrap 5**
* **JWT Decode**
* **PWA (Service Worker + Workbox)**
* **Fetch API**
* **Create React App**

---

## Características da Aplicação

* Autenticação via **JWT**
* Controle de acesso por perfil:

  * **Administrador**
  * **Usuário padrão (Produtor)**
* CRUD de:

  * Produtores
  * Cultivos
  * Safras
* Restrições automáticas de acesso:

  * Usuário comum só visualiza e edita seus próprios dados
  * Exclusões restritas ao administrador
* Funciona como **PWA**, com suporte a:

  * Instalação no dispositivo
  * Cache
  * Execução offline (parcial)

---

## Estrutura de Rotas

### Rotas Públicas

* `/` — Página inicial
* `/login` — Login de usuário
* `/criar-conta` — Cadastro de produtor

### Rotas Privadas (Protegidas por Autenticação)

* `/privado/produtores`
* `/privado/cultivos`
* `/privado/safras`

O controle de acesso é feito pelo **HOC `WithAuth`**, que valida o token JWT antes de permitir o acesso às rotas privadas.

---

## Autenticação e Segurança

* O token JWT é armazenado no **localStorage**
* Validação automática de:

  * Token inválido
  * Token expirado
* Logout automático em caso de expiração
* Identificação do perfil do usuário diretamente pelo token (`Admin` ou `Usuário`)

---

## Integração com a API

A aplicação consome uma API REST externa configurada via variável de ambiente:

```env
REACT_APP_ENDERECO_API=http://127.0.0.1:3002
```

Todas as requisições privadas enviam o token JWT no header:

```
Authorization: <token>
```

---

## Executando o Projeto

### Instalar dependências

```bash
npm install
```

### Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
REACT_APP_ENDERECO_API=http://127.0.0.1:3002
```

### Executar em modo desenvolvimento

```bash
npm start
```

A aplicação estará disponível em:

```
http://localhost:3000
```

---

## Build para Produção

```bash
npm run build
```

O projeto será compilado com suporte completo a **PWA**.

---

## Galeria de Telas

### Tela Inicial:
<img width="1365" height="598" alt="telaInicial" src="https://github.com/user-attachments/assets/bda98da9-6cca-4728-abfb-78b005dd84d1" />

### Tela de Login:
<img width="1365" height="598" alt="telaLogin" src="https://github.com/user-attachments/assets/11d24888-3b3d-46d5-852d-69422cc2c357" />

### Tela para Criação de Conta:
<img width="1366" height="768" alt="telaCriarConta" src="https://github.com/user-attachments/assets/2cb32974-c0ac-4c4d-841b-4342385f14cf" />

### Tela de USUÁRIO ADM para gestão de Produtores:
<img width="1365" height="599" alt="admProdutores" src="https://github.com/user-attachments/assets/d11bed2d-371e-4e87-a4ac-651010dc40b4" />

### Tela de USUÁRIO ADM para gestão de Produtores (parte de edição selecionada):
<img width="1352" height="600" alt="admProdutoresEdicao" src="https://github.com/user-attachments/assets/5d51cce8-e676-4b5c-8f8f-41d6d1052185" />

### Tela de USUÁRIO ADM para gestão de Cultivos:
<img width="1365" height="602" alt="admCultivos" src="https://github.com/user-attachments/assets/5cd49000-cb53-4756-af85-7bb22b0764ce" />

### Tela de USUÁRIO ADM para gestão de Cultivos (parte de edição selecionada):
<img width="1365" height="601" alt="admCultivosEdicao" src="https://github.com/user-attachments/assets/df0e8561-3aad-4ab1-b4a4-91453b0d4006" />

### Tela de USUÁRIO ADM para gestão de Safras:
<img width="1365" height="598" alt="admSafras" src="https://github.com/user-attachments/assets/291eaba3-3665-492b-a0cd-c966aadb3a96" />

### Tela de USUÁRIO ADM para gestão de Safras (parte de edição selecionada):
<img width="1364" height="598" alt="admSafrasEdicao" src="https://github.com/user-attachments/assets/1efed308-710e-40c6-9dac-eb69171fcac1" />

### Tela de USUÁRIO PADRÃO para gestão de Produtores:
<img width="1365" height="599" alt="userProdutores" src="https://github.com/user-attachments/assets/4369679d-6c42-4412-87de-7689284d3dc1" />

### Tela de USUÁRIO PADRÃO para gestão de Cultivos:
<img width="1365" height="600" alt="userCultivos" src="https://github.com/user-attachments/assets/1b8c5a27-4c56-4bf7-a038-16eedd244cba" />

### Tela de USUÁRIO PADRÃO para gestão de Safras:
<img width="1365" height="600" alt="userSafras" src="https://github.com/user-attachments/assets/43ff9fd0-7220-4304-bf76-fd330043011c" />

---

##  Observações
Projeto desenvolvido para a disciplina de Programação para Web, com o objetivo de aplicar conceitos de:

  * React
  * Autenticação JWT
  * PWA
  * Integração com API REST
