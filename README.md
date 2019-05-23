# StockExchangeApplication by Team Stock Name 
> Stock exchange application for stock market enthusiasts and data hunters

![Build Status](https://travis-ci.org/JosephGotengco/StockExchangeApplication.svg?branch=master)

## Description
This stock exchange application built up on an existing project. The project's environment was local and used mongoDB to store information. To get stock data, the project used the IEX stock trading API. The current features that existed prior to this project were:
- User login/registration
- Buy, sell, and check prices of stocks

This project was started on April 23, 2019 and finished on May 24, 2019 for classes ACIT 2911 - Agile Development Project. However, members may work on it after course end date for personal reasons. The features we added (in order from start to finish) were:
- A news feed
  - Scrolling text of ten currency or stock prices (users can click a button to swtich between).
- A graph page when they click on the text in the news feed
  - Graph date spans over a year and is taking from IEX trading API
- Passwording salting and hashing
  - We used bycrpt and stored the hashed version in MongoDB
- Administrator table (Interactive)
  - Admins can click on cells and edit information and buttons beside each row (user per row) to delete the user.
- Portfolio page
  - Contains graphs of user data
  - Contains transaction history
  - Basic account information
- Currency Converter
  - Users can switch between 32 different currencies (changes all monetary values on the page + currency symbols)
- Overall, we added more pages and improve aesthetics

## Testing
We made 101 unit tests and we covered 90.32% of the entire project.

## Members
1. Joseph Gotengco - Team Leader/Back-End Developer
2. Sukh Khera - Back End Developer
3. Louis Chen - Front End Developer
4. Krasimir Zarkov - Front End Developer
5. Juna Ka - Front End Developer
6. Matthew Marty - Front End Developer

APIs used:
1. https://exchangeratesapi.io/ - Currency Data
2. https://iexcloud.io/ - Stock Data
