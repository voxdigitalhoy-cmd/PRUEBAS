require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
const pool = require('./db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.FRONTEND_URL || '*' , credentials: true } });

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(rateLimit({ windowMs: 60*1000, max: 200 }));

app.get('/api/health', (req,res)=> res.json({ ok: true }));

app.post('/api/persons', async (req,res)=>{
  const { identifier, first_initial, last_initial, mother_initial, section, cp, birth_year } = req.body;
  if (!identifier || !first_initial || !last_initial || !section || !cp) return res.status(400).json({ error: 'Missing required fields' });
  try {
    const r = await pool.query(
      'INSERT INTO persons (identifier, first_initial, last_initial, mother_initial, section, cp, birth_year) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, identifier',
      [identifier, first_initial.toUpperCase(), last_initial.toUpperCase(), mother_initial?mother_initial.toUpperCase():null, section, cp, birth_year||null]
    );
    io.emit('person:created', { identifier: r.rows[0].identifier });
    return res.json(r.rows[0]);
  } catch (err) {
    if (err && err.code === '23505') return res.status(409).json({ error: 'identifier already exists' });
    console.error(err);
    return res.status(500).json({ error: 'db error' });
  }
});

// Endpoint to delete test data (protected by TEST_DELETE_TOKEN env var)
app.post('/api/admin/delete-test-data', async (req,res)=>{
  const token = req.headers['x-delete-token'] || req.body.token;
  if (!process.env.TEST_DELETE_TOKEN) return res.status(403).json({ error: 'Not enabled' });
  if (!token || token !== process.env.TEST_DELETE_TOKEN) return res.status(401).json({ error: 'Invalid token' });
  try {
    await pool.query('DELETE FROM answers');
    await pool.query('DELETE FROM responses');
    await pool.query('DELETE FROM persons');
    return res.json({ ok: true });
  } catch (e) { console.error(e); return res.status(500).json({ error: 'delete error' }); }
});

io.on('connection', (socket)=>{
  console.log('socket connected', socket.id);
  socket.on('survey:subscribe', (sid)=> socket.join('survey_'+sid));
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, ()=> console.log('Server listening on', PORT));
