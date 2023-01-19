require('dotenv').config();
const mongoose = require('mongoose');
const { request, response } = require('express');
const express = require('express');
const app = express();
const cors = require('cors');
// const morgan = require('morgan');

const url = process.env.MONGODB_URI

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: Number
})

const Person = mongoose.model('Person', personSchema)

app.use(express.static('build'))
app.use(cors())
app.use(express.json())



// morgan.token('golden', function (req, res) {return JSON.stringify(res.body)})
// const lol = morgan(function (tokens, req, res) {
//     return [
//       tokens.method(req, res),
//       tokens.url(req, res),
//       tokens.status(req, res),
//       tokens.res(req, res, 'content-length'), '-',
//       tokens['response-time'](req, res), 'ms',
//       tokens.golden(req, res)
//     ].join(' ')
//   })

// app.use(lol)

// const persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

const info = () => {
    return(
        `<p>Phonebook has info for ${persons.length} people</p>` +
        `<p>${new Date()}</P>`
    )
}

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})



app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    person = persons.filter(person => person.id !== id)
    response.status(204).end()
})

// const generateId = () => {
//     const maxId = persons.length > 0 
//         ? Math.max(...persons.map(n => n.id))
//         : 0 
    
//     return maxId + 1
// }

const generateId = () => Math.floor(Math.random()*100000)

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (persons.some(person => {
        return person.name == body.name
    })) {
        response.status(400).json({
            error: 'name must be unique'
        })
    }

    else if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    else if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    
    persons.concat(person)
    console.log(person);
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`server running on ${PORT}`);