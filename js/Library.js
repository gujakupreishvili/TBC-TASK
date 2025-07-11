class Library {
  constructor() {
    this.books = [];
    this.users = [];
  }

  findUser(userName) {
    return this.users.find(u => u.name === userName);
  }

  findBook(bookId) {
    return this.books.find(b => b.id === bookId);
  }

  addBook(book) {
    const newBook = {
      ...book,
      available: true,
      borrowCount: 0
    };
    this.books.push(newBook);
    console.log(` Book "${book.title}" added to the library.`);
  }

  addUser(user) {
    const newUser = {
      ...user,
      borrowedBooks: [],
      penaltyPoints: 0
    };
    this.users.push(newUser);
    console.log(` User "${user.name}" added to the system.`);
  }

  borrowBook(userName, bookId) {
    const user = this.findUser(userName);
    const book = this.findBook(bookId);

    if (!user || !book || !book.available) {
      console.log(" Cannot borrow: invalid user or book is unavailable.");
      return;
    }

    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(borrowDate.getDate() + 14);

    book.available = false;
    book.borrowCount++;

    user.borrowedBooks.push({ bookId, borrowDate, dueDate });
    console.log(` ${userName} borrowed "${book.title}" until ${dueDate.toDateString()}`);
  }

  returnBook(userName, bookId) {
    const user = this.findUser(userName);
    const book = this.findBook(bookId);
    if (!user || !book) return;

    const borrowEntry = user.borrowedBooks.find(b => b.bookId === bookId);
    if (!borrowEntry) {
      console.log(" User did not borrow this book.");
      return;
    }

    const now = new Date();
    if (now > borrowEntry.dueDate) {
      const daysLate = Math.ceil((now - borrowEntry.dueDate) / (1000 * 60 * 60 * 24));
      user.penaltyPoints += daysLate;
      console.log(` Book returned late. ${daysLate} penalty point(s) added.`);
    } else {
      console.log(" Thank you for returning the book on time!");
    }

    book.available = true;
    user.borrowedBooks = user.borrowedBooks.filter(b => b.bookId !== bookId);
  }

  searchBooksBy(param, value) {
    if (param === 'rating') return this.books.filter(book => book.rating >= value);
    if (param === 'yearBefore') return this.books.filter(book => book.year < value);
    if (param === 'yearAfter') return this.books.filter(book => book.year > value);
    return this.books.filter(book => book[param] === value);
  }

  getTopRatedBooks(limit) {
    return [...this.books].sort((a, b) => b.rating - a.rating).slice(0, limit);
  }

  getMostPopularBooks(limit) {
    return [...this.books].sort((a, b) => b.borrowCount - a.borrowCount).slice(0, limit);
  }

  checkOverdueUsers() {
    const now = new Date();
    const overdueList = [];

    this.users.forEach(user => {
      user.borrowedBooks.forEach(borrowed => {
        if (now > borrowed.dueDate) {
          const daysOverdue = Math.ceil((now - borrowed.dueDate) / (1000 * 60 * 60 * 24));
          overdueList.push({ user: user.name, bookId: borrowed.bookId, daysOverdue });
        }
      });
    });

    return overdueList;
  }

  recommendBooks(userName) {
    const user = this.findUser(userName);
    if (!user) return [];

    const borrowedGenres = user.borrowedBooks
      .map(b => this.findBook(b.bookId)?.genre)
      .filter(Boolean);

    const borrowedIds = user.borrowedBooks.map(b => b.bookId);
    const preferredGenres = [...new Set(borrowedGenres)];

    return this.books
      .filter(book => preferredGenres.includes(book.genre) && !borrowedIds.includes(book.id))
      .sort((a, b) => b.rating - a.rating);
  }

  removeBook(bookId) {
    const book = this.findBook(bookId);
    if (!book || !book.available) {
      console.log(" Cannot remove book. Either it does not exist or is currently borrowed.");
      return;
    }
    this.books = this.books.filter(b => b.id !== bookId);
    console.log(` Book "${book.title}" removed from the library.`);
  }

  printUserSummary(userName) {
    const user = this.findUser(userName);
    if (!user) {
      console.log(" User not found.");
      return;
    }

    console.log(`📄 Summary for ${user.name}:`);
    user.borrowedBooks.forEach(borrowed => {
      const book = this.findBook(borrowed.bookId);
      const now = new Date();
      const isOverdue = now > borrowed.dueDate;
      const overdueMsg = isOverdue
        ? ` (Overdue by ${Math.ceil((now - borrowed.dueDate) / (1000 * 60 * 60 * 24))} day(s))`
        : "";
      console.log(`- ${book.title} | Due: ${borrowed.dueDate.toDateString()}${overdueMsg}`);
    });

    console.log(`Penalty Points: ${user.penaltyPoints}`);
  }
}
module.exports = Library;
