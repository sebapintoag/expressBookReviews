const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');

const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(201).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(422).json({ message: "User already exists!" });
    }
  } else if (!username) {
    return res.status(422).json({ message: "Username not provided" });
  } else if (!password) {
    return res.status(422).json({ message: "Password not provided" });
  }
  return res.status(422).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Get the book list available in the shop using ASYNC/AWAIT with Axios
public_users.get('/async', async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5002/");
    const books = response.data;
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json(error);
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  return res.status(200).json(books[req.params.isbn]);
});

// Get book details based on ISBN using ASYNC/AWAIT with Axios
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5002/isbn/" + req.params.isbn);
    const books = response.data;
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json(error);
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const booksArray = Object.values(books)
  const booksResult = booksArray.filter((book) => {
    return book.author === req.params.author
  })
  return res.status(200).json(booksResult);
});

// Get book details based on author using ASYNC/AWAIT with Axios
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5002/author/" + req.params.author);
    const data = response.data;
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const booksArray = Object.values(books)
  const booksResult = booksArray.filter((book) => {
    return book.title === req.params.title
  })
  return res.status(200).json(booksResult);
});

// Get all books based on title using ASYNC/AWAIT with Axios
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5002/title/" + req.params.title);
    const data = response.data;
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const book = books[req.params.isbn]
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
