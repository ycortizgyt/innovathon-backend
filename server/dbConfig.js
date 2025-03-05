require('dotenv').config();

module.exports = {
    host: process.env.CABINA_IP,
    port: process.env.CABINA_PORT,
    user: process.env.CABINA_USR,
    password: process.env.CABINA_PWD,
    database: process.env.CABINA_DB
};