import { EntityState, Update, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { Movie, MovieDetails } from '../interfaces/movies.interfaces';
import { MoviesActions } from './movies.actions';

export const moviesFeatureKey = 'movies';

export interface MoviesState {
  nowPlaying: { currentPage: number; movies: EntityState<MovieDetails> };
  popular: { currentPage: number; movies: EntityState<MovieDetails> };
  topRated: { currentPage: number; movies: EntityState<MovieDetails> };
  upcoming: { currentPage: number; movies: EntityState<MovieDetails> };
  favorites: { currentPage: number; movies: EntityState<MovieDetails> };
  watchlist: { currentPage: number; movies: EntityState<MovieDetails> };
}

export const moviesAdapter = createEntityAdapter<MovieDetails>();

export const initialState: MoviesState = moviesAdapter.getInitialState({
  nowPlaying: { currentPage: 1, movies: moviesAdapter.getInitialState() },
  popular: { currentPage: 1, movies: moviesAdapter.getInitialState() },
  topRated: { currentPage: 1, movies: moviesAdapter.getInitialState() },
  upcoming: { currentPage: 1, movies: moviesAdapter.getInitialState() },
  favorites: { currentPage: 1, movies: moviesAdapter.getInitialState() },
  watchlist: { currentPage: 1, movies: moviesAdapter.getInitialState() },
});

export const moviesReducer = createReducer(
  initialState,
  on(MoviesActions.loadMovies, (state) => state),
  on(MoviesActions.loadMoviesSuccess, (state, { movies, category }) => {
    switch (category) {
      case 'nowPlaying':
        return {
          ...state,
          nowPlaying: {
            currentPage: movies.page,
            movies: moviesAdapter.upsertMany(
              movies.results.filter((movie) => movie !== null),
              state.nowPlaying.movies
            ),
          },
        };

      case 'popular':
        return {
          ...state,
          popular: {
            currentPage: movies.page,
            movies: moviesAdapter.upsertMany(
              movies.results.filter((movie) => movie !== null),
              state.popular.movies
            ),
          },
        };
      case 'topRated':
        return {
          ...state,
          topRated: {
            currentPage: movies.page,
            movies: moviesAdapter.upsertMany(
              movies.results.filter((movie) => movie !== null),
              state.topRated.movies
            ),
          },
        };

      case 'upcoming':
        return {
          ...state,
          upcoming: {
            currentPage: movies.page,
            movies: moviesAdapter.upsertMany(
              movies.results.filter((movie) => movie !== null),
              state.upcoming.movies
            ),
          },
        };
      default:
        return state;
    }
  }),
  on(MoviesActions.loadFavoriteMovies, (state) => state),
  on(MoviesActions.loadFavoriteMoviesSuccess, (state, { data: { movies } }) => {
    const changes: Update<Movie>[] = movies.map((movie) => {
      return {
        id: movie.id,
        changes: {
          is_favorite: movie.is_favorite,
        },
      };
    });

    const newState = {
      ...state,
      favorites: {
        ...state.favorites,
        movies: moviesAdapter.upsertMany(
          movies as MovieDetails[],
          state.favorites.movies
        ),
      },
      watchlist: {
        ...state.watchlist,
        movies: moviesAdapter.updateMany(changes, state.watchlist.movies),
      },
      nowPlaying: {
        ...state.nowPlaying,
        movies: moviesAdapter.updateMany(changes, state.nowPlaying.movies),
      },
      popular: {
        ...state.popular,
        movies: moviesAdapter.updateMany(changes, state.popular.movies),
      },
      topRated: {
        ...state.topRated,
        movies: moviesAdapter.updateMany(changes, state.topRated.movies),
      },
      upcoming: {
        ...state.upcoming,
        movies: moviesAdapter.updateMany(changes, state.upcoming.movies),
      },
    };
    return newState;
  }),
  on(MoviesActions.rateMovieSuccess, (state, { id, rating }) => {
    return {
      ...state,
      favorites: {
        ...state.favorites,
        movies: moviesAdapter.upsertOne(
          {
            ...state.favorites.movies.entities[id],
            rating,
          } as MovieDetails,
          state.favorites.movies
        ),
      },
      watchlist: {
        ...state.watchlist,
        movies: moviesAdapter.upsertOne(
          {
            ...state.watchlist.movies.entities[id],
            rating,
          } as MovieDetails,
          state.watchlist.movies
        ),
      },
      nowPlaying: {
        ...state.nowPlaying,
        movies: moviesAdapter.upsertOne(
          {
            ...state.nowPlaying.movies.entities[id],
            rating,
          } as MovieDetails,
          state.nowPlaying.movies
        ),
      },
      popular: {
        ...state.popular,
        movies: moviesAdapter.upsertOne(
          {
            ...state.popular.movies.entities[id],
            rating,
          } as MovieDetails,
          state.popular.movies
        ),
      },
      topRated: {
        ...state.topRated,
        movies: moviesAdapter.upsertOne(
          {
            ...state.topRated.movies.entities[id],
            rating,
          } as MovieDetails,
          state.topRated.movies
        ),
      },
      upcoming: {
        ...state.upcoming,
        movies: moviesAdapter.upsertOne(
          {
            ...state.upcoming.movies.entities[id],
            rating,
          } as MovieDetails,
          state.upcoming.movies
        ),
      },
    };
  }),
  on(MoviesActions.loadRatedMoviesSuccess, (state, { data: { movies } }) => {
    const changes: Update<Movie>[] = movies.map((movie) => {
      return {
        id: movie.id,
        changes: {
          rating: movie?.rating,
        },
      };
    });

    return {
      ...state,
      favorites: {
        ...state.favorites,
        movies: moviesAdapter.updateMany(changes, state.favorites.movies),
      },
      watchlist: {
        ...state.watchlist,
        movies: moviesAdapter.updateMany(changes, state.watchlist.movies),
      },
      nowPlaying: {
        ...state.nowPlaying,
        movies: moviesAdapter.updateMany(changes, state.nowPlaying.movies),
      },
      popular: {
        ...state.popular,
        movies: moviesAdapter.updateMany(changes, state.popular.movies),
      },
      topRated: {
        ...state.topRated,
        movies: moviesAdapter.updateMany(changes, state.topRated.movies),
      },
      upcoming: {
        ...state.upcoming,
        movies: moviesAdapter.updateMany(changes, state.upcoming.movies),
      },
    };
  }),
  on(
    MoviesActions.loadWatchlistMoviesSuccess,
    (state, { data: { movies } }) => {
      const changes: Update<Movie>[] = movies.map((movie) => {
        return {
          id: movie.id,
          changes: {
            is_watchlist: movie.is_watchlist,
          },
        };
      });

      return {
        ...state,
        watchlist: {
          ...state.watchlist,
          movies: moviesAdapter.upsertMany(movies, state.watchlist.movies),
        },
        favorites: {
          ...state.favorites,
          movies: moviesAdapter.updateMany(changes, state.favorites.movies),
        },
        nowPlaying: {
          ...state.nowPlaying,
          movies: moviesAdapter.updateMany(changes, state.nowPlaying.movies),
        },
        popular: {
          ...state.popular,
          movies: moviesAdapter.updateMany(changes, state.popular.movies),
        },
        topRated: {
          ...state.topRated,
          movies: moviesAdapter.updateMany(changes, state.topRated.movies),
        },
        upcoming: {
          ...state.upcoming,
          movies: moviesAdapter.updateMany(changes, state.upcoming.movies),
        },
      };
    }
  ),
  on(MoviesActions.removeFavorite, (state, { id }) => {
    return {
      ...state,
      favorites: {
        ...state.favorites,
        movies: moviesAdapter.upsertOne(
          {
            ...state.favorites.movies.entities[id],
            is_favorite: false,
          } as MovieDetails,
          state.favorites.movies
        ),
      },
      watchlist: {
        ...state.watchlist,
        movies: moviesAdapter.upsertOne(
          {
            ...state.watchlist.movies.entities[id],
            is_favorite: false,
          } as MovieDetails,
          state.watchlist.movies
        ),
      },
      nowPlaying: {
        ...state.nowPlaying,
        movies: moviesAdapter.upsertOne(
          {
            ...state.nowPlaying.movies.entities[id],
            is_favorite: false,
          } as MovieDetails,
          state.nowPlaying.movies
        ),
      },
      popular: {
        ...state.popular,
        movies: moviesAdapter.upsertOne(
          {
            ...state.popular.movies.entities[id],
            is_favorite: false,
          } as MovieDetails,
          state.popular.movies
        ),
      },
      topRated: {
        ...state.topRated,
        movies: moviesAdapter.upsertOne(
          {
            ...state.topRated.movies.entities[id],
            is_favorite: false,
          } as MovieDetails,
          state.topRated.movies
        ),
      },
      upcoming: {
        ...state.upcoming,
        movies: moviesAdapter.upsertOne(
          {
            ...state.upcoming.movies.entities[id],
            is_favorite: false,
          } as MovieDetails,
          state.upcoming.movies
        ),
      },
    };
  }),
  on(MoviesActions.removeFromWatchlist, (state, action) => {
    return {
      ...state,
      watchlist: {
        ...state.watchlist,
        movies: moviesAdapter.upsertOne(
          {
            ...state.watchlist.movies.entities[action.id],
            is_watchlist: false,
          } as MovieDetails,
          state.watchlist.movies
        ),
      },
      favorites: {
        ...state.favorites,
        movies: moviesAdapter.upsertOne(
          {
            ...state.favorites.movies.entities[action.id],
            is_watchlist: false,
          } as MovieDetails,
          state.favorites.movies
        ),
      },
      nowPlaying: {
        ...state.nowPlaying,
        movies: moviesAdapter.upsertOne(
          {
            ...state.nowPlaying.movies.entities[action.id],
            is_watchlist: false,
          } as MovieDetails,
          state.nowPlaying.movies
        ),
      },
      popular: {
        ...state.popular,
        movies: moviesAdapter.upsertOne(
          {
            ...state.popular.movies.entities[action.id],
            is_watchlist: false,
          } as MovieDetails,
          state.popular.movies
        ),
      },
      topRated: {
        ...state.topRated,
        movies: moviesAdapter.upsertOne(
          {
            ...state.topRated.movies.entities[action.id],
            is_watchlist: false,
          } as MovieDetails,
          state.topRated.movies
        ),
      },
      upcoming: {
        ...state.upcoming,
        movies: moviesAdapter.upsertOne(
          {
            ...state.upcoming.movies.entities[action.id],
            is_watchlist: false,
          } as MovieDetails,
          state.upcoming.movies
        ),
      },
    };
  }),
  on(
    MoviesActions.loadMovieDetailsSuccess,
    (state, { data: { movie, category } }) => {
      switch (category) {
        case 'nowPlaying':
          return {
            ...state,
            nowPlaying: {
              ...state.nowPlaying,
              movies: moviesAdapter.upsertOne(movie, state.nowPlaying.movies),
            },
          };

        case 'popular':
          return {
            ...state,
            popular: {
              ...state.popular,
              movies: moviesAdapter.upsertOne(movie, state.popular.movies),
            },
          };
        case 'topRated':
          return {
            ...state,
            topRated: {
              ...state.topRated,
              movies: moviesAdapter.upsertOne(movie, state.topRated.movies),
            },
          };

        case 'upcoming':
          return {
            ...state,
            upcoming: {
              ...state.upcoming,
              movies: moviesAdapter.upsertOne(movie, state.upcoming.movies),
            },
          };
        default:
          return {
            ...state,
          };
      }
    }
  ),
  on(
    MoviesActions.loadMovieProvidersSuccess,
    (state, { data: { providers } }) => {
      return {
        ...state,
        nowPlaying: {
          ...state.nowPlaying,
          movies: moviesAdapter.upsertOne(
            {
              ...state.nowPlaying.movies.entities[providers.id],
              providers: providers.results.US?.buy,
            } as MovieDetails,
            state.nowPlaying.movies
          ),
        },
        popular: {
          ...state.popular,
          movies: moviesAdapter.upsertOne(
            {
              ...state.popular.movies.entities[providers.id],
              providers: providers.results.US?.buy,
            } as MovieDetails,
            state.popular.movies
          ),
        },
        topRated: {
          ...state.topRated,
          movies: moviesAdapter.upsertOne(
            {
              ...state.topRated.movies.entities[providers.id],
              providers: providers.results.US?.buy,
            } as MovieDetails,
            state.topRated.movies
          ),
        },
        upcoming: {
          ...state.upcoming,
          movies: moviesAdapter.upsertOne(
            {
              ...state.upcoming.movies.entities[providers.id],
              providers: providers.results.US?.buy,
            } as MovieDetails,
            state.upcoming.movies
          ),
        },
      };
    }
  )
);

export const moviesFeature = createFeature({
  name: moviesFeatureKey,
  reducer: moviesReducer,
});
