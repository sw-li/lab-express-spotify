require("dotenv").config();
const express = require("express");
const hbs = require("hbs");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get('/', (req,res)=>{
  res.render("index")
})

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artistName)
    .then(data => data.body.artists.items)
    .then(results => {
      res.render("artist-search-results", {results})
    })
    .catch((err) => console.log(err));
});



app.get("/albums/:artistId", (req, res)=>{
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => data.body.items)
    .then(results => {
      res.render("albums", {results})
    })
    .catch((err) => console.log(err))
})

app.get("/albums/album/:albumId", (req, res)=>{
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data => data.body.items)
    .then(results => {
      console.log(results)
      res.render('album', {results, layout:false})
    })
    .catch((err) => console.log(err))
})



app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
