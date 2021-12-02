import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import logo from './r7t-iso.svg';
import './App.css';
import MovieLocation from "./MovieLocations";
import {URL_MOVIE_API} from "./Config";
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {Button, InputLabel, MenuItem, Select} from "@mui/material";


function App() {

    const [isFormValid, setIsFormValid] = useState(false);
    const [movieId, setMovieId] = useState(0);
    const [allMovies, setAllMovies] = useState([]);
    const [movies, setMovies] = useState([]);
    const [movieSelected, setMovieSelected] = useState([]);

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: 'dark',
                },
            }),
        [prefersDarkMode],
    );

    useEffect(() => {

        //get all movies using axios
        axios.get(`${URL_MOVIE_API}`).then(res => {

            //save all movies
            setAllMovies(res.data.features);

            //filter movies with the type Movie
            const listOnlyMovies = res.data.features.filter( (m) => m.attributes.Type === 'Movie');


            //filter movie list by unique title
            const uniqueMovies = [...new Set(listOnlyMovies.map(item => item.attributes.Title))];

            setMovies(uniqueMovies);

        });

    }, []);

    function handleChange(event) {
        if(event.target.value==='0')
            setIsFormValid(false);
        else
            setIsFormValid(true);

        setMovieId(event.target.value);
    }
    function handleSubmit(event) {

        event.preventDefault();
        //get all the locations from the movie selected
        const listMoviesSelected = allMovies.filter( (m) => m.attributes.Title === movieId);
        setMovieSelected(listMoviesSelected);
    }
  return (
      <ThemeProvider theme={theme}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>Welcome to the Reconnect Test</p>

              <form onSubmit={handleSubmit}>
                  <div className="">
                      <InputLabel htmlFor="category-label-placeholder">Pick your movie</InputLabel>
                      <Select value={movieId} onChange={handleChange} >
                          <MenuItem value={0} key={0}>
                              Select a movie
                          </MenuItem>
                          {movies && movies.map(movie => (
                              <MenuItem value={movie} key={movie}>
                                  {movie}
                              </MenuItem>
                          ))}
                      </Select>
                      <Button type="submit"
                              variant="contained"
                              color="primary"
                              disabled={!isFormValid}
                      >
                          Search
                      </Button>
                  </div>
              </form>
              <MovieLocation movieLocations = {movieSelected} />
          </header>
        </div>
      </ThemeProvider>
  );
}

export default App;
