const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const userRoute = require('./routes/user');
const condominiosRoute = require('./routes/condominios');
const gastosRoute = require('./routes/gastos');
const areasRoute = require('./routes/areas');
const avisosRoute = require('./routes/avisos');
const comentariosRoute = require('./routes/comentarios');

app.use(morgan('dev')); //No ambiente de desenvolvimento, vai executar um call back e monitorar toda a execução retornando um log
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false })); //Apenas aceita dados simples
app.use(bodyParser.json()); //Só vai aceitar json de entrada no body

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); //Se fosse servidor específico colocar no lugar de * 'https://servidor.com.br'(API só seria acessível por esse servidor)
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    ); //Oque vai aceitar de cabeçalho 

    if (req.method === 'OPTIONS') { //Retorna os métodos que a API aceita
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }

    next(); //Define todo o cabeçalho e passa para as próximas rotas
});

app.use('/user', userRoute);
app.use('/condominios', condominiosRoute);
app.use('/gastos', gastosRoute);
app.use('/areas', areasRoute);
app.use('/avisos', avisosRoute);
app.use('/comentarios', comentariosRoute);

app.use((req, res, next) => {
    const erro = new Error('Rota não encontrada');
    erro.status = 404;
    next(erro); //Passa para a próxima rota com um parâmetro
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;