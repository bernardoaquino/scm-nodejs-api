const mysql = require('../mysql');

exports.getComentarios = async (req, res, next) => {
    try {
        const query = `
            SELECT * FROM comentarios WHERE aviso_id = ?;
        `;

        const result = await mysql.execute(query, [req.body.aviso_id]);
        const response = {
            quantity: result.length,
            comentarios: result.map(item => {
                return {
                    comentarioId: item.comentario_id,
                    mensagem: item.mensagem,
                    usuarioId: item.usuario_id,
                }
            })
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.getOneComentario = async (req, res, next) => {
    try {
        const query = 'SELECT * FROM comentarios WHERE comentario_id = ?';
        const result = await mysql.execute(query, [req.params.idComentarios]);
        if (result.length == 0) {
            return res.status(404).send({
                message: 'Comentario doesnt exists'
            })
        }

        const response = {
            comentario: {
                comentarioId: result[0].comentario_id,
                mensagem: result[0].mensagem,
                usuarioId: result[0].usuario_id,
                avisoId: result[0].aviso_id,
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.postComentarios = async (req, res, next) => {
    try {
        const query = `INSERT INTO comentarios (mensagem, usuario_id, aviso_id) VALUES (?, ?, ?);`;
        const results = await mysql.execute(query, [
            req.body.mensagem,
            req.body.usuario_id,
            req.body.aviso_id
        ]);

        const response = {
            message: 'Comentário successful created',
            comentarioCriado: {
                comentarioId: results.insertId,
                mensagem: req.body.mensagem,
                usuarioId: req.body.usuario_id,
                avisoId: req.body.aviso_id,
            }
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.updateComentarios = async (req, res, next) => {
    try {
        const query = `UPDATE comentarios 
                            SET mensagem = ?
                        WHERE comentario_id = ?;`;
        await mysql.execute(query, [
            req.body.mensagem,
            req.params.idComentarios,
        ]);

        const response = {
            message: 'Comentario changed',
            comentarioChanged: {
                comentarioId: req.params.idComentarios,
                mensagem: req.body.mensagem,
                usuarioId: req.body.usuario_id,
                avisoId: req.body.aviso_id,
            }
        }
        return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.deleteComentarios = async (req, res, next) => {
    try {
        let query = 'SELECT * FROM comentarios WHERE comentario_id = ?';
        const result = await mysql.execute(query, [req.params.idComentarios]);

        if (result.length == 0) {
            return res.status(404).send({
                message: 'Comentario doesnt exists'
            })
        }


        query = 'DELETE FROM comentarios WHERE comentario_id = ?';
        await mysql.execute(query, [req.params.idComentarios]);

        const response = {
            mensagem: 'Comentario deleted.',
        }

        return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error })
    }
};