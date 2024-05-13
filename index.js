const express = require ('express');
//MySQL é o nome de uma variável pode ser qualquer coisa
//MySQL parece mais intuitivo do que o mysql2
const mysql = require('mysql2');
const app = express();
app.use(express.json());
app.get('/medicos', (req, res) =>{
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'Felipe',
        database: 'hospital',
        password: '4379'
    })

    connection.query('SELECT * FROM tb_medico', (err, results, fields) => {
        //result tem as linas
        //fields tem a meta dados sobre os resultados, caso estejam disponíveis
        console.log(results);
        console.log(fields);
        res.send('ok');

    })
})

const porta = 3000;
app.listen(porta, () => console.log('Executando. Porta ' + porta));

