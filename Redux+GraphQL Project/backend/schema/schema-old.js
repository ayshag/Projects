const graphql = require('graphql');
const _ = require('lodash');
var bcrypt = require('bcrypt-nodejs');
var { mongoose } = require('../db/mongoose');
var { users } = require('../models/user');
var { properties } = require('../models/property');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

// dummy data
var searchresults = [];
var propertyname, arrive, depart, guests;

var authors = [
    { name: 'OneAuthor', age: 24, id: '1' },
    { name: 'TwoAuthor', age: 42, id: '2' },
    { name: 'ThreeAuthor', age: 66, id: '3' }
];

var usersarray = [
    { name: 'Traveler1', username: 'traverler1@mail.com', password: '123456' },
    // { name: 'Traveler2', username:'traverler2@mail.com', password : '123456' },
    // { name: 'Traveler3', username:'traverler3@mail.com', password : '123456' },
    // { name: 'Traveler4', username:'traverler4@mail.com', password : '123456' },

];

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        phone: { type: GraphQLInt },
        name: { type: GraphQLString },
        aboutme: { type: GraphQLString },
        city: { type: GraphQLString },
        country: { type: GraphQLString },
        school: { type: GraphQLString },
        hometown: { type: GraphQLString },
        languages: { type: GraphQLString },
        gender: { type: GraphQLString },
        propowner: { type: GraphQLString }
    })
});

const PropertyType = new GraphQLObjectType({
    name: 'Property',
    fields: () => ({
        id: { type: GraphQLID },
        location: { type: GraphQLString },
        name: { type: GraphQLString },
        guests: { type: GraphQLInt },
        type: { type: GraphQLInt },
        bedrooms: { type: GraphQLInt },
        bathrooms: { type: GraphQLInt },
        price: { type: GraphQLInt },
        amenities: { type: GraphQLInt },
        arrive: { type: GraphQLString },
        depart: { type: GraphQLString },
        //   owner: { type: GraphQLString },
        availablestart: { type: GraphQLString },
        availableend: { type: GraphQLString },
        owner: { type: GraphQLString },/* {
            type: new GraphQLList(UserType),
            resolve(parent, args){
                return _.filter(users, { userId: parent.id });
            }
        }*/
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return _.find(users, { id: args.id });
            }
        },
        property: {
            type: PropertyType,
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString }
            },
            resolve(parent, args) {
                properties.find({ name: propertyname}, function (err, result) {
                    if (err) {
                        console.log(err);

                    } else if (result) {
                        console.log(result);
                        searchresults = result;
                        return result;
                        // callback(null, result);
                    }
                    else {
                        console.log("No Properties");
                    }
                }).then(result => {
                 //   console.log("Search Results", result);
                    return result;
                });
            
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return users;
            }
        },
        properties: {
            type: new GraphQLList(PropertyType),
            resolve(parent, args) {
                console.log("SR: ", searchresults);
                return searchresults;
            }
        }
    }
});

var count = 10;
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {


        home: {
            type: PropertyType,
            args: {
                location: { type: GraphQLString },
                arrive: { type: GraphQLString },
                depart: { type: GraphQLString },
                guests: { type: GraphQLString },
            },
            resolve(parent, args) {

                console.log(args);
                properties.find({ location: args.location, sleeps: args.guests, availablestart: { $lte: args.arrive }, availableend: { $gte: args.depart } }, function (err, result) {
                    if (err) {
                        console.log(err);

                    } else if (result) {
                        console.log(result);
                        searchresults = result;
                        return result;
                        // callback(null, result);
                    }
                    else {
                        console.log("No Properties");
                    }
                }).then(result => {
                 //   console.log("Search Results", result);
                    return result;
                });

            }

        },
        signup: {
            type: UserType,
            args: {
                username: { type: GraphQLString },
                password: { type: GraphQLString },
                name: { type: GraphQLString },
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                let user = {
                    name: args.name,
                    username: args.username,
                    id: args.id,
                    password: args.password
                };

                users.findOne({ username: user.username }, function (error, result) {
                    if (error) {
                        console.log(error);
                    }
                    else if (result) {
                        console.log("Username already exists");
                        //     callback(null, false);
                    }

                    else {
                        var hashsalt = bcrypt.genSalt(5, function (err, salt) { return salt; });

                        bcrypt.hash(user.password, hashsalt, null, function (err, hash) {
                            hashedpassword = hash;

                            var traveler = new users({
                                username: user.username,
                                password: hashedpassword,
                                name: user.name
                            });

                            traveler.save().then(() => {
                                console.log("Account Created");
                                //     callback(null, true);

                            }, (err) => {
                                console.log(err);


                            })
                        });

                    }
                })

                // console.log("Added User",usersarray);
                return user;
            }
        },
        login: {
            type: UserType,
            args: {
                username: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parent, args) {
                console.log(args);
                let recuser = {
                    name: args.name,
                    username: args.username,
                    id: args.id,
                    password: args.password
                };
                console.log(searchresults);
                var validated = null;
                users.findOne({ username: args.username }, function (err, user) {
                    console.log("Finding User");
                    if (err) {
                        console.log("Error: ", err);
                    }
                    else if (user) {

                        bcrypt.compare(args.password, user.password, function (err, response) {

                            if (response) {
                                console.log("User Validated");

                                //     user.toJSON();
                                //    user.validated = "";
                                //   user.validated = "true";
                                return user;
                            } else {
                                console.log("Invalid Information");

                                //user.toJSON();
                                // user.validated = "";
                                // user.validated = "false";
                                return user;
                            }
                        })
                    }
                    else {
                        console.log("Username Does Not Exist");

                    }
                    return recuser;
                })/*.then(user => {  
                    console.log("user", user);
                    return user;});*/
                return recuser;

            }

        },

        propdetails: {
            type: PropertyType,
            args: {
                name: { type: GraphQLString },
                arrive: { type: GraphQLString },
                depart: { type: GraphQLString },
                guests: { type: GraphQLString },
            },
            resolve(parent, args) {
                console.log(args);
                propertyname = args.name;
                arrive = args.arrive;
                depart = args.depart;
                guests = args.guests;
                return args;
            }
        }

        /*  addBook: {
              type: BookType,
              args: {
                  name: { type: GraphQLString },
                  genre: { type: GraphQLString },
                  authorId: { type: GraphQLID },
              },
              resolve(parent, args){
                  let book = {
                      name: args.name,
                      genre: args.genre,
                      authorId: args.authorId,
                      id:count++
                  }
                  books.push(book);
                  return book;
              }
          }
      */
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});