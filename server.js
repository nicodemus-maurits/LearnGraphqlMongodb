require('dotenv').config()
const express = require('express')
const expressGraphQL = require('express-graphql')
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull } = require('graphql')
const mongoose = require('mongoose')
const app = express()

const Book = require('./models/Book')
const Author = require('./models/Author')

mongoose.connect(process.env.DATABASE_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => console.log('Succesfully connected to database...'))

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'Book Structure',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLString) },
        title: { type: GraphQLNonNull(GraphQLString) }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'Author Structure',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) }
    })
})

const rootQueryType = new GraphQLObjectType({
    name: 'query',
    description: 'Root Query',
    fields: () => ({
        book: {
            type: BookType,
            description: 'Single Book',
            args: {
                id: { type: GraphQLString }
            },
            resolve: async (parent, args) => {
                const book = await Book.findById(args.id)
                return book
            }
        },
        books: {
            type: new GraphQLList(BookType),
            description: 'List of Books',
            resolve: async () => {
                const books = await Book.find()
                return books
            }
        },
        author: {
            type: AuthorType,
            description: 'Single Author',
            args: {
                id: { type: GraphQLString }
            },
            resolve: async (parent, args) => {
                const author = await Author.findById(args.id)
                return author
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of Authors',
            resolve: async () => {
                const authors = await Author.find()
                return authors
            }
        }
    })
})

const rootMutationType = new GraphQLObjectType({
    name: 'mutation',
    description: 'Root Mutation',
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'Add Book',
            args: {
                title: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parent, args) => {
                const book = new Book({
                    title: args.title
                })
                try {
                    const newBook = await book.save()
                    return newBook
                } catch (err) {
                    return { message: err.message }
                }
            }
        },
        addAuthor: {
            type: AuthorType,
            description: 'Add Author',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: async (parent, args) => {
                const author = new Author({
                    name: args.name
                })
                try {
                    const newAuthor = await author.save()
                    return newAuthor
                } catch (err) {
                    return { message: err.message }
                }
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: rootQueryType,
    mutation: rootMutationType
})

app.use('/graphql', expressGraphQL({
    graphiql: true,
    schema
}))

app.listen(5000, () => console.log('Server is running...'))
