const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

//MYSQL connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'contact_list_db',
    connectionLimit: 10,
    queueLimit: 0
});

app.use(bodyParser.json());

// GET all contacts 
app.get('/contacts',(req,res)=>{
    pool.query('SELECT * FROM contacts',(error, results)=>{
        if (error){
            return res.status(500).json({message: 'Internal Server Error'});
        }
    });
});

//GET contact by ID
app.get('/contacts/:id',(req,res)=>{
    const contactID = req.params.id;
    pool.query('SELECT * FROM contacts WHERE id= ?',[contactID],(error,results)=> {
        if (error){
            return res.status(500).json({message:'Internal Server Error'});
        }
        if (results.length == 0){
            return res.status(404).json({message:'Contact not found'});
        }
        res.json(results[0]);
    });
});


//create new contact
app.post('/contacts',(req,res)=>{
    const {name, phone, email} = req.body;
    pool.query('INSERT INTO contacts (name, phone, email) VALUES (?,?,?)',[name, phone, email, (error, results)=>{
        if (error){
            return res.status(400).json({message: 'Bad Request'});
        }
        res.status(201).json({id: results.insertID, name, phone, email});
    }]);
});


//update a contact
app.put('/contact/:id',(req,res)=> {
    const contactID = req.params.id;
    const {name, phone, email } = req.body;
    pool.query('UPDATE contacts SET name = ?, phone = ?, email =? Where id = ?', [name, phone, email, contactID], (error, reults) => {
        if (error){
            return res.status(400).json({message: 'Bad Request'});
        }
        res.json({id: contactID, name, phone, email });
    });

});


//delete a contact 
app.delete('/contact/:id', (req, res) => {
    const contactID = req.params.id;
    pool.query('DELETE FROM contacts WHERE id = ?', [contactID], (error, results) => {
        if (error){
            return res.status(500).json({message: 'Internal Server Error'});
        }
        res.json({message: 'Contact deleted successfully'});
    });
});


//start the server
app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
});
