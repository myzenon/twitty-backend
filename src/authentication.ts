import { FastifyPluginAsync, FastifyPluginCallback, FastifyRequest, FastifyReply, FastifyInstance } from 'fastify'
import fastifyJwt from '@fastify/jwt'

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
        canAuthenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
    }
    interface User {
        id: number
        email: string
        password: string
    }
}

export default function (server: FastifyInstance) {
    server.register(fastifyJwt, { secret: 'supersecret' })

    server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify()
        }
        catch (error) {
            reply.send(error)
        }
    })

    server.decorate('canAuthenticate', async (request: FastifyRequest) => {
        try {
            await request.jwtVerify()
        }
        catch (error) {
            // Do nothing
        }
    })
}
