import { FastifyInstance } from 'fastify'
import postRoutes from './post'
import userRoutes from './user'

export default function (server: FastifyInstance) {
    server.register(postRoutes, { prefix: '/post' })
    server.register(userRoutes, { prefix: '/user' })
}
