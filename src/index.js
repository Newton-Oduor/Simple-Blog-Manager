// Event listener for DOM to load fully before running JS
document.addEventListener('DOMContentLoaded', main);

// Set base API url for communication with the server
const BASE_URL = 'http://localhost:3000/posts'

// App entry point - main function
function main() {
    displayBlogPosts(); // Display all posts
    addNewBlogPostListener(); // Add and display new posts
    loadFirstPostDetails(); // Displays first post as soonas page loads
}

// Function to fetch blog posts from the server and display their titles on the page.
function displayBlogPosts() {
    fetch(BASE_URL) // Make GET request from the server (http://localhost:3000/posts)
    .then(response => response.json()) // Convert response to JSON
    .then(posts => {
            const postList = document.getElementById('post-list'); // Get the post list container (where the post titles will be displayed &)
            postList.innerHTML = ''; // clear out any existing content before adding new posts.
            
                        posts.forEach(post => {
                // Create a new div for each post title
                const postDiv = document.createElement('div');
                postDiv.textContent = post.title; // Display the title
                postDiv.dataset.id = post.id;  // Save the post's unique ID   
                postDiv.classList.add('post-title'); // Make it look clickable (Added class for styling)

                // Add click event listener to each title
                postDiv.addEventListener('click', showPostDetails);

                // Append the post title div into the post list container
                postList.appendChild(postDiv);
            });
        });
}

// Load and show details of the post title when user clicks
function showPostDetails(event) {
    const postId = event.target.dataset.id; // Get the unique post ID that was clicked
    displayPostContent(postId);                  // Call function to load post details
}

// Function to fetch and show full details of one post (by unique ID)
function displayPostContent(id) {
    fetch(`${BASE_URL}/${id}`) // GET request to fetch single post by unique ID
        .then(response => response.json())
        .then(post => {
            const detailDiv = document.getElementById('post-detail'); // Get detail container

            // Update the container with full post details (title, image, content, author)
            detailDiv.innerHTML = `
                <h2>${post.title}</h2>
                <img src="${post.image}" alt="${post.title}" width="150">
                <p>${post.content}</p>
                <p><strong>Author:</strong> ${post.author}</p>
                <button id="edit-btn">Edit</button>
                <button id="delete-btn">Delete</button>
            `;

            // Edit & delete button listener
            document.getElementById('edit-btn').addEventListener('click', () => showEditForm(post));

            document.getElementById('delete-btn').addEventListener('click', () => deletePost(post.id));
        });
}

// Show the edit form and fill it with existing post data
function showEditForm(post) {
    const form = document.getElementById('edit-post-form');
    form.classList.remove('hidden');

    document.getElementById('edit-title').value = post.title;
    document.getElementById('edit-content').value = post.content;

    form.onsubmit = function(event) {
        event.preventDefault();
        const updatedPost = {
            title: document.getElementById('edit-title').value,
            content: document.getElementById('edit-content').value
        };
        updatePost(post.id, updatedPost);
        form.classList.add('hidden');
    };

    document.getElementById('cancel-edit').onclick = function() {
        form.classList.add('hidden');
    };
}

// PATCH request to server to update post
function updatePost(id, updatedData) {
    fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(() => {
        displayBlogPosts();
        displayPostContent(id);
    });
}

// Set up listener for new post form submission
function addNewBlogPostListener() {
    const form = document.getElementById('new-blog-post-form');

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form reload behavior

        // Create a new post object from form input values
        const newPost = {
            title: form.title.value,
            author: form.author.value,
            content: form.content.value,
            image: 'https://c7.alamy.com/comp/RGH3WX/new-blog-post-sign-on-a-wooden-desk-with-a-stylish-living-room-on-a-blurry-background-RGH3WX.jpg' // image link for new posts
        };

    // Save new post to server
    fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
    })
    .then(response => response.json())
    .then(savedPost => {
        renderPostToList(savedPost);  
    });

    form.reset();
    });
}

// Add the new post to the post list in the DOM (without refreshing page)
function renderPostToList(post) {
    const postList = document.getElementById('post-list');

    const postDiv = document.createElement('div');
    postDiv.textContent = post.title;
    postDiv.classList.add('post-title');
    postDiv.dataset.id = post.id || 'new'; // If no id, mark as 'new'

    postDiv.addEventListener('click', showPostDetails); // Attach click listener

    postList.prepend(postDiv);
}

// Show details of the first post when the page loads
function loadFirstPostDetails() {
    fetch(BASE_URL)
        .then(response => response.json())
        .then(posts => {
            if (posts.length > 0) {
                displayPostContent(posts[0].id);  // Show first post's details
            }
        });
}

// Delete feature
function deletePost(id) {
    fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        displayBlogPosts();
        document.getElementById('post-detail').innerHTML = '<p>Post deleted.</p>';
    });
}