const { ObjectID: ObjectId } = require('mongodb');

module.exports = [
  {
    _id: ObjectId(),
    firstname: 'Joey',
    lastname: 'Gotengco',
    username: 'JoeySalads',
    email: 'StockNameTeam@gmail.com',
    // password: '$2b$10$QvQjZ3czSKZeU1fUZOhve.wgJAeHWKa5MLYqPqXEDwMYsOVlTQIxe',
    password: "Castle12345",
    "s1Q": "What primary school did you attend?",
    "s1A": "Selkirk",
    "s2Q": "What time of the day were you born? (hh:mm)",
    "s2A": "24:24",
    type: 'admin',
    cash2: [10000],
    stocks: [],
    "creation_date": "Mon May 13 2019 10:45:39 GMT-0700 (Pacific Daylight Time)",
    transactions: []
  },
  {
    _id: ObjectId(),
    firstname: 'Jimmy',
    lastname: 'Troung',
    username: 'JimmyT',
    email: 'StockNameTeam@gmail.com',
    // password: '$2b$10$Nr6K/qR0OZq69bAEXNLMDu6xyvzievOoolq1VbrkhBZF4tU8UwFx2',
    password: "Claire",
    "s1Q": "What primary school did you attend?",
    "s1A": "Selkirk",
    "s2Q": "What time of the day were you born? (hh:mm)",
    "s2A": "24:24",
    type: 'standard',
    cash2: [0],
    stocks: [],
    "creation_date": "Mon May 13 2019 10:45:39 GMT-0700 (Pacific Daylight Time)",
    transactions: []
  },
  {
    _id: ObjectId(),
    firstname: 'Alex',
    lastname: 'Cho',
    username: 'AlexC',
    email: 'StockNameTeam@gmail.com',
    // password: '$2b$10$hakTHqY91FIK8ed1H8MXVuhCNrgh9E8iuKdzbkkqp87hY9WI3mCP2',
    password: "LeagueOfLegends",
    "s1Q": "What primary school did you attend?",
    "s1A": "Selkirk",
    "s2Q": "What time of the day were you born? (hh:mm)",
    "s2A": "24:24",
    type: 'standard',
    cash2: [5000],
    stocks: [{ stock_name: "FB", amount: 5, total_cost: 200 }],
    "creation_date": "Mon May 13 2019 10:45:39 GMT-0700 (Pacific Daylight Time)",
    transactions: [{
      "datetime": "Thu May 09 2019 18:50:34 GMT-0700 (Pacific Daylight Time)",
      "stock": "FB",
      "stock_name": "Facebook, Inc.",
      "qty": 5,
      "total_cost": 943.25,
      "type": "B",
      "balance": 8861.28
    }]
  },
  {
    _id: ObjectId(),
    firstname: "tester",
    lastname: "tester",
    username: "tester",
    email: 'StockNameTeam@gmail.com',
    // password: "$2b$10$EJpwPgWhbLTuAfVhUNS5Te/gM/KeE5p/biahXsxm0WEnv/LicNblG",
    password: "tester",
    s1Q: "What were the last four digits of your childhood telephone number?",
    s1A: "tester",
    s2Q: "What is your spouse or partner's mother's maiden name?",
    s2A: "tester",
    type: "standard",
    cash2: [
      10000
    ],
    stocks: [
      {
        "stock_name": "FB",
        "amount": 5,
        "total_cost": 934.95
      }
    ],
    creation_date: "Thu May 16 2019 19:08:43 GMT-0700 (Pacific Daylight Time)",
    transactions: [
      {
        "datetime": "Thu May 16 2019 19:08:50 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_cost": 186.99,
        "type": "B",
        "balance": 9813.01
      },
      {
        "datetime": "Thu May 16 2019 19:08:52 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_cost": 186.99,
        "type": "B",
        "balance": 9626.02
      },
      {
        "datetime": "Thu May 16 2019 19:08:53 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_cost": 186.99,
        "type": "B",
        "balance": 9439.03
      },
      {
        "datetime": "Thu May 16 2019 19:08:53 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_cost": 186.99,
        "type": "B",
        "balance": 9252.04
      },
      {
        "datetime": "Thu May 16 2019 19:08:54 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_cost": 186.99,
        "type": "B",
        "balance": 9065.05
      },
      {
        "datetime": "Thu May 16 2019 19:08:54 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_cost": 186.99,
        "type": "B",
        "balance": 8878.06
      },
      {
        "datetime": "Thu May 16 2019 19:08:55 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_cost": 186.99,
        "type": "B",
        "balance": 8691.07
      },
      {
        "datetime": "Thu May 16 2019 19:08:56 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_cost": 186.99,
        "type": "B",
        "balance": 8504.08
      },
      {
        "datetime": "Thu May 16 2019 19:08:56 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_cost": 186.99,
        "type": "B",
        "balance": 8317.09
      },
      {
        "datetime": "Thu May 16 2019 19:08:57 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_cost": 186.99,
        "type": "B",
        "balance": 8130.1
      },
      {
        "datetime": "Thu May 16 2019 19:08:57 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_cost": 186.99,
        "type": "B",
        "balance": 7943.11
      },
      {
        "datetime": "Thu May 16 2019 19:08:58 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_cost": 186.99,
        "type": "B",
        "balance": 7756.12
      },
      {
        "datetime": "Thu May 16 2019 19:08:58 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_cost": 186.99,
        "type": "B",
        "balance": 7569.13
      },
      {
        "datetime": "Thu May 16 2019 19:08:59 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_cost": 186.99,
        "type": "B",
        "balance": 7382.14
      },
      {
        "datetime": "Thu May 16 2019 19:08:59 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_cost": 186.99,
        "type": "B",
        "balance": 7195.15
      },
      {
        "datetime": "Thu May 16 2019 19:09:00 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_cost": 186.99,
        "type": "B",
        "balance": 7008.16
      },
      {
        "datetime": "Thu May 16 2019 19:09:01 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_cost": 186.99,
        "type": "B",
        "balance": 6821.17
      },
      {
        "datetime": "Thu May 16 2019 19:09:05 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_sale": 186.99,
        "type": "S",
        "balance": 7008.16
      },
      {
        "datetime": "Thu May 16 2019 19:09:12 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_sale": 186.99,
        "type": "S",
        "balance": 7195.15
      },
      {
        "datetime": "Thu May 16 2019 19:09:13 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_sale": 186.99,
        "type": "S",
        "balance": 7382.14
      },
      {
        "datetime": "Thu May 16 2019 19:09:14 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_sale": 186.99,
        "type": "S",
        "balance": 7569.13
      },
      {
        "datetime": "Thu May 16 2019 19:09:14 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_sale": 186.99,
        "type": "S",
        "balance": 7756.12
      },
      {
        "datetime": "Thu May 16 2019 19:09:15 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_sale": 186.99,
        "type": "S",
        "balance": 7943.11
      },
      {
        "datetime": "Thu May 16 2019 19:09:15 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_sale": 186.99,
        "type": "S",
        "balance": 8130.1
      },
      {
        "datetime": "Thu May 16 2019 19:09:16 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_sale": 186.99,
        "type": "S",
        "balance": 8317.09
      },
      {
        "datetime": "Thu May 16 2019 19:09:17 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_sale": 186.99,
        "type": "S",
        "balance": 8504.08
      },
      {
        "datetime": "Thu May 16 2019 19:09:17 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_sale": 186.99,
        "type": "S",
        "balance": 8691.07
      },
      {
        "datetime": "Thu May 16 2019 19:09:18 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_sale": 186.99,
        "type": "S",
        "balance": 8878.06
      },
      {
        "datetime": "Thu May 16 2019 19:09:19 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_sale": 186.99,
        "type": "S",
        "balance": 9065.05
      },
      {
        "datetime": "Thu May 16 2019 19:09:19 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_sale": 186.99,
        "type": "S",
        "balance": 9252.04
      },
      {
        "datetime": "Thu May 16 2019 19:09:20 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_sale": 186.99,
        "type": "S",
        "balance": 9439.03
      },
      {
        "datetime": "Thu May 16 2019 19:09:20 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_sale": 186.99,
        "type": "S",
        "balance": 9626.02
      },
      {
        "datetime": "Thu May 16 2019 19:09:22 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_sale": 186.99,
        "type": "S",
        "balance": 9813.01
      },
      {
        "datetime": "Thu May 16 2019 19:09:22 GMT-0700 (Pacific Daylight Time)",
        "stock": "FB",
        "stock_name": "Facebook, Inc.",
        "qty": 1,
        "total_sale": 186.99,
        "type": "S",
        "balance": 10000
      }
    ]
  }
];