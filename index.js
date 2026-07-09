const path = require('path');
const fastify = require('fastify')({ logger: true });

// Serve static files from the React frontend build
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'frontend', 'dist'),
  prefix: '/',
});

// Fallback for React Router (Single Page Application)
fastify.setNotFoundHandler((req, reply) => {
  reply.sendFile('index.html');
});

// Example API route
fastify.get('/api/hello', async (request, reply) => {
  return { hello: 'world' };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Server is running at http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
