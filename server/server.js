const express = require('express');
const { authMiddleware } = require('./utils/auth');
//import Apollo
const { ApolloServer } = require('apollo-server-express');
const path = require('path');

//importing typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

const startServer = async () => {
  //creating a new Apollo server and pass in our schema data
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
  });

  //start apollo server
  await server.start();

  //integrate our Apollo server with the express application as middleware
  server.applyMiddleware({ app });

  //log where we can go to test our GQL API
  console.log(`Use GraphQl at http://localhost:${PORT}${server.graphqlPath}`);
};

//initialize the Apollo server
startServer();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//serve up static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__direname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__direname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
