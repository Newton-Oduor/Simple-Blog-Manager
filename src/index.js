// Event listener for DOM to load fully before running JS
document.addEventListener('DOMContentLoaded', main);

// Set base API url for communication with the server
const BASE_URL = 'http://localhost:3000/posts'

// App entry point - main function
function main() {
    displayBlogPosts(); // Display all posts
    addNewBlogPostListener(); // Add and display new posts
}

// Function to fetch blog posts from the server and display their titles on the page.
function displayBlogPosts() {
    fetch(BASE_URL) // Make GET request from the server (http://localhost:3000/blogPosts)
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
            `;
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

        // Add new post to the DOM
        renderPostToList(newPost);

        // Clear form after submission
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