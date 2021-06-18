import {useState, useEffect} from 'react';
import GridLayout from 'react-grid-layout';
import '../App.css';

const Layout = () => {
  const [error, setError] = useState(null); //This is for any error messages
  const [movies, setMovies] = useState(null);  //This is for the movie title array
  const [movieInput, setMovieInput] = useState(null); //This is what the user types
  let nominatedMovies=[];

  const handleChange = (event) => {
    let userInput = event.target.value;
    userInput.replace(/\s/g, '_');  //makes strings change " " (spaces) to "_" (underline). This should help fix the url links
    setMovieInput(userInput);
  }

  const nominateButtonClicked = (titleAndYear) => {
    nominatedMovies.push(`${titleAndYear}`);
    console.log(nominatedMovies);
  }

  const overallLayout = [
    {i: 'title', x: 0, y: 0, w: 12, h: 1, rowHeight: 50, static: true},
    {i: 'moviesBox', x: 0, y: 1, w: 12, h: 1, static: true},
    {i: 'chooseMovies', x: 0, y: 2, w: 6, h: 3, static: true},
    {i: 'nominations', x: 7, y: 2, w: 6, h: 3, static: true}
  ];

  useEffect(() => {
    setError(null);
    setMovies(null);

    fetch(`http://www.omdbapi.com/?s=${movieInput}&apikey=ac101887`)
    .then(resp => resp)
    .then(resp => resp.json())
    .then(response => {
        if (response.Response === 'False') {
          setError(response.Error);
        }
        else {
          setMovies(response.Search);
        }
    })
    .catch(({message}) => {
        setError(message);
    })
  }, [movieInput])

    return (
    <div className = "Items_component">
      <GridLayout className="layout" layout={overallLayout} cols={12} rowHeight={100} width={1000}>
        <div key = "title" className = "title">
          <p>The Shoppies</p>
        </div>

        <div key = "moviesBox" className = "moviesBox">
          <p>Movie Title</p>
          <input type = "text" placeholder = "Movie Title" onChange = {handleChange}/>
          {/* <button className = "submitButton">Submit</button> */}
        </div>

        <div key = "chooseMovies">
          <div className = "columns moviesBox">
            <div className = "subTitle">
              {movieInput===null
                ? <p>Enter a movie above!</p>
                : <p>Results for "{movieInput}"</p>
              }
            </div>

            {movieInput===null || movieInput === ""
                ? <p>No results found</p>
                : 
                [movies!==null
                  ? <div className = "movieSearchResults">
                      <ul>
                        {movies.slice(0,3).map(el => 
                          <li className={`${el.Title} (${el.Year})`}>
                            <p className = "movieTitle" value="Title" key="Title">{el.Title} ({el.Year})</p>
                            <button className="nominateButton" onClick={nominateButtonClicked(`${el.Title} (${el.Year})`)}>Nominate</button>
                          </li>
                          )
                        }
                      </ul>
                    </div>
                  : <div className = "errorResult">
                      <p>ERROR: {error}</p>
                    </div>
                ]
              }
          </div>
        </div>

        <div key = "nominations">
          <div className = "columns moviesBox">
            {nominatedMovies.length === 5
            ?<div className = "nominations title">
              <p>Congratulations! You're done!</p>
            </div>
            : null}
            <div className = "subTitle">
              <p>Nominations</p>
              {nominatedMovies.length>0
              ? <ul>
                  {nominatedMovies.map(el => 
                    <li>
                      <p className = {`${el} body`} value={el} key={el}>{el}</p>
                      <button className = "removeButton">Remove</button>
                    </li>
                  )}
                </ul>
              : null}
            </div>
          </div>
        </div>
      </GridLayout>
    </div>
    );
}

export default Layout;