const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/registersssssssssssss", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    
    if (!username) {
        return res.status(404).json({message: "User not provided"});
    }else{
        return res.status(404).json({message: "Password not provided"});

    }
    

});

public_users.get('/', async function (req, res) {
    const getBookList = () => {
        return new Promise((resolve, reject) => {
            resolve(books);
        });
    };

    try {
        const bookList = await getBookList();
        res.send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error retrieving book list" });
    }
});

// Get the book list available in the shop
//public_users.get('/',function (req, res) {
//    res.send(JSON.stringify(books,null,4));
//});

// Get book details based on ISBN
//public_users.get('/isbn/:isbn',function (req, res) {
//    let isbn = req.params.isbn;
//    if(isbn){
//        return res.send(books[isbn]);
//    }else{
//        return res.status(404).json({message: "Not isbn inserted"})
//    }
    //console.log("isbn")
    //let booksfound = books.filter((book)=> book.isbn === isbn);
 //});

public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    const getBookByISBN = () => {
        return new Promise((resolve, reject) => {
            const book = books[isbn];
            if (book) {
                resolve(book);
            } else {
                reject("Book not found for ISBN " + isbn);
            }
        });
    };

    getBookByISBN()
        .then((book) => {
            res.send(JSON.stringify(book, null, 4));
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let booksfound = Object.values(books).filter((book)=> book.author === author);
    res.send(booksfound);
});

// Get all books based on title
//public_users.get('/title/:title',function (req, res) {
 //   const title = req.params.title;
 //   let booksfound = Object.values(books).filter((book)=> book.title === title);
//    res.send(booksfound);
//});

public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    const getBooksByTitle = () => {
        return new Promise((resolve, reject) => {
            const booksfound = Object.values(books).filter((book) => book.title === title);
            if (booksfound.length > 0) {
                resolve(booksfound);
            } else {
                reject("No books found with title " + title);
            }
        });
    };

    getBooksByTitle()
        .then((booksfound) => {
            res.send(JSON.stringify(booksfound, null, 4));
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    const review = books[isbn].reviews;
    console.log(review)
    res.send(review);
});

module.exports.general = public_users;
