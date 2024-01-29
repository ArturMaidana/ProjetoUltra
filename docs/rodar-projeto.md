# Rodar o projeto

Para começar, é necessário instalar as dependências. Na pasta do projeto, execute o seguinte comando:

```bash
npm install
```

---

## Criar ou conectar com o banco de dados

Verifique nos arquivos .env e api/config/config.js se as configurações do seu banco estão corretas. Se não estiverem, faça os devidos ajustes.

Se desejar criar o banco, execute o seguinte comando:

```bash
npx sequelize db:create
```

Se já tiver o banco configurado, execute apenas as migrações:

```bash
npx sequelize db:migrate
```

---

## Popular o banco de dados

Se necessário, execute o seguinte comando para adicionar alguns dados ao banco:

```bash
npx sequelize db:seed:all
```

Verifique no banco se os dados foram adicionados.

---

## Iniciar a API

Para rodar nossa API, utilize o comando:

```bash
npm start
```

Nossa API estará funcionando localmente em:

http://localhost:3030
