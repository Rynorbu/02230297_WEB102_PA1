const http = require("http");
const fs = require("fs");
const url = require("url");

const PORT = 9999;
const DATA_FILE = 'blog-posts.json';

// Load blog posts from JSON file
let blogPosts = [];
try {
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  blogPosts = JSON.parse(data);
} catch (err) {
  console.error('Error reading blog posts:', err);
}

// Generate a unique ID for new blog posts
function generateId() {
  return blogPosts.length > 0 ? Math.max(...blogPosts.map(post => post.id)) + 1 : 1;
}

// Send HTTP response
function handleResponse(res, statusCode, data, contentType = 'application/json') {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', contentType);
  res.end(JSON.stringify(data));
}

// Handle HTTP requests
function requestHandler(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  if (method === "GET" && path === "/blog-posts") {
    getAllPosts(res);
  } else if (method === "GET" && path.startsWith("/blog-posts/")) {
    const id = parseInt(path.split('/')[2]);
    getPostById(res, id);
  } else if (method === "POST" && path === "/blog-posts") {
    createPost(req, res);
  } else if (method === "PUT" && path.startsWith("/blog-posts/")) {
    const id = parseInt(path.split('/')[2]);
    updatePost(req, res, id);
  } else if (method === "PATCH" && path.startsWith("/blog-posts/")) {
    const id = parseInt(path.split('/')[2]);
    patchPost(req, res, id);
  } else if (method === "DELETE" && path.startsWith("/blog-posts/")) {
    const id = parseInt(path.split('/')[2]);
    deletePost(res, id);
  } else {
    handleResponse(res, 404, 'Not found');
  }
}

// CRUD operation handlers
function getAllPosts(res) {
  try {
    handleResponse(res, 200, blogPosts);
  } catch (err) {
    console.error('Error getting all posts:', err);
    handleResponse(res, 500, 'Internal Server Error');
  }
}

function getPostById(res, id) {
  try {
    const post = blogPosts.find(p => p.id === id);
    if (post) {
      handleResponse(res, 200, post);
    } else {
      handleResponse(res, 404, 'Blog post not found');
    }
  } catch (err) {
    console.error('Error getting post by ID:', err);
    handleResponse(res, 500, 'Internal Server Error');
  }
}

function createPost(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', () => {
    try {
      const newPost = { id: generateId(), ...JSON.parse(body) };
      blogPosts.push(newPost);
      fs.writeFileSync(DATA_FILE, JSON.stringify(blogPosts, null, 2));
      handleResponse(res, 201, { message: 'Blog post created', post: newPost });
    } catch (err) {
      console.error('Error creating blog post:', err);
      handleResponse(res, 500, 'Internal Server Error');
    }
  });
}

function updatePost(req, res, id) {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', () => {
    try {
      const updatedPost = { id, ...JSON.parse(body) };
      const index = blogPosts.findIndex(p => p.id === id);
      if (index !== -1) {
        blogPosts[index] = updatedPost;
        fs.writeFileSync(DATA_FILE, JSON.stringify(blogPosts, null, 2));
        handleResponse(res, 200, { message: 'Blog post updated', post: updatedPost });
      } else {
        handleResponse(res, 404, 'Blog post not found');
      }
    } catch (err) {
      console.error('Error updating blog post:', err);
      handleResponse(res, 500, 'Internal Server Error');
    }
  });
}

function patchPost(req, res, id) {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', () => {
    try {
      const partialUpdate = JSON.parse(body);
      const index = blogPosts.findIndex(p => p.id === id);
      if (index !== -1) {
        const updatedPost = { ...blogPosts[index], ...partialUpdate };
        blogPosts[index] = updatedPost;
        fs.writeFileSync(DATA_FILE, JSON.stringify(blogPosts, null, 2));
        handleResponse(res, 200, { message: 'Blog post patched', post: updatedPost });
      } else {
        handleResponse(res, 404, 'Blog post not found');
      }
    } catch (err) {
      console.error('Error patching blog post:', err);
      handleResponse(res, 500, 'Internal Server Error');
    }
  });
}

function deletePost(res, id) {
  try {
    const index = blogPosts.findIndex(p => p.id === id);
    if (index !== -1) {
      const deletedPost = blogPosts.splice(index, 1)[0];
      fs.writeFileSync(DATA_FILE, JSON.stringify(blogPosts, null, 2));
      handleResponse(res, 200, { message: 'Blog post deleted', post: deletedPost });
    } else {
      handleResponse(res, 404, 'Blog post not found');
    }
  } catch (err) {
    console.error('Error deleting blog post:', err);
    handleResponse(res, 500, 'Internal Server Error');
  }
}

// Create and start the server
const server = http.createServer(requestHandler);
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
