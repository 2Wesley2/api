const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const handleValidationErrors = require('../../src/utils/handleValidationErrors');
const isAuthenticated = require('../../src/middlewares/isAuthenticated');
require('dotenv').config();

jest.mock('jsonwebtoken');
jest.mock('../../src/utils/handleValidationErrors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require('cookie-parser')());
app.get('/protected', isAuthenticated, (req, res) => {
  res
    .status(200)
    .json({ message: 'Acesso permitido', role: req.role, id: req.id });
});

describe('isAuthenticated Middleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar 401 quando o token está ausente', async () => {
    const response = await request(app).get('/protected');
    expect(handleValidationErrors).toHaveBeenCalledWith(
      [{ status: 401, msg: 'Acesso negado. Usuário não autenticado.' }],
      expect.any(Object),
    );
    expect(response.status).toBe(401);
  }, 20000); // Ajuste o tempo limite para 20 segundos

  it('deve retornar 500 quando JWT_SECRET não está definido', async () => {
    const originalSecret = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;

    const response = await request(app)
      .get('/protected')
      .set('Cookie', 'token=validtoken');
    expect(handleValidationErrors).toHaveBeenCalledWith(
      [{ status: 500, msg: 'Erro interno do servidor.' }],
      expect.any(Object),
    );
    expect(response.status).toBe(500);

    process.env.JWT_SECRET = originalSecret;
  }, 20000); // Ajuste o tempo limite para 20 segundos

  it('deve retornar 401 quando o token é inválido ou expirado', async () => {
    process.env.JWT_SECRET = 'supersecret';
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Token inválido ou expirado'), null);
    });

    const response = await request(app)
      .get('/protected')
      .set('Cookie', 'token=invalidtoken');
    expect(handleValidationErrors).toHaveBeenCalledWith(
      [{ status: 401, msg: 'Token inválido ou expirado.' }],
      expect.any(Object),
    );
    expect(response.status).toBe(401);
  }, 20000); // Ajuste o tempo limite para 20 segundos

  it('deve retornar 401 quando campos obrigatórios estão ausentes no token', async () => {
    process.env.JWT_SECRET = 'supersecret';
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { email: 'user@example.com' }); // Faltam role e id
    });

    const response = await request(app)
      .get('/protected')
      .set('Cookie', 'token=validtoken');
    expect(handleValidationErrors).toHaveBeenCalledWith(
      [{ status: 401, msg: 'Campos ausentes.' }],
      expect.any(Object),
    );
    expect(response.status).toBe(401);
  }, 20000); // Ajuste o tempo limite para 20 segundos

  it('deve passar quando o token é válido e contém os campos obrigatórios', async () => {
    process.env.JWT_SECRET = 'supersecret';
    const user = {
      id: new mongoose.Types.ObjectId(), // Use `new` para criar ObjectId
      role: new mongoose.Types.ObjectId(), // Use `new` para criar ObjectId
      email: 'user@example.com',
    };
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, user);
    });

    const response = await request(app)
      .get('/protected')
      .set('Cookie', 'token=validtoken');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Acesso permitido',
      role: user.role.toString(),
      id: user.id.toString(),
    });
  }, 20000); // Ajuste o tempo limite para 20 segundos
});

// Aumentar o timeout padrão para 20000 ms (20 segundos)
jest.setTimeout(20000);
