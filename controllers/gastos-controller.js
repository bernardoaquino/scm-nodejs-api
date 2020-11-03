const mysql = require('../mysql');

exports.getGastos = async (req, res, next) => {
    try {
        const query = `
            SELECT * FROM gastos WHERE condominio_id = ?;
        `;

        const result = await mysql.execute(query, [req.body.idCondominio]);
        const response = {
            quantity: result.length,
            gastos: result.map(item => {
                return {
                    gasto_id: item.gasto_id,
                    comprovante: item.comprovante,
                    description: item.Description,
                    valor_total: item.valor_total,
                    categoria_gasto: item.categoria_gasto,
                    mes: item.mes
                }
            })
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.getOneGasto = async (req, res, next) => {
    try {
        const query = 'SELECT * FROM gastos WHERE gasto_id = ?';
        const result = await mysql.execute(query, [req.params.idGastos]);
        if (result.length == 0) {
            return res.status(404).send({
                message: 'Gasto doesnt exists'
            })
        }

        const response = {
            gasto: {
                gasto_id: result[0].gasto_id,
                comprovante: result[0].comprovante,
                description: result[0].Description,
                valor_total: result[0].valor_total,
                categoria_gasto: result[0].categoria_gasto,
                mes: result[0].mes,
                condominio_id: result[0].condominio_id
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.postGastos = async (req, res, next) => {
    try {
        const query = `INSERT INTO gastos (comprovante, valor_total, categoria_gasto, mes, condominio_id) VALUES (?, ?, ?, ?, ?);`;
        const results = await mysql.execute(query, [
            req.body.comprovante,
            req.body.valor_total,
            req.body.categoria_gasto,
            req.body.mes,
            req.params.idCondominio
        ]);

        const response = {
            message: 'Gasto successful created',
            gastoCriado: {
                gastoId: results.insertId,
                Comprovante: req.body.comprovante,
                valorTotal: req.body.valor_total,
                categoriaGasto: req.body.categoria_gasto,
                Mes: req.body.mes,
                idCondominio: req.body.idCondominio,
            }
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.updateGastos = async (req, res, next) => {
    try {
        const query = `UPDATE gastos 
                            SET comprovante = ?, 
                            valor_total = ?, 
                            categoria_gasto = ?,
                            mes = ?
                        WHERE gasto_id = ?;`;
        await mysql.execute(query, [
            req.body.comprovante,
            req.body.valor_total,
            req.body.categoria_gasto,
            req.body.mes,
            req.params.idGastos,
        ]);

        const response = {
            message: 'Gasto changed',
            gastoChanged: {
                Comprovante: req.body.comprovante,
                valorTotal: req.body.valor_total,
                categoriaGasto: req.body.categoria_gasto,
                mes: req.body.mes,
                idGastos: req.params.idGastos,
            }
        }
        return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.deleteGastos = async (req, res, next) => {
    try {
        let query = 'SELECT * FROM gastos WHERE gasto_id = ?';
        const result = await mysql.execute(query, [req.params.idGastos]);

        if (result.length == 0) {
            return res.status(404).send({
                message: 'Gasto doesnt exists'
            })
        }


        query = 'DELETE FROM gastos WHERE gasto_id = ?';
        await mysql.execute(query, [req.params.idGastos]);

        const response = {
            mensagem: 'Gasto deleted.',
        }

        return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error })
    }
};