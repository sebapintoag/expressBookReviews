const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password)=>{ //returns boolean
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send({message: "User successfully logged in"});
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  if (!isbn) {
    return res.status(404).json({message: "Book not found"});
  }

  let book = books[req.params.isbn]
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }

  const username = req.session.authorization.username

  book.reviews[username] = req.body.review

  books[isbn] = book

  return res.status(200).json({review: books[isbn].reviews[username], username: username});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  if (!isbn) {
    return res.status(404).json({message: "Book not found"});
  }

  let book = books[req.params.isbn]
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }

  const username = req.session.authorization.username

  delete book.reviews[username]

  return res.status(200).json(book.reviews);
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
