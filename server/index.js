require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));
app.use(express.json());

// Prisma v7 requires an adapter for MySQL
const adapter = new PrismaMariaDb({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'my-strong-dev-password',
  database: 'cms_dev',
  connectionLimit: 10
});
const prisma = new PrismaClient({ adapter });

// Database connection check
prisma.$connect()
  .then(() => console.log('✓ Connected to MySQL database via Prisma'))
  .catch((err) => console.error('Error connecting to database:', err.message));

app.get('/', (req, res) => {
  res.json({ 
    message: 'CMS API Server', 
    status: 'running',
    environment: process.env.NODE_ENV 
  });
});

// fetch all certs from db - using Prisma instead of raw SQL
app.get('/api/certifications', async (req, res) => {
  try {
    const rows = await prisma.certification.findMany();
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching certifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch certifications',
      message: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`✓ Express server running on http://localhost:${port}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV}`);
});