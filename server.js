const express = require('express');
const path = require('path');
const app = express();

// Servir arquivos estáticos da pasta public
app.use(express.static('public'));

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para o formulário
app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

// Rota para o CSS
app.get('/css/:file', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'css', req.params.file));
});

// Rota para o JavaScript
app.get('/js/:file', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'js', req.params.file));
});

// Tratamento de erro 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Porta definida pelo Render ou 3000 localmente
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 