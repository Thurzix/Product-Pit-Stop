const bcrypt = require('bcryptjs');
const connection = require('./config/database');

// Substitua esta variável com a senha do usuário que você quer atualizar
const senhaNaoCriptografada = 'senha123';
const emailDoUsuario = 'usuario@teste.com'; // O email do usuário que você quer atualizar

// Gerar o hash da senha
const salt = bcrypt.genSaltSync(10);
const senhaCriptografada = bcrypt.hashSync(senhaNaoCriptografada, salt);

// Atualizar a senha no banco de dados
connection.query(
  'UPDATE usuarios SET senha = ? WHERE email = ?',
  [senhaCriptografada, emailDoUsuario],
  (err, results) => {
    if (err) {
      console.error('Erro ao atualizar a senha:', err);
      return;
    }
    console.log('Senha atualizada com sucesso!');
  }
);
