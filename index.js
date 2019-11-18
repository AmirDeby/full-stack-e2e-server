const express = require('express');
const app = express();
const Joi = require('@hapi/joi');
const cors = require('cors');
require('dotenv').config();

const users = {};

const port = process.env.PORT;
// this is my cors middlware
app.use(cors());
// this is my body parsher 
app.use(express.json());


app.post('/register', (req, res) => {
    const { userName, password, firstName, lastName } = req.body;

    const userSchema = Joi.object({
        userName: Joi.string().min(5).max(10).required(),
        password: Joi.string().min(3).max(15).regex(/[!@#$*]/).required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
    })
    const validation = userSchema.validate({ userName, password, firstName, lastName });

    if (validation.error) {
        res.status(400).send(validation.error);
        return
    }
    if (users[userName]) {
        res.status(400).send('user name already exists');
        return
    }
    const user = {
        userName,
        password,
        firstName,
        lastName
    };

    users[userName] = user;

    res.send(`registration ${firstName} Complete`);

})

app.post('/login', (req, res) => {

    const { userName, password } = req.body;

    const loginShecma = Joi.object({
        userName: Joi.string().required(),
        password: Joi.string().required(),
    })

    const validation = loginShecma.validate({ userName, password });

    if (validation.error) {
        res.status(400).send(validation.error);
        return
    }

    if (!users[userName] || users[userName].password !== password) {
        res.status(401).send('user and passwird dont match')
    }
    const token = Date.now().toString();
    users[userName].token = token

    res.send({ token })
})



app.listen(port, () => {
    console.log(`server is up: ${port}`);
});



