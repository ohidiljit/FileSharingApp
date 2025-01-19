const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const session = require("express-session");

const app = express();

app.set("view engine", "ejs");

// Set the views directory path to the root folder
app.set("views", path.join(__dirname, "../views"));

// Set request timeout to 5 minutes
app.use(function (req, res, next) {
    req.setTimeout(300000); // 5 minutes timeout for requests
    res.setTimeout(300000);
    next();
});

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up express-session for handling user login sessions
app.use(
    session({
        secret: "your_secret_key", // Secret key for signing session ID cookie
        resave: false,
        saveUninitialized: false,
    })
);

// Hardcoded credentials (same for all users)
const username = "admin";
const password = "password123";

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next(); // If logged in, proceed to the requested route
    } else {
        return res.redirect("/login"); // Redirect to login if not logged in
    }
}

app.get("/index.html", (req, res) => {
    // Assuming user is authenticated
    if (req.session.user) {
        res.sendFile(path.join(__dirname, "Client", "index.html")); // Serve index.html from Client folder
    } else {
        res.redirect("/login");
    }
});

// Route to show the login page
app.get("/login", (req, res) => {
    res.render("login"); // Render the login page
});

// Route to handle login form submission
app.post("/login", (req, res) => {
    const { username: enteredUsername, password: enteredPassword } = req.body;

    // Check if credentials match the hardcoded ones
    if (enteredUsername === username && enteredPassword === password) {
        req.session.user = enteredUsername; // Store user in session
        res.redirect("/index.html"); // Redirect to index.html on successful login
    } else {
        res.status(401).send("Invalid credentials");
    }
});

// Redirect root ("/") to the login page
app.get("/", (req, res) => {
    res.redirect("/login");
});

// Serve static files (your front-end)
app.use(express.static(path.join(__dirname, "Client")));

// Set up Multer storage to preserve the original file name
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // The directory where the file will be saved
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Keep the original file name
    },
});

// Initialize Multer with the storage configuration
const upload = multer({ storage: storage });

// Route to view uploaded files
app.get("/view", isAuthenticated, (req, res) => {
    const uploadDir = path.join(__dirname, "uploads");

    // Read the files in the uploads directory
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            return res.status(500).send("Unable to fetch files.");
        }

        // Render the view page, passing the list of files
        res.render("viewfiles", { files });
    });
});

// File upload route
app.post("/upload", upload.single("file"), isAuthenticated, (req, res) => {
    if (req.file) {
        res.status(200).json({ message: "File Uploaded Successfully" });
    } else {
        res.status(400).json({ message: "No file uploaded" });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
