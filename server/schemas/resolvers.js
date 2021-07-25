const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const {bookSchema} = require('../models/Book');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async(parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                  .select('-__v -password')
                  .populate('thoughts')
                  .populate('savedBooks');
        
                return userData;
              }
        
              throw new AuthenticationError('Not logged in');
        },
        user: async (parent, { username }) => {
            return User.findOne({ username })
                .select('-__v -password')
                .populate('savedBooks')
        },
        books: async () => {
            Books.find()
        },
        book: async (parent, {bookId}) => {
            return Book.findOne({bookId})
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
      
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, args, context) => {
            if(context.user){
                await User.findByIdAndUpdate(
                    {_id: context.user.id},
                    {$push: {savedBook: [args]}},
                    {new: true}
                )
                throw new AuthenticationError('You need to be logged in!');
            }
        },
        removeBook: async(parent, {bookId}, context) => {
            if(context.user){
                await bookSchema.findByIdAndDelete({bookId: bookId});
                await User.findOneAndDelete(
                    {_id: context.user.id},
                    {$pull: {savedBook: [{bookId: bookId}]}}
                )
            }
        }

    }
};