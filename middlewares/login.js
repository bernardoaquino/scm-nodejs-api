const jwt = require('jsonwebtoken');

exports.required = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.client = decode; //JSON com objeto do JWT(idClient, Name e Token)
        next(); //Passa para o próximo método
    } catch {
        return res.status(401).send({ message: 'Authentication failed' });
    }
}

exports.optional = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.client = decode; //JSON com objeto do JWT(idClient, Name e Token)
        next(); //Passa para o próximo método
    } catch {
        next();
    }
}