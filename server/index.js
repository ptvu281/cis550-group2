const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');
const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */


/* ---- ONES WE ACTUALLY USE CLEAN UP REST WHEN DONE ---- */
app.get('/recommendations/:location/:age/:benefit/:family', routes.getRecs);
app.get('/ben1/:selectedYear/:selectedOption', routes.getBen1);
app.get('/ben2/:selectedBenefit/:selectedStats', routes.getBen2);
app.get('/state1/:selectedState/:selectedYear/:selectedFreq', routes.getState1);
app.get('/state2/:selectedState2/:selectedBenefit', routes.getState2);
app.get('/provider/:selectedState/:selectedYear', routes.getProvider);
app.get('/about', routes.getCategory);

app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});
