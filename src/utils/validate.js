/**
 * Validação de formulários — retorna { campo: "mensagem de erro" }
 * Objeto vazio = formulário válido.
 */

// ─── CPF / CNPJ ──────────────────────────────────────────────────────────────

function stripMask(v) {
  return (v || "").replace(/\D/g, "");
}

export function validateCPF(raw) {
  const cpf = stripMask(raw);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let r = (sum * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  if (r !== parseInt(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  r = (sum * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  return r === parseInt(cpf[10]);
}

export function validateCNPJ(raw) {
  const c = stripMask(raw);
  if (c.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(c)) return false;
  const calc = (c, len) => {
    let sum = 0, pos = len - 7;
    for (let i = len; i >= 1; i--) {
      sum += parseInt(c[len - i]) * pos--;
      if (pos < 2) pos = 9;
    }
    return sum % 11 < 2 ? 0 : 11 - (sum % 11);
  };
  return calc(c, 12) === parseInt(c[12]) && calc(c, 13) === parseInt(c[13]);
}

function validateTelefone(v) {
  const digits = stripMask(v);
  return digits.length >= 10 && digits.length <= 13;
}

// ─── Formulários ─────────────────────────────────────────────────────────────

export function validateClientRegister(data) {
  const e = {};

  if (!data.nome?.trim())     e.nome = "Nome é obrigatório.";

  if (!data.email?.trim())    e.email = "E-mail é obrigatório.";
  else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = "E-mail inválido.";

  if (!data.telefone?.trim()) e.telefone = "Telefone é obrigatório.";
  else if (!validateTelefone(data.telefone)) e.telefone = "Telefone inválido (mínimo 10 dígitos).";

  if (data.cpf?.trim() && !validateCPF(data.cpf))
    e.cpf = "CPF inválido.";

  if (!data.senha?.trim())          e.senha = "Senha é obrigatória.";
  else if (data.senha.length < 6)   e.senha = "Senha deve ter ao menos 6 caracteres.";

  if (!data.confirma_senha?.trim()) e.confirma_senha = "Confirme sua senha.";
  else if (data.senha !== data.confirma_senha) e.confirma_senha = "As senhas não conferem.";

  return e;
}

export function validateSellerRegister(data) {
  const e = {};

  if (!data.nome_responsavel?.trim()) e.nome_responsavel = "Nome do responsável é obrigatório.";
  if (!data.nome_empresa?.trim())     e.nome_empresa     = "Nome da empresa é obrigatório.";

  if (!data.email?.trim())            e.email = "E-mail é obrigatório.";
  else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = "E-mail inválido.";

  if (!data.telefone?.trim())         e.telefone = "Telefone é obrigatório.";
  else if (!validateTelefone(data.telefone)) e.telefone = "Telefone inválido (mínimo 10 dígitos).";

  if (data.cpf_cnpj?.trim()) {
    const digits = stripMask(data.cpf_cnpj);
    if (data.tipo_documento === "CPF" && !validateCPF(digits))
      e.cpf_cnpj = "CPF inválido.";
    if (data.tipo_documento === "CNPJ" && !validateCNPJ(digits))
      e.cpf_cnpj = "CNPJ inválido.";
  }

  if (!data.bairro?.trim()) e.bairro = "Bairro é obrigatório.";
  if (!data.cidade?.trim()) e.cidade = "Cidade é obrigatória.";
  if (!data.uf?.trim())     e.uf     = "UF é obrigatório.";

  if (!data.senha?.trim())          e.senha = "Senha é obrigatória.";
  else if (data.senha.length < 6)   e.senha = "Senha deve ter ao menos 6 caracteres.";

  if (!data.confirma_senha?.trim()) e.confirma_senha = "Confirme sua senha.";
  else if (data.senha !== data.confirma_senha) e.confirma_senha = "As senhas não conferem.";

  return e;
}

export function validateLogin(data) {
  const e = {};
  if (!data.email?.trim()) e.email = "E-mail é obrigatório.";
  if (!data.senha?.trim()) e.senha = "Senha é obrigatória.";
  return e;
}

export function validateProduct(data) {
  const e = {};
  if (!data.nome?.trim()) e.nome = "Nome é obrigatório.";
  if (data.preco === "" || data.preco == null) e.preco = "Preço é obrigatório.";
  else if (isNaN(parseFloat(data.preco)) || parseFloat(data.preco) < 0)
    e.preco = "Preço deve ser um valor positivo.";
  if (!data.descricao?.trim()) e.descricao = "Descrição é obrigatória.";
  return e;
}

export function validatePayment(data) {
  const e = {};
  if (!data.nome?.trim())     e.nome     = "Nome é obrigatório.";
  if (!data.telefone?.trim()) e.telefone = "Telefone é obrigatório.";
  else if (stripMask(data.telefone).length < 10) e.telefone = "Telefone inválido.";
  return e;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
