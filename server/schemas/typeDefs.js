const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Query {
    me: User
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(savedBooks: [bookschema], bookId: String!, image: String, link: String!, title: String): User
    removeBook(bookId: String!): User
}

type User {
    _id: ID
    username: String
    email: String
    savedBooks: [bookSchema]
    bookCount: Integer
}

type Book {
    bookId: String
    authors: [String]
    description: String
    image: String
    title: String
    link: String
}

type Auth {
    token: ID!
    user: User
}
`;

module.exports = typeDefs;