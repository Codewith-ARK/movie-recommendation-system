const key = "b55c4fdf";

function handleSubmit(e) {
  e.preventDefault();

  const IdContainer = document.getElementById("userId"); // Get the user ID from the input
  const user_id = IdContainer.value;

  if (IdContainer.value <= 0) {
    alert("Enter an ID please.");
    return;
  }

  axios
    .post("/recommend", { user_id: parseInt(user_id) })
    .then((res) => {
      handleResponse(res.data); // Process the recommended movies
    })
    .catch((err) => {
      console.log(err);
    });

  IdContainer.value = "";
}

function splitMovieData(text) {
  // Use regex to match the movie name and release year
  const match = text.match(/^(.*)\s\((\d{4})\)$/);

  if (match) {
    const movieName = match[1]; // Movie name part
    const releaseYear = parseInt(match[2]); // Year part, converted to integer
    return { movieName, releaseYear };
  } else {
    return null; // Return null if format doesn't match
  }
}

async function handleResponse(allMovies) {
  // Use for...of instead of forEach to handle async/await
  for (const movie of allMovies) {
    const { movieName, releaseYear } = splitMovieData(movie);
    const data = await fetchMovieData(movieName, releaseYear);
    if (data.Response) {
      renderCards(data);
      createToast();
    }
  }
}

async function fetchMovieData(movieTitle, yearOfRelease) {
  // Use await to get the API response
  const response = await axios.get(
    `http://www.omdbapi.com/?apikey=${key}&t=${movieTitle}&y=${yearOfRelease}`
  );
  return response.data; // Return the fetched data
}

function renderCards(movieData) {
  const container = document.querySelector("#recommendations");
  container.innerHTML += createCard(movieData);
}

function createCard(movieData) {
  const image = createImage(movieData.Poster);
  const stats = createStats(movieData);
  return `
  <div class="flex flex-col gap-4 w-full max-w-80 overflow-hidden">
    ${image}
    <div class="pb-6 flex flex-col gap-2">
      ${stats}
      <h4 class="text-md font-semibold overflow-clip whitespace-nowrap">${
        movieData.Title || "Unknown Title"
      } (${movieData.Year || "N/A"})</h4>
      <p class="text-sm text-ellipsis">${
        movieData.Plot || "N/A"
      }</p>
    </div>
  </div
  `;
}

function createImage(imgUrl) {
  return `
      <div class="h-[380px] w-full overflow-hidden rounded-xl bg-gray-700">
        <img class="w-full h-full object-cover" src=${
          imgUrl
        } alt="poster_image">
      </div>
  `;
}

function createStats(statData) {
  const filmDuration = calcFilmDuration(statData.Runtime || "N/A");

  return `
  <div class="flex items-center gap-3">
    <span class="badge badge-sm badge-secondary">${statData.Genre}</span>
  </div>

  `;
}

function calcFilmDuration(runtime) {
  // Extract the number of minutes from the string
  const minutes = parseInt(runtime);

  // Calculate hours and remaining minutes
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  // Return formatted duration
  return `${hours}h ${remainingMinutes}m`;
}
function createToast() {
  // Create toast container
  const toast = document.createElement("div");
  toast.classList.add("toast");

  const alert = document.createElement("div");
  alert.classList.add("alert", "alert-info");

  const span = document.createElement("span");
  span.textContent = "New recommendations generated.";

  alert.appendChild(span);
  toast.appendChild(alert);

  // Append to body
  document.body.appendChild(toast);

  // Remove the toast after 3 seconds
  setTimeout(() => {
    toast.style.opacity = "0"; // Fade out
    setTimeout(() => {
      toast.remove(); // Remove from DOM after fade-out transition
    }, 500); // Allow time for the fade-out effect
  }, 3000);
}
