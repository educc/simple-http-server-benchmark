// api.test.js
const request = require('supertest');
const baseUrl = process.env.TEST_URL || 'http://localhost:3000';

describe('API Endpoints', () => {

  describe('GET /plain', () => {
    it('should return JSON hello world', async () => {
      const res = await request(baseUrl)
        .get('/plain')
        .expect('Content-Type', /application\/json/)
        .expect(200);

      expect(res.body).toEqual({ message: 'Hello, world!' });
    });
  });

  describe('GET /html-template', () => {
    it('should return rendered HTML', async () => {
      const res = await request(baseUrl)
        .get('/html-template')
        .expect('Content-Type', /text\/html/)
        .expect(200);

      // check basic structure; tweak to match your template
      expect(res.text).toMatch(/<!DOCTYPE html>/i);
      expect(res.text).toMatch(/<html.*>[\s\S]*<\/html>/i);
      expect(res.text).toMatch(/Hi Ben/g)
    });
  });

  describe('GET /sqlite/random-5fields/:size', () => {
    [1, 3, 5].forEach(size => {
      it(`should return ${size} items each with 5 fields`, async () => {
        const res = await request(baseUrl)
          .get(`/sqlite/random-5fields/${size}`)
          .expect('Content-Type', /application\/json/)
          .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(size);

        res.body.forEach(item => {
          expect(item).toBeInstanceOf(Object);
          expect(Object.keys(item).length).toBe(5+1);
        });
      });
    });

  });

  describe('GET /sqlite/random-30fields/:size', () => {
    [1, 2].forEach(size => {
      it(`should return ${size} items each with 30 fields`, async () => {
        const res = await request(baseUrl)
          .get(`/sqlite/random-30fields/${size}`)
          .expect('Content-Type', /application\/json/)
          .expect(200);

        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(size);

        res.body.forEach(item => {
          expect(item).toBeInstanceOf(Object);
          expect(Object.keys(item).length).toBe(30+1);
        });
      });
    });

  });

});