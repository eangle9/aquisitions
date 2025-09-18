import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Aqcuisitions!');
});

export default app;
