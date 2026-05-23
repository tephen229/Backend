import express from 'express';
import cors from 'cors';
import eventRoutes from './routes/eventRoute.js';
import categoryRoutes from './routes/categoryRoute.js';
import pembicaraRoute from './routes/pembicaraRoute.js';

const app = express();
const port = 3000;

app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://frontend-roan-theta-25.vercel.app'
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use("/events", eventRoutes);
app.use("/categories", categoryRoutes); // Endpoint: http://localhost:3000/categories
app.use("/speakers", pembicaraRoute);


// Di local tetap jalan pakai port 3000, di Vercel otomatis di-export sebagai modul serverless
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;