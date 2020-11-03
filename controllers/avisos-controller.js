const mysql = require('../mysql');

exports.getAvisos = async (req, res, next) => {
    try {
        const query = `
            SELECT * FROM avisos WHERE condominio_id = ?;
        `;

        const result = await mysql.execute(query, [req.body.idCondominio]);
        const response = {
            quantity: result.length,
            avisos: result.map(item => {
                return {
                    avisoId: item.aviso_id,
                    img: item.img,
                    mensagem: item.mensagem,
                }
            })
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.getOneAviso = async (req, res, next) => {
    try {
        const query = 'SELECT * FROM avisos WHERE aviso_id = ?';
        const result = await mysql.execute(query, [req.params.idAvisos]);
        if (result.length == 0) {
            return res.status(404).send({
                message: 'Aviso doesnt exists'
            })
        }

        const response = {
            aviso: {
                aviso_id: result[0].aviso_id,
                img: result[0].img,
                mensagem: result[0].mensagem,
                condominio_id: result[0].condominio_id
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.postAvisos = async (req, res, next) => {
    try {
        const query = `INSERT INTO avisos (img, mensagem, condominio_id) VALUES (?, ?, ?);`;
        const results = await mysql.execute(query, [
            req.body.img,
            req.body.mensagem,
            req.params.idCondominio
        ]);

        const response = {
            message: 'Aviso successful created',
            avisoCriado: {
                avisoId: results.insertId,
                img: req.body.img,
                mensagem: req.body.mensagem,
                idCondominio: req.body.idCondominio,
            }
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.updateAvisos = async (req, res, next) => {
    try {
        const query = `UPDATE avisos 
                            SET img = ?,
                            mensagem = ?
                        WHERE aviso_id = ?;`;
        await mysql.execute(query, [
            req.body.img,
            req.body.mensagem,
            req.params.idAvisos,
        ]);

        const response = {
            message: 'Aviso changed',
            comentarioChanged: {
                Imagem: req.body.img,
                Mensagem: req.body.mensagem,
                idAvisos: req.params.idAvisos,
            }
        }
        return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.deleteAvisos = async (req, res, next) => {
    try {
        let query = 'SELECT * FROM avisos WHERE aviso_id = ?';
        const result = await mysql.execute(query, [req.params.idAvisos]);

        if (result.length == 0) {
            return res.status(404).send({
                message: 'Aviso doesnt exists'
            })
        }


        query = 'DELETE FROM avisos WHERE aviso_id = ?';
        await mysql.execute(query, [req.params.idAvisos]);

        const response = {
            mensagem: 'Area deleted.',
        }

        return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error })
    }
};