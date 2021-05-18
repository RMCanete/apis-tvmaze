/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */

async function searchShows(query) {
  // Make an ajax request to the searchShows api
  let res = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
  let shows = res.data.map(results => {
    let show = results.show;
    return {
      id: show.id,
      name: show.name, 
      summary: show.summary, 
      image: show.image ? show.image.medium : "https://tinyurl.com/tv-missing"
    };
  });
  return shows;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <img class="card-img-top" src="${show.image}">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="card-get-episodes">Get Episodes</button>
           </div>
         </div>
       </div>
      `);
    $showsList.append($item);
  }
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();
  let query = $("#search-query").val();
  if (!query) return;
  $("#episodes-area").hide();
  let shows = await searchShows(query);
  populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // get episodes from tvmaze
  // return array-of-episode-info, as described in docstring above

  let res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  let episodes = res.data.map(episode => ({
      id: episode.id,
      name: episode.name, 
      season: episode.season, 
      number: episode.number
    }));
  return episodes;
}

function populateEpisodes(episodes) {
  let $episodesList = $("#episodes-list");
  $episodesList.empty();
  for(let episode of episodes) {
    let $list = $( `<li> ${episode.name} (Season ${episode.season}, Number ${episode.number}, ID ${episode.id}) </li>`)
    $episodesList.append($list);
  }
  $("#episodes-area").show();
}

// click handler to populate episodes

$("#shows-list").on("click", async function handleClick(e) {
  let show = $(e.target).closest(".card").data("show-id");
  let episodes = await getEpisodes(show);
  populateEpisodes(episodes);
});