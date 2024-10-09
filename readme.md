# Project Documentation

## Table of Contents

1. [Data Selection](#data-selection)
2. [Data Processing](#data-processing)
3. [Data Implementation](#data-implementation)
4. [Backend Development](#backend-development)
5. [Frontend Interface](#frontend-interface)
6. [Project Documentation](#project-documentation)

---

## Get Started

### Prerequisite

You must fulfil the following requirements before running this project:

- **`Python`** - v3.0 or above

### Project Setup
1. **Install Dependencies**:
    
    Make sure you have Python installed before running this command:
    ```bash
    pip install -r requirements.txt
    ``` 

    Wait until all the installations are complete.

2. **Run the application:**

    Use the following command to run the flask application

    ```bash
    python app.py
    ```



## Data Selection

### Definition:
Data selection involves identifying and gathering relevant datasets for the project. In many cases, this involves working with databases or APIs.

### Datase Used:
The program utilizes the `20M Movie Lens dataset`

### Example: Movie Recommendation System
- **APIs**: Fetching movie details from OMDb API.
- **Database**: Retrieving user-specific data from local or remote databases.

**Code Example:**
```js
async function fetchMovieData(movieTitle, yearOfRelease) {
  const key = "b55c4fdf";
  const response = await axios.get(
    `http://www.omdbapi.com/?apikey=${key}&t=${movieTitle}&y=${yearOfRelease}`
  );
  return response.data;
}
```

In this case, data is being selected from the OMDb API using the movie title and release year.

---

## Data Processing

### Definition:
Data processing involves cleaning, transforming, and structuring the data into a usable format for the application.

### Example: Movie Title and Year Extraction
We process the movie title and year from a string format like `Grumpier Old Men (1995)` into two variables: movie name and release year.

**Code Example:**
```js
function splitMovieData(text) {
  const match = text.match(/^(.*)\s\((\d{4})\)$/);
  if (match) {
    const movieName = match[1];
    const releaseYear = parseInt(match[2]);
    return { movieName, releaseYear };
  } else {
    return null;
  }
}
```

---

## Data Implementation

### Definition:
Data implementation involves storing, retrieving, and manipulating data within the system for various purposes.

### Example: Rendering Data into UI
After processing the movie data, it is implemented into the frontend by rendering it into the user interface.

**Code Example:**
```js
function renderCards(movieData) {
  const container = document.querySelector("#recommendations");
  container.innerHTML += createCard(movieData);
}

function createCard(movieData) {
  return `
    <div class="flex flex-col gap-4 w-1/4">
      <img src="${movieData.Poster}" alt="poster">
      <h4>${movieData.Title} (${movieData.Year})</h4>
      <p>${movieData.Plot}</p>
    </div>
  `;
}
```

This code takes the processed movie data and dynamically adds it to the webpage as a card component.

---

## Backend Development

### Definition:
Backend development handles the server-side logic, database management, and API interactions for the project.

### Tools and Technologies:
- **Flask** for creating backend logic, APIs, handling routes and requests.

### Example: Handling Post Requests in Backend
A typical Flask backend handles API calls, processes user data, and sends back responses.

**Code Example:**
```js
app.post("/recommend", async (req, res) => {
  const { user_id } = req.body;
  try {
    const recommendations = await getRecommendations(user_id); // Logic to get recommendations
    res.json(recommendations);
  } catch (error) {
    res.status(500).send("Error fetching recommendations");
  }
});
```

Here, the backend processes the user ID and responds with personalized recommendations.

---

## Frontend Interface

### Definition:
Frontend interface deals with the design and user interaction layer of the application, using frameworks like **React.js** and styling libraries like **Tailwind CSS**.

### Example: Interactive User Input Form

**HTML Code:**
```html
<form onsubmit="handleSubmit(event)">
  <input type="number" name="user_id" id="userId" placeholder="ID between 1 - 90" required>
  <button type="submit">Submit</button>
</form>
```

**JS Code:**
```js
function handleSubmit(e) {
  e.preventDefault();
  const user_id = document.getElementById("userId").value;
  axios.post("/recommend", { user_id: parseInt(user_id) })
    .then((res) => handleResponse(res.data))
    .catch((err) => console.log(err));
}
```

In this case, we handle a form submission to send the user ID to the backend and fetch personalized movie recommendations.

---

## Project Documentation

### API Endpoints

1. **POST `/recommend`**:
   - **Description**: Fetches recommended movies for a given user.
   - **Request Body**:
     ```json
     {
       "user_id": 1
     }
     ```
   - **Response**: List of recommended movies.

### Frontend Structure

1. **HTML**:
   - The basic structure consists of forms, input fields, and dynamic content containers.
   
2. **CSS**:
   - Use **Tailwind CSS** for styling components.
   - Use **DaisyUI** for pre-styled components.

   
3. **JavaScript**:
   - Implement form validation, user interactions, and dynamic rendering using vanilla JS.

4. **Axios**:
  - for handling fetch and get requests

### Toast Notifications

To improve user experience, toast notifications are shown when new recommendations are generated:

**Code Example:**
```js
function createToast() {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.innerHTML = `<div class="alert alert-info">New recommendations generated.</div>`;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 3000);
}
```

---

## Conclusion

This documentation covers the entire flow of a movie recommendation system: selecting and processing data from APIs, implementing the data into the backend and frontend, and handling both the user interface and the server-side logic. By following these practices, you can build a robust and scalable application.