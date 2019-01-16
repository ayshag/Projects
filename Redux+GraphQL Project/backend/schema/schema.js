
const graphql = require('graphql');
const _ = require('lodash');
var bcrypt = require('bcrypt-nodejs');
var { mongoose } = require('../db/mongoose');
var { users } = require('../models/user');
var { properties } = require('../models/property');
var { trip_booking } = require('../models/trips_bookings');

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
var selectedProp = [];
var traveler = null;
var usertrips=[];
var userbookings = [];

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
        type: { type: GraphQLString },
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


const TripsBookingsType = new GraphQLObjectType({
    name: 'TripsBookings',
    fields: () => ({
        id: { type: GraphQLID },
        traveler: { type: GraphQLString },
        owner: { type: GraphQLString },
        guests: { type: GraphQLInt },
        arrive: { type: GraphQLString },
        depart: { type: GraphQLString },
        propertyname : { type: GraphQLString },
        loc : {type : GraphQLString}
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
       /* property: {
            type: PropertyType,
            args: {
                id: { type: GraphQLID },
                destination: { type: GraphQLString },
                arrive: { type: GraphQLString },
                depart: { type: GraphQLString },
                guests: { type: GraphQLInt }
            },
            resolve(parent, args) {
                return _.find(properties, { destination: args.destination, arrive: args.arrive, depart: args.depart, guests: args.guests });
            }
        },*/

        property: {
            type: PropertyType,
            args: {
               
                name: { type: GraphQLString },
                owner : {type : GraphQLString}
            },
            resolve(parent, args) {
              

            var returnProp ={
                name : 'test',
                location : 'test2'
            }
           // selectedProp.toJSON();

            console.log("Property", JSON.stringify(selectedProp));
            console.log("Property -2 ", returnProp);
             return selectedProp;
            
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
           
                console.log("Test", searchresults);
                return searchresults;
            }
        },
        trip: {
            type: TripsBookingsType,
            resolve(parent, args) {
                return trip;
            }
        },
        trips :{
            type: new GraphQLList(TripsBookingsType),
            resolve(parent, args) {
                
             console.log("Trips Query", usertrips);
              return usertrips;
            }
        },
        booking: {
            type: TripsBookingsType,
            resolve(parent, args) {
                return booking;
            }
        },
        bookings :{
            type: new GraphQLList(TripsBookingsType),
            resolve(parent, args) {
                
             console.log("Bookings Query", userbookings);
              return userbookings;
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
                        console.log("result");
                    //     console.log(result);
                        searchresults = result;
                        return result;
                        // callback(null, result);
                    }
                    else {
                        console.log("No Properties");
                    }
                }).then(result => {
                  //  console.log("Search Results", result);
                    return result;
                });

            }

        },
        signup:  {
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
                                console.log("Account Created with username", user.username);
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
                password: { type: GraphQLString },
                
            },
            resolve(parent, args) {
                console.log(args);
                let user = {
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
                                console.log("Validated");
                                
                            } else {
                                console.log("Invalid Information");

                            //  return false;
                                
                            }
                        })
                        
                    }
                    else {
                        console.log("Username Does Not Exist");
                        validated = "N/A";
                    }
                 
                })
              return user; 
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
            

                properties.find({ name: propertyname}, function (err, result) {
                    if (err) {
                        console.log(err);

                    } else if (result) {
                        console.log("Details ", result[0]);
                        selectedProp = result[0];
                    }
                    else {
                        console.log("No Properties");
                    }
                
            })
        }
    },


    

    book: {
        type: TripsBookingsType,
        args: {
            propertyname: { type: GraphQLString },
            arrive: { type: GraphQLString },
            depart: { type: GraphQLString },
            guests: { type: GraphQLString },
            traveler: { type: GraphQLString },
            owner : {type : GraphQLString},
            loc : {type : GraphQLString}
        },
        resolve(parent, args) {
        console.log("Booking")
            console.log(args);
        
                
    var trip =  new trip_booking({
        owner : args.owner,
        traveler : args.user,
        propertyname : args.name,
        loc : args.loc,
        arrive : args.arrive,
        depart : args.depart,
        guests : args.guests,
       // cost_income : args.totalcost
        
    });


    trip.save().then(() => {
        console.log("Property Booked Successfully");
    //    callback(null, true);
      
    }, (err) => {
        console.log(err);
        
    })

        }

    },

    trips_m :{
        type: TripsBookingsType ,
        args: {
            traveler: { type: GraphQLString },
           
        },
        resolve(parent, args){
       // traveler = args.user;
     //     return args;

     trip_booking.find({ traveler: args.traveler}, function (err, result) {
        if (err) {
            console.log(err);

        } else if (result) {
      
         console.log("Result: ", result);
    
        
         usertrips = result;
            return result;
            // callback(null, result);
        }
        else {
            console.log("No Properties");
        }
    })
        }
    },

    bookings_m :{
        type: TripsBookingsType ,
        args: {
            owner: { type: GraphQLString },
           
        },
        resolve(parent, args){
       // traveler = args.user;
     //     return args;

     trip_booking.find({ owner: args.owner}, function (err, result) {
        if (err) {
            console.log(err);

        } else if (result) {
      
         console.log("Result: ", result);
    
        
         userbookings = result;
            return result;
            // callback(null, result);
        }
        else {
            console.log("No Properties");
        }
    })
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