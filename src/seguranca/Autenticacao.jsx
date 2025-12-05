// Autenticacao.js
import { jwtDecode } from "jwt-decode";

const NOMEAPP = 'agricola';

function _loadAutenticacaoRaw() {
  const raw = localStorage.getItem(`${NOMEAPP}/autenticacao`);
  return raw ? JSON.parse(raw) : null;
}

function _decodeTokenSafe(token) {
  try {
    return jwtDecode(token);
  } catch (err) {
    console.warn('Token inválido:', err);
    return null;
  }
}

// Retorna o token (string) ou null.
// Se token expirou -> faz logout() e retorna null (ou lança string).
export const getToken = () => {
  const autenticacao = _loadAutenticacaoRaw();
  if (!autenticacao || autenticacao.auth === false) return null;
  const token = autenticacao.token;
  if (!token) return null;

  const decoded = _decodeTokenSafe(token);
  if (!decoded) {
    logout();
    return null;
  }
  const now = Math.floor(Date.now() / 1000);
  // alguns tokens têm exp, outros não — se tiver exp, checamos
  if (decoded.exp && decoded.exp <= now) {
    console.log('Token expirado');
    logout();
    return null;
  }
  return token;
};

// Retorna um objeto padronizado do usuário { id, email, tipo, nome, ... } ou null
export const getUsuario = () => {
  const autenticacao = _loadAutenticacaoRaw();
  if (!autenticacao || autenticacao.auth === false) return null;
  const token = autenticacao.token;
  if (!token) return null;

  const decoded = _decodeTokenSafe(token);
  if (!decoded) {
    logout();
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  if (decoded.exp && decoded.exp <= now) {
    console.log('Token expirado');
    logout();
    return null;
  }

  // Backend pode ter colocado o objeto do usuário em decoded.produtor,
  // decoded.usuario, ou pode ter claims diretas (id, email, tipo).
  const possible = decoded.produtor || decoded.usuario || decoded.user || decoded;
  // normalize: tenta extrair id/email/tipo/nome
  const user = {
    id: possible.id ?? possible.ID ?? possible.produtorId ?? possible.userId ?? null,
    email: possible.email ?? possible.mail ?? null,
    tipo: (possible.tipo ?? possible.type ?? possible.role ?? null),
    nome: possible.nome ?? possible.name ?? null,
    raw: possible
  };
  return user;
};

// Retorna true se o usuário atual for admin (tipo 'A' ou 'a' ou 'admin')
export const isAdmin = () => {
  const u = getUsuario();
  if (!u) return false;
  const t = (u.tipo || '').toString().toLowerCase();
  return t === 'a' || t === 'admin' || t === 'administrador';
};

export const gravaAutenticacao = (json) => {
  // json deve conter { auth: true/false, token: "..." }
  localStorage.setItem(`${NOMEAPP}/autenticacao`, JSON.stringify(json));
};

export const logout = () => {
  localStorage.setItem(`${NOMEAPP}/autenticacao`, JSON.stringify({
    auth: false,
    token: ''
  }));
};
