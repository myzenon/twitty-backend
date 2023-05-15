import fastify from 'fastify'
import cors from '@fastify/cors'
import applyAuthentication from '@/authentication'
import applyRoutes from '@/routes'

const server = fastify({ logger: true })

// Register authentication
applyAuthentication(server)

// Register routes
applyRoutes(server)

const startServer = async () => {
    await server.register(cors, {})
    try {
        await server.listen({
            port: Number(process.env['PORT'] ?? '3000'),
            host: process.env['HOST'] ?? '0.0.0.0',
        })
    }
    catch (error) {
        server.log.error(error)
        process.exit(1)
    }
}

startServer()
