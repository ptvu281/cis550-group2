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




app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});
