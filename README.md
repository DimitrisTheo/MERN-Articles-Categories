# 																							Documentation

### 																*This doc contains general information about the implementation of this app.*

The project structure contains two main folders, one named ***server*** , containing the backend files and one ***client*** , containing the frontend files.

**Client** folder is imported as a **submodule** because the frontend app is a different git repository.

Git clone repository to download the whole project files with: **git clone --recurse-submodules <url>**.

## Backend

I started the implementation of the app from the backend and I tested the endpoints of the server as I created them using **Postman**.

To start the server app, **cd into server** folder, run `npm install` to install the dependencies and then run `npm run dev`. 

After that, create a .env file to set up the 2 main global variables of the app. You can use the variable values contained in **example.env** file to make the app work as it already has a database url with a temporary user's credentials to connect to the database.

I used **Node** along with: **Express, Joi** to validate incoming requests and **dotenv** to use .env file.

For the database, I used a public **MongoDB** instance from mlab as suggested and **Mongoose** for the queries throughout the app.

The starting file of the app is **server.js** where the connection to the db is made, the main routes are included and the node app starts listening to the Port specified and receiving requests.

The **models folder** contains 2 files with the mongoose schemas for articles and categories.

The **routes folder** contains also 2 files with the implementation of each route for articles and categories respectively.



## Frontend

To start the frontend app, **cd into client** folder, run `npm install` to install the dependencies and then run `npm start`. 

I used **React** along with **Material UI** library to implement it.

Also I used the packages: **react-router-dom**  for routing inside the app and **axios** for http requests.

The client app starts from **index.js** file in **src** folder. Also the app contains:

- **components** folder with a **Navbar** file that has a basic navbar implementation for the app
- **api** folder with a file containing all the **api routes** that are being used within the client app
- **app** folder containing the "main" file
- and **pages** folder with the files containing the content rendering in each page