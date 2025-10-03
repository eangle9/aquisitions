import app from "#src/app.js"
import request from 'supertest';

describe('API Endpoints', () => {
    describe('Get /health', () => {
        it('should return health status', async () => {
            const response = await request(app).get('/health').expect(200);

            expect(response.text).toBe('OK');
        })
    })

    describe('Get /api', () => {
        it('should return api responses', async () => {
            const response = await request(app).get('/api').expect(200);

            expect(response.body).toHaveProperty('message', 'Welcome to the Acquisitions API');
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body).toHaveProperty('uptime');
        })
    })

    describe('Get /nonexist', () => {
        it('should return route not found error', async () => {
            const response = await request(app).get('/nonexist').expect(404);

            expect(response.body).toHaveProperty('error', 'Route not found');
        })
    })
})