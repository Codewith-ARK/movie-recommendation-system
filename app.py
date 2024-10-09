from flask import Flask, request, jsonify, render_template
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans

app = Flask(__name__)

# Load the dataset
ratings = pd.read_csv('data/rating.csv')  # UserId, MovieId, Rating
movies = pd.read_csv('data/movie.csv')  # MovieId, Title, Genres

# Use only the first 9900 rows for training
ratings = ratings.head(9900)
movies = movies.head(9900)

# Create a user-item matrix
user_movie_ratings = ratings.pivot(index='userId', columns='movieId', values='rating').fillna(0)

# Apply K-Means clustering
kmeans = KMeans(n_clusters=10)  # Adjust the number of clusters as needed
kmeans.fit(user_movie_ratings)

# Get user cluster labels
user_clusters = kmeans.labels_

@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")

@app.route('/recommend', methods=['POST'])
def recommend():
    user_id = request.json['user_id']
    # Get user's cluster
    user_cluster = user_clusters[user_id]

    # Find users in the same cluster
    similar_users = user_movie_ratings.loc[user_clusters == user_cluster]

    # Recommend movies based on similar users' ratings
    recommendations = similar_users.mean().sort_values(ascending=False)
    recommended_movie_ids = recommendations.index[:5]  # Top 5 recommendations

    recommended_movies = movies[movies['movieId'].isin(recommended_movie_ids)]
    recommended_movies = recommended_movies['title'].tolist()

    return jsonify(recommended_movies)

if __name__ == '__main__':
    app.run(debug=True)