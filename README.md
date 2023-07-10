# User Authentication and Secrets App

<img width="1440" alt="Screenshot 2023-06-19 at 2 01 48 PM" src="https://github.com/0xJeu/test-remote/assets/129988927/557cef09-8477-4dc7-bada-1bb15c872f49">

This Node.js code creates a web application for user authentication and sharing secrets. It utilizes the Express framework, EJS templating engine, Mongoose for database interaction, and Passport for authentication with local and Google strategies.

## How It Works

- The code requires the necessary modules, configures the application, and sets up middleware.

- It establishes a connection to a MongoDB database using Mongoose.

- A user schema is defined to store user-related information such as email, password, and Google ID.

- Passport middleware is set up to handle authentication, including serialization and deserialization of users.

- The code defines routes for various application endpoints, such as home, login, registration, secrets, authentication with Google, and submission of secrets.

- It utilizes Passport and GoogleStrategy to handle authentication using Google OAuth 2.0.

- The application allows users to register, log in, log out, submit secrets, and view shared secrets from other users.

## How to Use

To use this code, follow these steps:

1. Make sure you have Node.js and MongoDB installed on your system.

2. Create a new directory for your project and navigate to it in a terminal or command prompt.

3. Create a new file (e.g., `app.js`) and copy the provided code into it.

4. Install the necessary dependencies by running the command: `npm install express ejs body-parser mongoose express-session passport passport-local-mongoose passport-google-oauth20 mongoose-findorcreate dotenv`.

5. Create a `.env` file in the project directory and define the environment variables `CLIENT_ID` and `CLIENT_SECRET` with the corresponding values from your Google Cloud project.

6. Run the application using the command: `node app.js`.

7. Access the application in your web browser at `http://localhost:3000`.

8. You can register as a new user, log in with your credentials or with your Google account, submit secrets, and view shared secrets.

9. When finished, you can terminate the application by pressing Ctrl+C in the terminal or command prompt.

## Acknowledgments

This code demonstrates the implementation of a user authentication and secrets sharing application using Node.js, Express, EJS, MongoDB, and Passport. Feel free to modify and customize it according to your preferences and requirements.
