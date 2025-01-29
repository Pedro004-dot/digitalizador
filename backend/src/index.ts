import express from 'express';
import { PrismaClient } from '@prisma/client';
import userRoutes from './routes/userRouter';
import prefeituraRouter from './routes/prefeituraRouter';
import documentoRouter from './routes/documentoRouter';
import cors from 'cors';
import router from './routes/testeRouter';
import routerAWS from './routes/awsRouter';

const app = express();


// Instância do Prisma
const prisma = new PrismaClient();

app.use(express.json());

// Rotas
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use('/teste', router);
app.use('/user', userRoutes);
app.use('/prefeitura', prefeituraRouter);
app.use('/documento', documentoRouter);
app.use('/aws',routerAWS)

// Conectar ao banco de dados antes de iniciar o servidor
prisma.$connect()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    // Inicia o servidor
    app.listen(process.env.PORT, () => {
      console.log(`Servidor rodando em ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1); // Finaliza o processo se a conexão falhar
  });