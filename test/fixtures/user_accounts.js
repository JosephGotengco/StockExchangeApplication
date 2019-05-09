const { ObjectID: ObjectId } = require('mongodb');

module.exports = [
  { _id: ObjectId(), firstname: 'Joey', lastname: 'Gotengco', username: 'JoeySalads', password: 'Castle12345', type: 'admin', cash2: [10000], stocks: [], transactions: []},
  { _id: ObjectId(), firstname: 'Jimmy', lastname: 'Troung', username: 'JimmyT', password: 'Claire', type: 'standard', cash2: [0], stocks: [], transactions: []},
  { _id: ObjectId(), firstname: 'Alex', lastname: 'Cho', username: 'AlexC', password: 'LeagueOfLegends', type: 'standard', cash2: [5000], stocks: [{stock_name: "FB", amount: 5}], transactions: []}
];