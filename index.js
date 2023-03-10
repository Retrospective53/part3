require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const app = express()
const cors = require('cors')
// const morgan = require('morgan');


const unknownEndPoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}





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
    `<p>Phonebook has info for people</p>` +
        `<p>${new Date()}</P>`
  )
}

app.get('/info', (request, response) => {
  response.send(info())
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  // const id = Number(request.params.id)
  // const person = persons.find(person => person.id === id)
  // if (person) {
  //     response.json(person)
  // } else {
  //     response.status(404).end()
  // }

  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      next(unknownEndPoint)
      next(errorHandler)
    }
  })
    .catch(error => next(error))
})



app.delete('/api/persons/:id', (request, response, next) => {
  // const id = Number(request.params.id)
  // person = persons.filter(person => person.id !== id)
  // response.status(204).end()

  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// const generateId = () => {
//     const maxId = persons.length > 0
//         ? Math.max(...persons.map(n => n.id))
//         : 0

//     return maxId + 1
// }

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // if (persons.some(person => {
  //     return person.name == body.name
  // })) {
  //     response.status(400).json({
  //         error: 'name must be unique'
  //     })
  // }

  // else if (!body.name) {
  //     return response.status(400).json({
  //         error: 'name missing'
  //     })
  // }
  // else if (!body.number) {
  //     return response.status(400).json({
  //         error: 'number missing'
  //     })
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  console.log(person)

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatePerson => {
      response.json(updatePerson)
    })
    .catch(error => next(error))
})

app.use(unknownEndPoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`server running on ${PORT}`)