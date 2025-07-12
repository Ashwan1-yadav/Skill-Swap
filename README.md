# Skill Swap

Skill Swap is a web application starter built with Express.js. It provides a foundation for building a platform where users can exchange skills and services. This project currently includes the default Express.js setup and is ready to be extended with custom features.

## Features
- Express.js server
- EJS templating engine
- Static file serving
- Error handling

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v12 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Skill-Swap
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App
Start the development server:
```bash
npm start
```
The app will run on [http://localhost:3000](http://localhost:3000) by default.

## Project Structure
```
Skill-Swap/
├── app.js              # Main application file
├── bin/www             # Entry point for the server
├── routes/             # Route definitions
│   ├── index.js        # Home route
│   └── users.js        # Users route
├── views/              # EJS templates
├── public/             # Static assets (CSS, images, JS)
├── package.json        # Project metadata and dependencies
└── README.md           # Project documentation
```

## License
MIT License

---
Feel free to extend this project with your own features for the Skill Swap platform! 