# Purchase Order Demo Application
### Feature Scoping and Estimation
- Frontend
    - Project Setup - 1hrs
    - Form Creation with Validations - 2hrs
- Backend
    - Endpoint Setup and File Manage - 3hrs 
-----

### Tools and Technologies Used
The project is built using the following technologies:

- Next.js: A React framework that enables features like server-side rendering and generating static websites for React-based web applications.
- React.js: A JavaScript library for building user interfaces, primarily for single-page applications.
- SQLite: An in-process library that implements a self-contained, serverless, zero-configuration, transactional SQL database engine.
- Prisma: An open-source database toolkit that makes it easy to reason about your data and how you access it, by providing an elegant API for your SQLite database.
- Zod: A library for creating, checking, and refining data types in JavaScript.
- Multer: A middleware for handling multipart/form-data, primarily used for uploading files.
- Fast-CSV: A library for parsing and formatting CSVs or any other delimited-value files.

This application is designed to keep the setup minimal and requires minimal configurations. We are storing files locally, as opposed to uploading them to a service like AWS S3. This makes the application simpler to set up and run locally.

In terms of data handling, the application takes in a CSV file, parses it, and stores the data in a SQLite database. We use SQLite because it is serverless, zero-configuration and easy to use, which fits our use case perfectly. We store the path to the uploaded CSV files relative to the project root directory in the database for future reference.

### Installation and Setup
Follow these steps to get the project up and running on your local machine:

1. Clone the repository: Start by cloning the repository to your local machine using the following command in your terminal:
`git clone https://github.com/jeansampen/purchase-order-demo-app`

2. Install the dependencies: Navigate into the project directory and install all the necessary dependencies:
`cd purchase-demo-app`

3. This command will also run the postinstall script to generate the Prisma client. (Assuming basic installtions system already have, like npm, and then node, next etc.)
`npm install`

4. Run the development server: You can start the development server using the following command:
`npm run dev`
Now, the application should be running on http://localhost:3000.

### Data Organization
The application utilizes a relational SQLite database to store the data. This database contains two primary tables:

1. Purchase Orders Table: This table stores information related to each purchase order. Each order has a unique identifier, the vendor's name, the date of the purchase, and a reference to the uploaded CSV file (stored as the relative path to the file from the project root).

2. Items Table: This table stores details about the individual items in each purchase order. Each item has a unique identifier, a model number, a unit price, a quantity, and a reference to the purchase order it belongs to.

These two tables are connected via a one-to-many relationship. Each purchase order can contain multiple items, but each item can belong to only one purchase order.

Here's why we chose this organization method:

- Efficient querying: This structure allows us to query all items for a specific purchase order efficiently. Also, we can obtain all the details of a purchase order, including the associated items, in a single database query.
- Data integrity: The use of unique identifiers for both purchase orders and items ensures data integrity across the database. Also, by storing the reference to the CSV file, we can always access the original data, if needed.
- Scalability: This structure is scalable. Even if the number of purchase orders or items increases, we can still handle the data efficiently.

### Usage
Once you've started the application, you can interact with it in the browser. You can upload CSV files and the application will parse them and store the data in a SQLite database.

### Contribution
This project is currently a demo application, but contributions are always welcome. Please fork the repository and make changes as you'd like. Pull requests are also welcomed.
