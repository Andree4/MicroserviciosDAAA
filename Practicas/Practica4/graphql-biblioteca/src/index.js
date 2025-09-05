require("reflect-metadata");
const { DataSource } = require("typeorm");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");
const Libro = require("./entity/Libro");
const Prestamo = require("./entity/Prestamo");

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "graphql_biblioteca",
    synchronize: true,
    logging: false,
    entities: [Libro, Prestamo]
});

async function startServer() {
    const app = express();
    await AppDataSource.initialize();
    console.log("✅ Conectado a la base de datos");

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: () => ({ AppDataSource })
    });

    await server.start();
    server.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log(`🚀 Servidor listo en http://localhost:4000${server.graphqlPath}`);
    });
}

startServer();
