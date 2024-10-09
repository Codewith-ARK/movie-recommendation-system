from flask import Flask, request, jsonify, render_template
import pandas as pd
from sklearn.neighbors import NearestNeighbors
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

# Load the dataset
ratings = pd.read_csv('data/rating.csv')  # UserId, MovieId, Rating
movies = pd.read_csv('data/movie.csv')    # MovieId, Title, Genres

# Use only the first 2000 rows for training
ratings = ratings.head(9900)
movies = movies.head(9900)

# Create a pivot table
user_movie_ratings = ratings.pivot(index='userId', columns='movieId', values='rating').fillna(0)

# Fit the model
model = NearestNeighbors(metric='cosine')
model.fit(user_movie_ratings.values)

@app.route("/", methods=["GET"])
def home():
  return render_template("index.html")

@app.route('/recommend', methods=['POST'])
def recommend():
  user_id = request.json['user_id']
  # user_id = int(request.form["user_id"])
  user_ratings = user_movie_ratings.loc[user_id].values.reshape(1, -1)
  distances, indices = model.kneighbors(user_ratings, n_neighbors=5)
  recommended_movie_ids = user_movie_ratings.columns[indices.flatten()]
  recommended_movies = movies[movies['movieId'].isin(recommended_movie_ids)]  # print(recommended_movies)
  recommended_movies=recommended_movies['title'].tolist()
  return jsonify(recommended_movies)

  # Pass the movie titles to the template
  # return render_template("recommendation.html", recommended_movies=recommended_movies['title'].tolist(), user_id=user_id)

if __name__ == '__main__':
    app.run(debug=True)