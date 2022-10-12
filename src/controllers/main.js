const bcryptjs = require("bcryptjs");
const { Sequelize } = require("../database/models");
const db = require("../database/models");
const Op = Sequelize.Op

const mainController = {
  home: (req, res) => {
    db.Book.findAll({
      include: [{ association: "authors" }],
    })
      .then((books) => {
        res.render("home", { books });
      })
      .catch((error) => console.log(error));
  },
  bookDetail: (req, res) => {
    let idReference = req.params.id;
    db.Book.findByPk(idReference, {
      include: [ {association: 'authors'} ]
    })
      .then((book) => {
        res.render("bookDetail", { book});
    })
      .catch((error) => console.log(error));
  },
  bookSearch: (req, res) => {
    res.render("search", { books: [] });
  },
  bookSearchResult: (req, res) => {
    let keyword = req.body.title
    console.log(keyword)
    if (keyword.length == 0) {
      res.render("search", { books: [] });
    }
    db.Book.findAll({
      include: [{ association: "authors" }],
      where: {
        title: {
          [Op.like]: `%${keyword}%`
        }
      }
    })
      .then((books) => {
        res.render("search", { books });
      })
      .catch((error) => console.log(error));
  },
  deleteBook: (req, res) => {
    // Implement delete book
    res.render("home");
  },
  authors: (req, res) => {
    db.Author.findAll()
      .then((authors) => {
        res.render("authors", { authors });
      })
      .catch((error) => console.log(error));
  },
  authorBooks: (req, res) => {
    db.Author.findAll({
      include: [{ association: "books" }],
      where: {
        id: req.params.id
      }
    })
    .then((authorBooks) => {
      res.render("authorBooks", { books: authorBooks[0].books });
    })
    .catch((error) => console.log(error));
  },
  register: (req, res) => {
    res.render("register");
  },
  processRegister: (req, res) => {
    db.User.create({
      Name: req.body.name,
      Email: req.body.email,
      Country: req.body.country,
      Pass: bcryptjs.hashSync(req.body.password, 10),
      CategoryId: req.body.category,
    })
      .then(() => {
        res.redirect("/");
      })
      .catch((error) => console.log(error));
  },
  login: (req, res) => {
    // Implement login process
    res.render("login");
  },
  processLogin: (req, res) => {
    // Implement login process
    res.render("home");
  },
  edit: (req, res) => {
    let idReference = req.params.id
    db.Book.findByPk(idReference)
      .then( book =>{
        res.render("editBook", { book });
      } )
  },
  processEdit: (req, res) => {
    const { title, cover, description }= req.body
    
    let editedBook = {
      title,
      cover,
      description
    };

    db.Book.update(editedBook,{
      where: {
        id: req.params.id
      }
    });

    db.Book.findAll({
      include: [{ association: "authors" }],
    })
      .then((books) => {
        res.render("home", { books });
      })
      .catch((error) => console.log(error));    
  },
};

module.exports = mainController;
