var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */


/* ---- Q1a (Dashboard) ---- */
function getAllGenres(req, res) {
  var query = `SELECT DISTINCT genre FROM Genres;`;
  console.log(query)
  connection.query(query, function(err, rows, fields){
    if (err) console.log(err);
    else{
      console.log(rows)
      res.json(rows);
    }
  });
};


/* ---- Q1b (Dashboard) ---- */
function getTopInGenre(req, res) {
  var inputGenre = req.params.genre;
  var query = `SELECT Movies.title, Movies.rating, Movies.vote_count FROM Movies JOIN Genres ON Movies.id = Genres.movie_id \
    WHERE Genres.genre = '${inputGenre}' ORDER BY MOVIES.RATING DESC, MOVIES.VOTE_COUNT DESC
    LIMIT 10;`;
  connection.query(query, function(err, rows, fields){
    if(err) console.log(err);
    else{
      res.json(rows)
    }
  })

};

/* ---- Q2 (Recommendations) ---- */
function getRecs(req, res) {
  var inputLocation = req.params.location;
  var inputAge = req.params.age;
  var inputSmoking = req.params.smoking;
  var inputFamily = req.params.family;
  var query = `
  SELECT Plan.PlanId AS planid, Benefits.BenefitName AS benefit, "temp issuer" AS issuer, "temp network" AS network,
  Benefits.CopayOutofNetAmount AS copayoon, Benefits.CoinsOutofNet AS coinsoon, Rates.IndividualRate AS indvrate, Couple AS grouprate
  FROM Plan JOIN Rates ON Plan.PlanId = Rates.PlanId
  JOIN Benefits ON Plan.PlanId = Benefits.PlanId
  JOIN FamilyOption ON Plan.PlanId = FamilyOption.PlanId
  WHERE Plan.StateCode = '${inputLocation}' AND
  Rates.Age = '${inputAge}' AND
  IndividualRate IS NOT NULL AND
  BusinessYear = 2016;`;
  // var query = `
  // SELECT Plan.PlanId, Benefits.BenefitName AS benefit, Issuer.IssuerMarketplaceMarketingName AS issuer, Network.NetworkName AS network, Benefits.CopayOutofNet AS copayoon,
  // Benefits.CoinsOutofNet AS coinsoon, CASE WHEN ${inputSmoking} = "No Smoking"
  //   THEN Rates.IndividualRate
  //   ELSE Rates.IndividualTobaccoRate
  //   END AS indvrate,
  // CASE WHEN ${inputFamily} = "Couple" THEN Couple ELSE NULL END AS grouprate,
  // CASE WHEN ${inputFamily} = "Primary Subscriber And One Dependent" THEN PrimarySubscriberAndOneDependent ELSE NULL END AS grouprate,
  // CASE WHEN ${inputFamily} = "Primary Subscriber And Two Dependents" THEN PrimarySubscriberAndTwoDependents ELSE NULL END AS grouprate,
  // CASE WHEN ${inputFamily} = "Primary Subscriber And Three Or More Dependents" THEN PrimarySubscriberAndThreeOrMoreDependents ELSE NULL END AS grouprate,
  // CASE WHEN ${inputFamily} = "Couple And One Dependent" THEN CoupleAndOneDependent ELSE NULL END AS grouprate,
  // FROM Plan JOIN Rates ON Plan.PlanId = Rates.PlanId
  // JOIN Benefits ON Plan.PlanId = Benefits.PlanId
  // JOIN Issuer ON Plan.IssuerId = Issuer.IssuerId
  // JOIN Network ON Issuer.NetworkId = Network.NetworkId
  // JOIN FamilyOption ON FamilyOption.PlanId=Plan.PlanId
  // WHERE Plan.StateCode = ${inputLocation} AND
  // Rates.Age = ${inputAge} AND BusinessYear = '2016'
  // IndividualRate IS NOT NULL ORDER BY Benefits.BenefitName;`;

  connection.query(query, function(err, rows, fields){
    if(err) console.log(err);
    else{
      res.json(rows)
    }
  })
};

/* ---- (Best Genres) ---- */
function getDecades(req, res) {
	var query = `
    SELECT DISTINCT (FLOOR(year/10)*10) AS decade
    FROM (
      SELECT DISTINCT release_year as year
      FROM Movies
      ORDER BY release_year
    ) y
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

/* ---- Q3 (Best Genres) ---- */
function bestGenresPerDecade(req, res) {
  var inputDecades = req.params.decades;
  console.log(inputDecades);
  var query = `
    WITH TEMP1 AS(
      SELECT *
      FROM movies
      WHERE release_year >='${inputDecades}' AND release_year < (${inputDecades}+10)
      ),
      TEMP2 AS(
      SELECT TEMP1.ID, TEMP1.RATING, GENRES.GENRE
      FROM TEMP1 JOIN GENRES ON TEMP1.ID = GENRES.MOVIE_ID
      ),
      TEMP3 AS(
      SELECT DISTINCT GENRE, 0 AS AVG_RATING
      FROM GENRES
      WHERE GENRE NOT IN(
        SELECT GENRE
        FROM TEMP2
      )
      ORDER BY GENRE
      ),
      TEMP4 AS(
      SELECT GENRE, AVG(RATING) AS AVG_RATING
      FROM TEMP2
      GROUP BY GENRE
      ORDER BY AVG_RATING DESC, GENRE
      )
      SELECT *
      FROM TEMP4 UNION(
      SELECT *
      FROM TEMP3
      );
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};

// The exported functions, which can be accessed in index.js.
module.exports = {
	getAllGenres: getAllGenres,
	getTopInGenre: getTopInGenre,
	getRecs: getRecs,
	getDecades: getDecades,
  bestGenresPerDecade: bestGenresPerDecade
}
