const { ObjectID: ObjectId } = require('mongodb');

module.exports = [
  {
    _id: ObjectId(), 
    firstname: 'Joey', 
    lastname: 'Gotengco', 
    username: 'JoeySalads', 
    password: '$2b$10$QvQjZ3czSKZeU1fUZOhve.wgJAeHWKa5MLYqPqXEDwMYsOVlTQIxe', 
    "s1Q": "What primary school did you attend?",
    "s1A": "Selkirk",
    "s2Q": "What time of the day were you born? (hh:mm)",
    "s2A": "24:24", 
    type: 'admin', 
    cash2: [10000], 
    stocks: [],
    "creation_date" : "Mon May 13 2019 10:45:39 GMT-0700 (Pacific Daylight Time)",
    transactions: []
  },
  {
    _id: ObjectId(), 
    firstname: 'Jimmy', 
    lastname: 'Troung', 
    username: 'JimmyT', 
    password: '$2b$10$Nr6K/qR0OZq69bAEXNLMDu6xyvzievOoolq1VbrkhBZF4tU8UwFx2', 
    "s1Q": "What primary school did you attend?",
    "s1A": "Selkirk",
    "s2Q": "What time of the day were you born? (hh:mm)",
    "s2A": "24:24", 
    type: 'standard', 
    cash2: [0], 
    stocks: [],
    "creation_date" : "Mon May 13 2019 10:45:39 GMT-0700 (Pacific Daylight Time)",
    transactions: []
  },
  {
    _id: ObjectId(), 
    firstname: 'Alex', 
    lastname: 'Cho', 
    username: 'AlexC', 
    password: '$2b$10$hakTHqY91FIK8ed1H8MXVuhCNrgh9E8iuKdzbkkqp87hY9WI3mCP2', 
    "s1Q": "What primary school did you attend?",
    "s1A": "Selkirk",
    "s2Q": "What time of the day were you born? (hh:mm)",
    "s2A": "24:24", 
    type: 'standard', 
    cash2: [5000], 
    stocks: [{ stock_name: "FB", amount: 5, total_cost: 200 }],
    "creation_date" : "Mon May 13 2019 10:45:39 GMT-0700 (Pacific Daylight Time)",
    transactions: [{
      "datetime": "Thu May 09 2019 18:50:34 GMT-0700 (Pacific Daylight Time)",
      "stock": "FB",
      "stock_name": "Facebook, Inc.",
      "qty": 5,
      "total_cost": 943.25,
      "type": "B",
      "balance": 8861.28
    }]
  }
];