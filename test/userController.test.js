const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../src/models/User');

describe('User Endpoints', () => {
  let adminToken;
  let storekeeperToken;
  let adminId;
  let storekeeperId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Limpa todos os usuários antes de iniciar os testes
    await User.deleteMany({});

    // Registro do administrador
    const adminRegisterRes = await request(app).post('/users/register').send({
      email: 'admin@example.com',
      password: 'adminpassword',
      role: 'admin',
    });

    // Verificação da criação do usuário admin
    expect(adminRegisterRes.statusCode).toEqual(201);

    // Login do administrador para obter o token
    const adminLoginRes = await request(app).post('/users/login').send({
      email: 'admin@example.com',
      password: 'adminpassword',
    });

    // Verificação do login do admin e obtenção do token
    expect(adminLoginRes.statusCode).toEqual(200);
    adminToken = adminLoginRes.body.token;
    adminId = adminLoginRes.body.id;

    // Registro do lojista com autenticação do admin
    const storekeeperRes = await request(app)
      .post('/users/register')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'storekeeper@example.com',
        password: 'storepassword',
        role: 'lojista',
      });

    // Verificação da criação do usuário lojista
    expect(storekeeperRes.statusCode).toEqual(201);
    storekeeperId = storekeeperRes.body._id;

    // Login do lojista para obter o token
    const storekeeperLoginRes = await request(app).post('/users/login').send({
      email: 'storekeeper@example.com',
      password: 'storepassword',
    });

    expect(storekeeperLoginRes.statusCode).toEqual(200);
    storekeeperToken = storekeeperLoginRes.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should login an admin user', async () => {
    const res = await request(app).post('/users/login').send({
      email: 'admin@example.com',
      password: 'adminpassword',
    });

    if (res.statusCode !== 200) {
      console.error('Erro no login do admin:', res.body);
    }

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should get all users as admin', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`);

    if (res.statusCode !== 200) {
      console.error('Erro ao obter todos os usuários como admin:', res.body);
    }

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should not allow storekeeper to register a user', async () => {
    const res = await request(app)
      .post('/users/register')
      .set('Authorization', `Bearer ${storekeeperToken}`)
      .send({
        email: 'newuser@example.com',
        password: 'newpassword',
        role: 'lojista',
      });

    if (res.statusCode !== 403) {
      console.error(
        'Erro ao impedir que o lojista registre um usuário:',
        res.body,
      );
    }

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty(
      'message',
      'Acesso negado. Apenas administradores podem registrar novos usuários.',
    );
  });

  it('should get own user info as storekeeper', async () => {
    const res = await request(app)
      .get(`/users/${storekeeperId}`)
      .set('Authorization', `Bearer ${storekeeperToken}`);

    if (res.statusCode !== 200) {
      console.error(
        'Erro ao obter informações do próprio usuário como lojista:',
        res.body,
      );
    }

    expect(res.statusCode).toEqual(200);
    expect(res.body.email).toEqual('storekeeper@example.com');
  });

  it('should not allow storekeeper to get other user info', async () => {
    const res = await request(app)
      .get(`/users/${adminId}`)
      .set('Authorization', `Bearer ${storekeeperToken}`);

    if (res.statusCode !== 403) {
      console.error(
        'Erro ao impedir que o lojista obtenha informações de outro usuário:',
        res.body,
      );
    }

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty(
      'message',
      'Acesso negado. Você só pode acessar suas próprias informações.',
    );
  });

  it('should update own user info as storekeeper', async () => {
    const res = await request(app)
      .put(`/users/${storekeeperId}`)
      .set('Authorization', `Bearer ${storekeeperToken}`)
      .send({
        email: 'updatedstorekeeper@example.com',
      });

    if (res.statusCode !== 200) {
      console.error(
        'Erro ao atualizar informações do próprio usuário como lojista:',
        res.body,
      );
    }

    expect(res.statusCode).toEqual(200);
    expect(res.body.email).toEqual('updatedstorekeeper@example.com');
  });

  it('should not allow storekeeper to update other user info', async () => {
    const res = await request(app)
      .put(`/users/${adminId}`)
      .set('Authorization', `Bearer ${storekeeperToken}`)
      .send({
        email: 'updatedadmin@example.com',
      });

    if (res.statusCode !== 403) {
      console.error(
        'Erro ao impedir que o lojista atualize informações de outro usuário:',
        res.body,
      );
    }

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty(
      'message',
      'Acesso negado. Você só pode atualizar suas próprias informações.',
    );
  });

  it('should delete own user as storekeeper', async () => {
    const res = await request(app)
      .delete(`/users/${storekeeperId}`)
      .set('Authorization', `Bearer ${storekeeperToken}`);

    if (res.statusCode !== 200) {
      console.error(
        'Erro ao deletar o próprio usuário como lojista:',
        res.body,
      );
    }

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Usuário deletado com sucesso');
  });

  it('should not allow storekeeper to delete other user', async () => {
    const res = await request(app)
      .delete(`/users/${adminId}`)
      .set('Authorization', `Bearer ${storekeeperToken}`);

    if (res.statusCode !== 403) {
      console.error(
        'Erro ao impedir que o lojista delete outro usuário:',
        res.body,
      );
    }

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty(
      'message',
      'Acesso negado. Você só pode deletar suas próprias informações.',
    );
  });
});
