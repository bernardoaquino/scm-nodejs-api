const mysql = require('../mysql');

exports.getAreas = async (req, res, next) => {
    try {
        const query = `
            SELECT * FROM areas WHERE condominio_id = ?;
        `;

        const result = await mysql.execute(query, [req.body.idCondominio]);
        const response = {
            quantity: result.length,
            areas: result.map(item => {
                return {
                    area_id: item.area_id,
                    nome: item.nome,
                }
            })
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.getOneAreas = async (req, res, next) => {
    try {
        const query = 'SELECT * FROM areas WHERE area_id = ?';
        const result = await mysql.execute(query, [req.params.idAreas]);
        if (result.length == 0) {
            return res.status(404).send({
                message: 'Area doesnt exists'
            })
        }

        const response = {
            area: {
                area_id: result[0].area_id,
                nome: result[0].nome,
                condominio_id: result[0].condominio_id
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.postAreas = async (req, res, next) => {
    try {
        const query = `INSERT INTO areas (nome, condominio_id) VALUES (?, ?);`;
        const results = await mysql.execute(query, [
            req.body.nome,
            req.params.idCondominio
        ]);

        const response = {
            message: 'Area successful created',
            areaCriada: {
                areaId: results.insertId,
                nome: req.body.nome,
                idCondominio: req.body.idCondominio,
            }
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.updateAreas = async (req, res, next) => {
    try {
        let query = 'SELECT * FROM areas WHERE nome = ?';
        const result = await mysql.execute(query, [req.body.nome]);

        if (result.length < 0) {
            return res.status(404).send({
                message: 'Area does exists'
            })
        }

        query = `UPDATE areas 
                            SET nome = ?
                        WHERE area_id = ?;`;
        await mysql.execute(query, [
            req.body.nome,
            req.params.idAreas,
        ]);

        const response = {
            message: 'Area changed',
            gastoChanged: {
                Nome: req.body.nome,
                idAreas: req.params.idAreas,
            }
        }
        return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.deleteAreas = async (req, res, next) => {
    try {
        let query = 'SELECT * FROM areas WHERE area_id = ?';
        const result = await mysql.execute(query, [req.params.idAreas]);

        if (result.length == 0) {
            return res.status(404).send({
                message: 'Area doesnt exists'
            })
        }


        query = 'DELETE FROM areas WHERE area_id = ?';
        await mysql.execute(query, [req.params.idAreas]);

        const response = {
            mensagem: 'Area deleted.',
        }

        return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error })
    }
};