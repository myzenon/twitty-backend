import database from '@/database'
import { FastifyPluginAsync, FastifyRequest, User } from 'fastify'

const router: FastifyPluginAsync = async function (server) {
    server.get('/', { onRequest: [ server.authenticate ] }, async (request) => {
        const user = request.user as User
        return await database.user.findFirst({ where: { id: user.id } })
    })

    server.post(
        '/',
        {
            schema: {

                body: {
                    type: 'object',
                    required: [ 'email', 'password', 'name' ],
                    properties: {
                        email: { type: 'string' },
                        password: { type: 'string' },
                        name: { type: 'string' },
                    },
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            email: { type: 'string' },
                            name: { type: 'string' },
                        },
                    },
                },
            },
        },
        async function (request: FastifyRequest<{ Body: { email: string, password: string, name: string, }, }>, reply) {
            const createInput = request.body
            const existingUser = await database.user.findFirst({ where: { email: createInput.email } })
            if (existingUser) {
                reply.statusCode =400
                throw new Error('email-already-exists')
            }
            return await database.user.create({ data: createInput })
        },
    )

    server.post(
        '/login',
        {
            schema: {
                body: {
                    type: 'object',
                    required: [ 'email', 'password' ],
                    properties: {
                        email: { type: 'string' },
                        password: { type: 'string' },
                    },
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            token: { type: 'string' },
                        },
                    },
                },
            },
        },
        async (request: FastifyRequest<{ Body: { email: string, password: string, }, }>, reply) => {
            const { email, password } = request.body
            const user = await database.user.findFirst({ where: { email } })
            if (!user) {
                reply.statusCode = 400
                throw new Error('email-not-found')
            }
            if (user.password !== password) {
                reply.statusCode = 400
                throw new Error('password-incorrect')
            }

            const token = server.jwt.sign({
                id: user.id,
                email: user.email,
                name: user.name,
            })
            return { token }
        },
    )
}

export default router
