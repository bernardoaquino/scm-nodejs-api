const mysql = require('../mysql');

exports.getOneCondominios = async (req, res, next) => {
    try {
        const query = 'SELECT * FROM condominios WHERE condominio_id = ?';
        const result = await mysql.execute(query, [req.params.idCondominios]);
        if (result.length == 0) {
            return res.status(404).send({
                message: 'Condominio doesnt exists'
            })
        }

        const response = {
            condominio: {
                condominioId: result[0].condominio_id,
                cidade: result[0].cidade,
                bairro: result[0].bairro,
                numero: result[0].numero,
                uf: result[0].uf,
                cep: result[0].cep,
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.updateCondominios = async (req, res, next) => {
    try {
        const query = `UPDATE condominios 
                            SET cidade = ?,
                            bairro = ?,
                            numero = ?,
                            uf = ?,
                            cep = ?
                        WHERE condominio_id = ?;`;
        await mysql.execute(query, [
            req.body.cidade,
            req.body.bairro,
            req.body.numero,
            req.body.uf,
            req.body.cep,
            req.params.idCondominios,
        ]);

        const response = {
            message: 'Condominio changed',
            condominioChanged: {
                condominioId: req.params.idCondominios,
                cidade: req.body.cidade,
                bairro: req.body.bairro,
                numero: req.body.numero,
                uf: req.body.uf,
                cep: req.body.cep,
            }
        }
        return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

// exports.deleteCondominios = async (req, res, next) => {
//     try {
//         let query = 'SELECT * FROM condominios WHERE condominio_id = ?';
//         const result = await mysql.execute(query, [req.params.idCondominios]);

//         if (result.length == 0) {
//             return res.status(404).send({
//                 message: 'Condominio doesnt exists'
//             })
//         }


//         query = 'DELETE FROM condominios WHERE condominio_id = ?';
//         await mysql.execute(query, [req.params.idCondominios]);

//         const response = {
//             mensagem: 'Comentario deleted.',
//         }

//         return res.status(202).send(response);
//     } catch (error) {
//         return res.status(500).send({ error: error })
//     }
// };