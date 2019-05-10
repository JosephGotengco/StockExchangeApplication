const { ObjectID: ObjectId } = require('mongodb');

module.exports = [
  { _id: ObjectId(), firstname: 'Joey', lastname: 'Gotengco', username: 'JoeySalads', password: '$2b$10$QvQjZ3czSKZeU1fUZOhve.wgJAeHWKa5MLYqPqXEDwMYsOVlTQIxe', type: 'admin', cash2: [10000], stocks: [], transactions: []},
  { _id: ObjectId(), firstname: 'Jimmy', lastname: 'Troung', username: 'JimmyT', password: '$2b$10$Nr6K/qR0OZq69bAEXNLMDu6xyvzievOoolq1VbrkhBZF4tU8UwFx2', type: 'standard', cash2: [0], stocks: [], transactions: []},
  { _id: ObjectId(), firstname: 'Alex', lastname: 'Cho', username: 'AlexC', password: '$2b$10$hakTHqY91FIK8ed1H8MXVuhCNrgh9E8iuKdzbkkqp87hY9WI3mCP2', type: 'standard', cash2: [5000], stocks: [{stock_name: "FB", amount: 5, total_cost: 200}], transactions: [        {
    "datetime" : "Thu May 09 2019 18:50:34 GMT-0700 (Pacific Daylight Time)",
    "stock" : "FB",
    "stock_name" : "Facebook, Inc.",
    "qty" : 5,
    "total_cost" : 943.25,
    "type" : "B",
    "balance" : 8861.28
}]}
];