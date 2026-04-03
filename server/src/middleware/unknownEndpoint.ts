import { RequestHandler } from 'express'

const unknownEndpoint: RequestHandler = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

export default unknownEndpoint
