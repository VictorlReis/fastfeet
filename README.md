# FastFeet

FastFeet é uma api de uma transportadora fictícia, criada com o intúito apenas de aplicar alguns conceitos de desenvolvimento back-end em Node.JS.

### Configurando o banco de dados

```
docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```
```
docker run --name mongodb -p 27017:27017 -d -t mongo
```
```
docker run --name redisbarber -p 6379:6379 -d -t redis:alpine
```

### Instalando as dependências e iniciando o projeto

```
yarn
```
```
yarn sequelize db:migrate
```
```
yarn start
```

## Sentry e MailTrap

Essa aplicação utiliza do Sentry, para obter as variáveis de conexão semelhantes as utilizadas no projeto, é necessário criar uma conta no site:
```
https://sentry.io
```
O mesmo serve para o serviço utilizado para simular os e-mails, o mailtrap:
```
https://mailtrap.io
```

## License

Esse projeto está sobre uma licença MIT, mais detalhes disponíveis no link: [LICENSE.md](https://opensource.org/licenses/MIT) 

