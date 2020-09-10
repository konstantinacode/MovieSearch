$(document).ready(function() {
    $('#searchForm').on('keyup', function(e) {
        let searchText = $('#searchText').val();
        getMovies(searchText);
        e.preventDefault();
    })
    ;});
    var names = [];

// this function searches for matching movie titles and stores the titles in an array
function getMovies(searchText){
    names = [];
    fetch('http://www.omdbapi.com/?apikey=efd306d6&s=' + searchText).then(response => response.json())
        .then(   
                data => {console.log(data);
                let movies = data.Search;
                let output = '';
                $.each(movies, function(index, movie) {
                                                                     
                    names.push(movie.Title);
                   
                });
        })
        .then(
          result => {
            getData()
          }
        )
        .catch(function(err) {console.log(err);});
        
}

//this function for every matching title collects the movie's information and displays each result
function getData(){
  let output2 = '';
  for (let i=0; i<names.length; i++){
    fetch('http://www.omdbapi.com/?apikey=efd306d6&t=' + names[i] + '&plot=short').then(response => response.json())
    .then(
      d => {console.log(d);
        let m = d;

        output2 +=`
              <div class="results">
                  <div class="description">
                    <img class="poster" src="${m.Poster}">
                    <h2>${m.Title}</h2>
                    <p><strong>Genre: </strong>${check(m.Genre)}</p>
                    <p><strong>Actors: </strong>${check(m.Actors)}</p>
                    <p><strong>Plot: </strong>${check(m.Plot)}</p><br>
                    
                    <div class="c"></div>
                    <br>
                  </div>
                  <div class="toBottom">
                  <a onclick="movieSelect('${m.imdbID}')" class="elemClick" href="#"><button class="btns">More...</button></a>
                 </div>  
              </div>     
            `;
        console.log(output2);
        $('#movies').html(output2);
      })
  }
}

//this function connects each search result with a new page that shows more about that movie 
function movieSelect(id) {
    sessionStorage.setItem('movieId', id);
    window.location = 'moviePage.html';
    return false;
}

//this function gest from the api all the information for a movie and displays them
function getMovie() {
    let movieId = sessionStorage.getItem('movieId');
    fetch('http://www.omdbapi.com/?apikey=efd306d6&i=' + movieId + '&plot=full').then(response => response.json())
        .then(   
                data => {console.log(data);
                    let movie = data;

                    let output =`
                      <div>
                      <h1 class="main-title">${movie.Title}</h1>
                        <div id="poster">
                          <img src="${movie.Poster}" class="thumbnail">
                        </div>
                        <div id="details">
                          <ul>
                            <li><strong>Genre:</strong> ${check(movie.Genre)}</li>
                            <li><strong>Released:</strong> ${check(movie.Released)}</li>
                            <li><strong>Rated:</strong> ${check(movie.Rated)}</li>
                            <li><strong>IMDB Rating:</strong> ${check(movie.imdbRating)}</li>
                            <li><strong>Director:</strong> ${check(movie.Director)}</li>
                            <li><strong>Writer:</strong> ${check(movie.Writer)}</li>
                            <li><strong>Actors:</strong> ${check(movie.Actors)}</li>
                            <li><strong>Runtime:</strong> ${check(movie.Runtime)}</li>
                            <li><strong>Language:</strong> ${check(movie.Language)}</li>
                            <li><strong>Country:</strong> ${check(movie.Country)}</li>
                            <li><strong>Awards:</strong> ${check(movie.Awards)}</li>
                            <li><strong>Box Office:</strong> ${check(movie.BoxOffice)}</li>
                            <li><strong>Production:</strong> ${check(movie.Production)}</li>
                            <li><strong>Website:</strong> <a href="${(movie.Website===undefined || movie.Website=== NaN || movie.Website === "N/A") ? "#" : movie.Website}"> ${check(movie.Website)}</a></li>
                          </ul>

                        </div>
                      </div>
                        <div id="plot">
                          <h3>Full Plot</h3>
                          ${movie.Plot}
                          <hr>
                          
                          <div class="c"></div>
                        </div>
                        <div class="btns">
                            <a href="index.html" ><button> Back To Search </button></a>
                            <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" ><button> View IMDB</button></a>
                          </div>
                    `;
              
                    $('#movie').html(output);
        })
        .catch(function(err) {console.log(err);});
}

//this function checks for missing movie data and if missing returns a message
function check(item){
  if(item === undefined || item === NaN || item === "N/A"){
    return " Not found ";
  }else{
    return item;
  }
}