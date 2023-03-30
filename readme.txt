To run the Qetc-Backend project on a local server, follow these steps:

Clone the repository to your local machine using the git clone command.

Navigate to the project directory using the terminal or command prompt.

Make sure you have Node.js and npm installed on your machine.

Run the following command to install all the required dependencies:

Copy code
npm install
Create a .env file in the project's root directory and add the required environment variables.

Start the development server by running the following command:

Copy code
npm run dev
The server should now be running on http://localhost:8080.
Note: To run the project in production mode, use the "start" script instead of "dev". You can also use the "pm2" script to run the project using the pm2 process manager.