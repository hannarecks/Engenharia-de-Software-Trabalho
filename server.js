const express = require('express');
const cors = require('cors');
const processorController = require('./src/controllers/processor-controller');

const app = express();
app.use(cors());
app.use(express.json());

// Rota que o React vai chamar
app.post('/api/processor/compare', processorController.compareDocuments);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend a rodar na porta ${PORT}`);
});