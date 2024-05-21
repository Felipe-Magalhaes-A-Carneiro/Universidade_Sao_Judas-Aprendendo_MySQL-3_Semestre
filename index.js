require('dotenv').config()
const express = require('express');
//MySQL é o nome de uma variável pode ser qualquer coisa
//MySQL parece mais intuitivo do que o mysql2
const mysql = require('mysql2');
const app = express();
app.use(express.json());

// Cada variável fica acessível como uma propriedade do objeto process.env
const { DB_USER, DB_PASSWORD, DB_HOST, DB_DATABASE } = process.env

// Criacao de um Pool de conexoes
const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    //se todas as conexões estiverem ocupadas, novos solicitantes esperam numa fila
    //se configurado com false, causa um erro quando recebe requisições e todas
    //as conexões estão ocupadas
    waitForConnections: true,
    //no máximo 10 conexões. Elas são abertas sob demanda e não no momento de
    //construção do pool
    connectionLimit: 10,
    //quantos solicitantes podem aguardar na fila? 0 significa que não há limite
    queueLimit: 0
})


app.get('/medicos', (req, res) => {
    pool.query('SELECT * FROM tb_medico', (err, results, fields) => {
        res.json(results)
    })

})

// Armazena dados dos medicos
app.post('/medicos', (req, res) => {
   const crm = req.body.crm
    const nome = req.body.nome
    const sql = "INSERT INTO tb_medico (crm, nome) VALUES ("
        + crm + ", '" + nome + "')"
    pool.query(sql,
        [crm, nome],
        (err, results, fields) => {
            console.log(results)
            console.log(fields)
            res.send('ok')
        })
})


app.get('/pacientes', (req, res) => {
    pool.query('SELECT * FROM tb_paciente', (err, results, fields) => {
        res.json(results)
        })
})

// Endpoint: Obtenção de consultas
app.get('/consultas', (req, res) => {
    const connection = mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        database: DB_DATABASE,
        password: DB_PASSWORD
    })
    const sql = `
    SELECT 
     m.nome as nome_medico, c.data_hora, p.nome as 
    nome_paciente
     FROM
     tb_medico m, tb_consulta c, tb_paciente p
    WHERE m.crm = c.crm AND c.cpf = p.cpf
    `
    pool.query(
        sql,
        (err, results, fields) => {
            res.json(results)
        }
    )
})


const porta = 3000;
app.listen(porta, () => console.log('Executando. Porta ' + porta));

