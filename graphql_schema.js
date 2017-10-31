const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');
const crypto = require('crypto');

const algorithm = 'aes-256-ctr';

// We need a Type object for our encryption
const EncryptType = new GraphQLObjectType({
  name: 'Encrypt',
  description: 'Encrypts a message.',

  fields: () => ({
    passphrase: {
      type: GraphQLString,
    },
    ciphertext: {
      type: GraphQLString,
      resolve: ciphertext => ciphertext,
    },
    name: {
      type: GraphQLString,
    },
    expiration: {
      type: GraphQLString,
    },
  }),
});

const DecryptType = new GraphQLObjectType({
  name: 'Decrypt',
  description: 'Decrypts a message.',

  fields: () => ({
    passphrase: {
      type: GraphQLString,
    },
    message: {
      type: GraphQLString,
      resolve: data => data.message,
    },
    name: {
      type: GraphQLString,
      resolve: data => data.name,
    },
    expiration: {
      type: GraphQLString,
      resolve: data => data.expiration,
    },
  }),
});

// These are some functions for crypto
// Encrypt a message
const encrypt = (text, passphrase) => {
  const cipher = crypto.createCipher(algorithm, passphrase);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
};

// Decrypt a message
const decrypt = (text, passphrase) => {
  const decipher = crypto.createDecipher(algorithm, passphrase);
  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
};

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: '...',

    fields: () => ({
      decrypt: {
        type: DecryptType,
        args: {
          passphrase: { type: GraphQLString },
          ciphertext: { type: GraphQLString },
        },
        resolve: async (root, args) => {
          const data = await decrypt(args.ciphertext, args.passphrase);
          const message = JSON.parse(data);

          // Lets check the date
          const today = new Date();
          const expiration = new Date(message.expiration);

          if (today >= expiration) {
            message.name = '';
            message.expiration = '';
            message.message = 'The message you entered is either expired or invalid.';
          }

          return message;
        },
      },
      encrypt: {
        type: EncryptType,
        args: {
          passphrase: { type: GraphQLString },
          message: { type: GraphQLString },
          name: { type: GraphQLString },
          expiration: { type: GraphQLString },
        },
        resolve: async (root, args) => {
          const encryptThis = JSON.stringify({
            message: args.message,
            name: args.name,
            expiration: args.expiration,
          });

          const ciphertext = await encrypt(encryptThis, args.passphrase);
          return ciphertext;
        },
      },
    }),
  }),
});
