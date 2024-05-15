## Overview
I have implemented a simple HTTP server using Node.js to handle CRUD operations for a collection of blog posts. The blog posts are stored in a JSON file (blog-posts.json). 

## Key Components
### Modules and Constants:

* http: Module to create an HTTP server.
* fs: Module to interact with the file system.
* url: Module to parse URLs.
* PORT: The port number where the server listens.
* DATA_FILE: The JSON file that stores the blog posts data.

### Loading Initial Data:

Reads blog posts from the JSON file and parses it into an array (blogPosts).
Generating Unique IDs:

* A function (generateId) to generate a new unique ID for each blog post.

### Handling HTTP Responses:

A helper function (handleResponse) to send HTTP responses with a specified status code and data.

### Request Handler:

The main function (requestHandler) that handles incoming HTTP requests based on their method (GET, POST, PUT, PATCH, DELETE) and URL path.

## CRUD Operations

### GET Requests:

* /blog-posts: Retrieves all blog posts.
* /blog-posts/:id: Retrieves a single blog post by its ID.

### POST Request:

* /blog-posts: This creates a new blog post. Reads the request body, generates a new ID, adds the post to the array, and writes the updated array back to the JSON file.

### PUT Request:

* /blog-posts/:id: This updates an existing blog post entirely. Reads the request body, updates the post with the given ID, and writes the updated array back to the JSON file.

### PATCH Request:

* /blog-posts/:id: This partially updates an existing blog post. Merges the request body with the existing post data and writes the updated array back to the JSON file.

### DELETE Request:

* /blog-posts/:id: This deletes a blog post by its ID and writes the updated array back to the JSON file.

## Detailed Explanation of CRUD Helper Functions

* getAllPosts: Sends all blog posts as a response.
* getPostById: Finds a post by ID and sends it as a response. If not found, responds with a 404 status.
* createPost: Reads the request body, creates a new post with a unique ID, and appends it to the blogPosts array.
* updatePost: Reads the request body, replaces the entire post with the specified ID, and updates the JSON file.
* patchPost: Reads the request body, updates only the specified fields of the post with the specified ID, and updates the JSON file.
* deletePost: Removes the post with the specified ID from the array and updates the JSON file.

## Running the Server
The server is created using http.createServer(requestHandler) and listens on the specified PORT. 


