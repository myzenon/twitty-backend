import { FastifyPluginAsync, FastifyRequest, User } from 'fastify'
import database from '@/database'
import { Post } from '@prisma/client'

const getPostLimit = 3

const router: FastifyPluginAsync = async function (server) {
    server.get(
        '/',
        {
            schema: {
                querystring: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                    },
                },
                response: {
                    200: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: { type: 'number' },
                                name: { type: 'string' },
                                content: { type: 'string' },
                                createdAt: { type: 'string' },
                                updatedAt: { type: 'string' },
                            },
                        },
                    },
                },
            },
        },
        async (request: FastifyRequest<{ Querystring:{ page?: number, }, }>) => {
            const skip = getPostLimit * (request.query.page ?? 1 - 1)
            const posts = await database.post.findMany({
                include: { author: true },
                skip,
                take: getPostLimit,
                orderBy: { createdAt: 'desc' },
            })
            return posts.map(post => {
                if (post.author) {
                    post.name = `${post.author.name} (${post.author.email})`
                }
                return post
            })
        },
    )

    server.get(
        '/:id',
        {
            schema: {
                params: {
                    type: 'object',
                    required: [ 'id' ],
                    properties: {
                        id: { type: 'string' },
                    },
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            name: { type: 'string' },
                            content: { type: 'string' },
                            createdAt: { type: 'string' },
                            updatedAt: { type: 'string' },
                        },
                    },
                },
            },
        },
        async (serverRequest: FastifyRequest<{Params: { id: string, },}>, reply) => {
            const { id } = serverRequest.params
            const post = await database.post.findFirst({ where: { id: Number(id) } })
            if (!post) {
                reply.statusCode = 404
                throw new Error('post id not found')
            }
            return post
        },
    )

    server.post(
        '/',
        {
            onRequest: [ server.canAuthenticate ],
            schema: {
                body: {
                    type: 'object',
                    required: [ 'content' ],
                    properties: {
                        name: { type: 'string' },
                        content: { type: 'string' },
                    },
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            name: { type: 'string' },
                            content: { type: 'string' },
                            createdAt: { type: 'string' },
                            updatedAt: { type: 'string' },
                        },
                    },
                },
            },
        },
        async (serverRequest, reply) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const request: FastifyRequest<{ Body: { content: string, name?: string, }, }> = serverRequest as any
            const postInput: Partial<Post> = {}
            postInput.content = request.body.content
            if (request.user) {
                postInput.authorId = (request.user as User).id
            }
            else {
                if (request.body.name) {
                    postInput.name = request.body.name
                }
                else {
                    reply.statusCode = 400
                    throw new Error(`body must have required property 'name'`)
                }
            }
            const post = await database.post.create({ data: postInput as Post, include: { author: true } })
            if (post.author) {
                post.name = `${post.author.name} (${post.author.email})`
            }
            return post
        },
    )

}

export default router
