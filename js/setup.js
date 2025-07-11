const Library = require('./Library');

function initializeLibrary() {
  const library = new Library();

  library.addUser({ name: "Alice" });
  library.addUser({ name: "Bob" });

  library.addBook({ id: 1, title: "1984", author: "Orwell", genre: "Dystopian", rating: 4.8, year: 1949 });
  library.addBook({ id: 2, title: "The Hobbit", author: "Tolkien", genre: "Fantasy", rating: 4.9, year: 1937 });
  library.addBook({ id: 3, title: "Clean Code", author: "Martin", genre: "Programming", rating: 4.7, year: 2008 });
  library.addBook({ id: 4, title: "Brave New World", author: "Huxley", genre: "Dystopian", rating: 4.5, year: 1932 });

  library.borrowBook("Alice", 1);
  library.borrowBook("Alice", 2);
  library.borrowBook("Bob", 4);

  const user = library.findUser("Alice");
  user.borrowedBooks[0].dueDate.setDate(user.borrowedBooks[0].dueDate.getDate() - 15);
  library.returnBook("Alice", 1);

  console.log(" Recommendations for Alice:", library.recommendBooks("Alice"));
  console.log(" Overdue users:", library.checkOverdueUsers());
  console.log(" Dystopian books:", library.searchBooksBy("genre", "Dystopian"));
  console.log(" Books rated >= 4.7:", library.searchBooksBy("rating", 4.7));
  console.log(" Books before 1950:", library.searchBooksBy("yearBefore", 1950));
  console.log(" Top Rated Books:", library.getTopRatedBooks(2));
  console.log(" Most Popular Books:", library.getMostPopularBooks(2));

  library.printUserSummary("Alice");

  library.removeBook(3);
  library.removeBook(2);
  return library;
}

module.exports = initializeLibrary;
