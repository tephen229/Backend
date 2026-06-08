import express from 'express';
import cors from 'cors';
import eventRoutes from './routes/eventRoute.js';
import categoryRoutes from './routes/categoryRoute.js';
import pembicaraRoute from './routes/pembicaraRoute.js';
import usersRoute from './routes/usersRoute.js';
import authRoute from "./routes/authRoute.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use("/", authRoute);
app.use("/events", eventRoutes);
app.use("/categories", categoryRoutes);
app.use("/speakers", pembicaraRoute);
app.use("/users", usersRoute);


// Di local tetap jalan pakai port 3000, di Vercel otomatis di-export sebagai modul serverless
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;