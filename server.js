const express = require('express');
const mysql = require('mysql2');
const dbConfig = require('./server/dbConfig');
const cors = require('cors');
const app = express();
const port = process.env.PORT_APPLICATION;
const connection = mysql.createConnection(dbConfig);

const apiRouter = express.Router();

app.use('/v1/api', apiRouter);

app.use(cors());

connection.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión a la base de datos establecida');
});

apiRouter.get('/boletas', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    if (isNaN(page) || page < 1) {
        return res.status(400).send('El número de página debe ser un número positivo.');
    }

    if (isNaN(pageSize) || pageSize < 1) {
        return res.status(400).send('El tamaño de la página debe ser un número positivo.');
    }

    const maxPageSize = 100;
    if (pageSize > maxPageSize) {
        return res.status(400).send(`El tamaño de la página no puede ser mayor que ${maxPageSize}.`);
    }

    const offset = (page - 1) * pageSize;

    connection.query('SELECT * FROM cabina_db.Boleta LIMIT ? OFFSET ?', [pageSize, offset], (err, results) => {
        if (err) {
            return res.status(500).send('Error al recuperar datos');
        }
        res.json(results);
    });
});

apiRouter.get('/boleta/:idBoleta', (req, res) => {
    const boletaId = req.params.idBoleta; // Corregido: usar idBoleta en lugar de id

    if (isNaN(boletaId)) {
        return res.status(400).send('El ID de la boleta debe ser un número.');
    }

    connection.query('SELECT * FROM cabina_db.Boleta WHERE idBoleta = ?', [boletaId], (err, results) => {
        if (err) {
            return res.status(500).send('Error al recuperar la boleta');
        }

        if (results.length === 0) {
            return res.status(404).send('Boleta no encontrada');
        }

        res.json(results[0]);
    });
});



app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});