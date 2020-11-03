const mysql = require('../mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getUsers = async (req, res, next) => {
    try {
        const query = `SELECT * FROM usuarios WHERE email = ?`;
        const result = await mysql.execute(query, [req.body.email]);
        if (result.length < 1) {
            return res.status(401).send({ message: 'Authentication failed' })
        }

        bcrypt.compare(req.body.senha, result[0].senha, (err, results) => {
            if (err) {
                return res.status(401).send({ message: 'Authentication failed' });
            }
            if (results) {
                const token = jwt.sign({
                    UsuarioID: result[0].usuario_id,
                    Nome: result[0].nome,
                    Email: result[0].email,
                    tipoUsuario: parseInt(result[0].tipoUsuario),
                    condominioId: parseInt(result[0].condominio_id),
                }, process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    });

                return res.status(200).send({
                    usuario: {
                        usuarioId: result[0].usuario_id,
                        Nome: result[0].nome,
                        email: result[0].email,
                        senha: result[0].senha,
                        dtNascimento: result[0].dtNasc,
                        cpf: result[0].cpf,
                        tipoUsuario: parseInt(result[0].tipoUsuario),
                        condominioId: parseInt(result[0].condominio_id),
                    },
                    token: token
                });
            }
            return res.status(401).send({ message: 'Authentication failed' });
        });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.getOneUser = async (req, res, next) => {
    try {
        const query = 'SELECT * FROM usuarios WHERE usuario_id = ?;';
        const result = await mysql.execute(query, [req.params.idUser]);
        if (result.length == 0) {
            return res.status(404).send({
                message: 'User doesnt exists'
            })
        }

        const response = {
            usuario: {
                usuarioId: result[0].usuario_id,
                Nome: result[0].nome,
                email: result[0].email,
                senha: result[0].senha,
                dtNascimento: result[0].dtNasc,
                cpf: result[0].cpf,
                tipoUsuario: parseInt(result[0].tipoUsuario),
                condominioId: parseInt(result[0].condominio_id),
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.postUser = async (req, res, next) => {
    try {
        let query = `SELECT * FROM usuarios WHERE email = ?`;
        const results = await mysql.execute(query, [req.body.email]);
        if (results.length > 0) {
            res.status(409).send({ message: 'Email is already registered' })
        } else {
            bcrypt.hash(req.body.senha, 10, async (errBcrypt, hash) => {
                if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }

                if (req.body.tipoUsuario === 3 || req.body.tipoUsuario === 1) {
                    query = `INSERT INTO usuarios 
                    (nome, email, telefone, senha, dtNasc, cpf, tipoUsuario, condominio_id) VALUES 
                    (?, ?, ?, ?, ?, ?, ?, ?);`;
                    const result = await mysql.execute(query, [
                        req.body.nome,
                        req.body.email,
                        req.body.telefone,
                        hash,
                        req.body.dtNasc,
                        req.body.cpf,
                        req.body.tipoUsuario,
                        req.body.condominioId,
                    ]);

                    const response = {
                        message: 'User successful created',
                        usuarioCriado: {
                            idUsuario: result.insertId,
                            Nome: req.body.nome,
                            Emal: req.body.email,
                            hash: hash,
                            dtNascimento: req.body.dtNasc,
                            CPF: req.body.cpf,
                            tipoUsuario: req.body.tipoUsuario,
                            condominioId: req.body.condominioId,
                        }
                    }
                    return res.status(201).send(response);
                } else {
                    query = `INSERT INTO condominios (cidade, bairro, numero, uf, cep) VALUES
                    (?,?,?,?,?);`;
                    const result2 = await mysql.execute(query, [
                        req.body.cidade,
                        req.body.bairro,
                        req.body.numero,
                        req.body.uf,
                        req.body.cep
                    ]);

                    query = `INSERT INTO usuarios 
                            (nome, email, telefone, senha, dtNasc, cpf, tipoUsuario, condominio_id) VALUES 
                            (?, ?, ?, ?, ?, ?, ?, ?);`;
                    const result = await mysql.execute(query, [
                        req.body.nome,
                        req.body.email,
                        req.body.telefone,
                        hash,
                        req.body.dtNasc,
                        req.body.cpf,
                        req.body.tipoUsuario,
                        result2.insertId
                    ]);

                    const response = {
                        message: 'User and condominium successful created',
                        usuarioCriado: {
                            idUsuario: result.insertId,
                            Nome: req.body.nome,
                            Emal: req.body.email,
                            hash: hash,
                            dtNascimento: req.body.dtNasc,
                            CPF: req.body.cpf,
                            tipoUsuario: req.body.tipoUsuario,
                            condominioId: req.body.condominioId,
                        },
                        condominioCriado: {
                            Cidade: req.body.cidade,
                            Bairro: req.body.bairro,
                            Numero: req.body.numero,
                            UF: req.body.uf,
                            CEP: req.body.cep
                        }
                    }
                    return res.status(201).send(response);
                }
            }); //Encripta a senha e coloca 10 caracteres aleatórios na senha
        }
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        bcrypt.hash(req.body.senha, 10, async (errBcrypt, hash) => {
            if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }

            const query = `UPDATE usuarios 
                            SET nome = ?, 
                            email = ?, 
                            telefone = ?, 
                            senha = ?,
                            dtNasc = ?,
                            cpf = ?
                        WHERE usuario_id = ?;`;
            await mysql.execute(query, [
                req.body.nome,
                req.body.email,
                req.body.telefone,
                hash,
                req.body.dtNasc,
                req.body.cpf,
                req.body.usuario_id,
            ]);

            const response = {
                message: 'User changed',
                usuarioAlterado: {
                    idUsuario: req.body.usuario_id,
                    Nome: req.body.nome,
                    Emal: req.body.email,
                    senha: hash,
                    dtNascimento: req.body.dtNasc,
                    CPF: req.body.cpf
                }
            }
            return res.status(202).send(response);
        });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.deleteUser = (req, res, next) => {
    try {
        const query = `DELETE FROM usuarios WHERE usuario_id = ?`;
        mysql.execute(query, [req.body.usuario_id]);

        const response = {
            mensagem: 'User deleted.',
        }

        return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};