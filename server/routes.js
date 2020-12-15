var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

/* ---- ONES WE ACTUALLY USE CLEAN UP REST LATER ---- */
//Raw Query runs 0.73s before optimization, time probably from front end putting in data table
//Version with temp table optimization is around 0.5s
function getRecs(req, res) {
  var inputLocation = req.params.location;
  var inputAge = req.params.age;
  var inputBenefit = req.params.benefit;
  var inputFamily = req.params.family;
  var query = `
  WITH b AS
  (SELECT PlanId AS planid, BenefitName AS benefit, Benefits.CopayOutofNetAmount AS copayoon, Benefits.CoinsOutofNet AS coinsoon
  FROM Benefits
  WHERE Benefits.Category = '${inputBenefit}'),

  r AS
  (SELECT PlanId AS planid, CAST(Rates.IndividualRate AS DECIMAL(10,2)) AS indvrate
  FROM Rates
  WHERE Rates.Age = '${inputAge}),

  n AS
  (SELECT PlanId AS planid, Network.NetworkName AS network
  FROM Plan JOIN Network ON Plan.IssuerId = Network.IssuerId
  WHERE Plan.StateCode = '${inputLocation}' AND Plan.BusinessYear = 2016),

  f AS
  (SELECT PlanId AS planid, CASE
    WHEN '${inputFamily}' = "Couple" THEN IFNULL(CAST(FamilyOption.Couple AS DECIMAL(10,2)), "No group rate found.")
    WHEN '${inputFamily}' = "Primary Subscriber And One Dependent" THEN IFNULL(CAST(FamilyOption.PrimarySubscriberAndOneDependent AS DECIMAL(10,2)), "No group rate found.")
    WHEN '${inputFamily}' = "Primary Subscriber And Two Dependents" THEN IFNULL(CAST(FamilyOption.PrimarySubscriberAndTwoDependents AS DECIMAL(10,2)), "No group rate found.")
    WHEN '${inputFamily}' = "Primary Subscriber And Three Or More Dependents" THEN IFNULL(CAST(FamilyOption.PrimarySubscriberAndThreeOrMoreDependents AS DECIMAL(10,2)), "No group rate found.")
    WHEN '${inputFamily}' = "Couple And One Dependent" THEN IFNULL(CAST(FamilyOption.CoupleAndOneDependent AS DECIMAL(10,2)), "No group rate found.")
    ELSE 'Not Applicable'
  END AS grouprate
  FROM FamilyOption)

  SELECT DISTINCT b.planid, benefit, network, copayoon, coinsoon, indvrate, grouprate
  FROM b JOIN r ON b.planid=r.planid JOIN n ON n.planid=b.planid LEFT OUTER JOIN f ON f.planid=b.planid
  ORDER BY benefit, indvrate ASC, grouprate ASC`;

  connection.query(query, function(err, rows, fields){
    if(err) console.log(err);
    else{
      res.json(rows)
    }
  })
};

//Managed to cut the time down to 4.39 seconds by using case when in the order by instead of
//calculating 3 seperate tables for each
function getBen1(req, res) {
  var inputYear = req.params.selectedYear;
  var inputOpt = req.params.selectedOption;
  var query = `
    SELECT Category, BenefitName, CAST(AVG(IndividualRate) AS DECIMAL(10,2)) AS avg
    FROM Benefits JOIN Rates ON Rates.PlanId = Benefits.PlanId
    WHERE BusinessYear = '${inputYear}'
    GROUP BY BenefitName
    ORDER BY
    CASE WHEN '${inputOpt}' = "Most Affordable Benefits" THEN avg END ASC,
    CASE WHEN '${inputOpt}' = "Most Expensive Benefits" THEN avg END DESC,
    CASE WHEN '${inputOpt}' = "Most Frequent Benefits" THEN COUNT(BenefitName) END DESC
    LIMIT 5`;
    
//3.71 seconds before
//2.39 seconds now
//Before data was set as each year as a column. This was much more inefficient
//And had much more joins. Now, we set it as years in one column, stat in the other for
//more efficient running.
function getBen2(req, res) {
  var inputBenefit = req.params.selectedBenefit;
  var inputStats = req.params.selectedStats;
  var query = `
  SELECT BusinessYear,
  CASE
  WHEN '${inputStats}' = 'Average' THEN CAST(AVG(IndividualRate) AS DECIMAL(10,2))
  WHEN '${inputStats}' = 'Min' THEN CAST(MIN(IndividualRate) AS DECIMAL(10,2))
  WHEN '${inputStats}' = 'Max' THEN CAST(MAX(IndividualRate) AS DECIMAL(10,2))
  END AS stat
  FROM Benefits JOIN Rates ON Rates.PlanId = Benefits.PlanId
  WHERE Benefits.Category = '${inputBenefit}'
  GROUP BY BusinessYear;`;

  connection.query(query, function(err, rows, fields){
    if(err) console.log(err);
    else{
      res.json(rows)
    }
  })
};

//Runs in like 0.19 seconds
function getState1(req, res) {
  var inputState = req.params.selectedState;
  var inputYear = req.params.selectedYear;
  var inputFreq = req.params.selectedFreq;

  var query = `
  SELECT DISTINCT Benefits.Category AS category, Benefits.BenefitName AS name
  FROM Benefits JOIN Plan ON Plan.PlanId=Benefits.PlanId
  WHERE Plan.StateCode = '${inputState}' AND Plan.BusinessYear = '${inputYear}'
  GROUP BY Benefits.BenefitName
  ORDER BY
  CASE WHEN '${inputFreq}' = "Least Frequent Plans" THEN COUNT(Benefits.BenefitName) END ASC,
  CASE WHEN '${inputFreq}' = "Most Frequent Plans" THEN COUNT(Benefits.BenefitName) END DESC
  LIMIT 5`;

  connection.query(query, function(err, rows, fields){
    if(err) console.log(err);
    else{
      res.json(rows);
      console.log(rows);
    }
  })
};

//Used temporary tables 2.4seconds
function getState2(req, res) {
  var inputState = req.params.selectedState2;
  var inputBenefit = req.params.selectedBenefit;

  var query = `
  WITH num_benefits_per_state AS
  (SELECT DISTINCT StateCode, COUNT(BenefitName) AS benefit_cnt
  FROM Plan JOIN Benefits ON Plan.PlanId=Benefits.PlanId
  WHERE Benefits.Category = '${inputBenefit}'
  GROUP BY StateCode),

  avg_benefits_nationwide AS
  (SELECT AVG(benefit_cnt) AS avg_benefit
  FROM num_benefits_per_state),

  states_with_above_avg_benefits AS
  (SELECT StateCode
  FROM num_benefits_per_state, avg_benefits_nationwide
  WHERE benefit_cnt > avg_benefit)

  SELECT Plan.StateCode AS state, Benefits.Category AS category,
  CAST(AVG(IndividualRate) AS DECIMAL(10,2)) AS individual,
  CAST(AVG(CopayOutofNetAmount) AS DECIMAL(10,2)) AS copay,
  CASE WHEN EXISTS (SELECT StateCode FROM states_with_above_avg_benefits  WHERE states_with_above_avg_benefits.StateCode = Plan.StateCode) THEN "Above Average # of Benefits" ELSE "Not Above Average # of Benefits" END AS above_average
  FROM Plan JOIN Benefits ON Plan.PlanId = Benefits.PlanId JOIN Rates ON Plan.PlanId = Rates.PlanId
  WHERE Plan.StateCode = '${inputState}' AND Benefits.Category = '${inputBenefit}'
  GROUP BY Plan.StateCode`;

  connection.query(query, function(err, rows, fields){
    if(err) console.log(err);
    else{
      res.json(rows)
    }
  })
};

function getProvider(req, res) {
  var inputState = req.params.selectedState;
  var inputYear = req.params.selectedYear;

  var query = `

  WITH tmp1 as(
		SELECT AfterJoin.NetworkName, MyBenefits.*
        FROM (SELECT BenefitName, PlanId, CopayOutofNetAmount, CoinsOutofNet
				FROM Benefits) MyBenefits
        JOIN (SELECT PlanId, NetworkName
				FROM (SELECT PlanId, IssuerId
						FROM Plan
						WHERE StateCode='${inputState}' AND BusinessYear = '${inputYear}') MyPlan
				JOIN (SELECT IssuerId, NetworkName
						FROM Network) MyNetwork
				ON MyNetwork.IssuerId = MyPlan.IssuerId) AfterJoin
		ON AfterJoin.PlanId = MyBenefits.PlanId
),

	total_count AS
  (SELECT tmp1.PlanId, tmp1.NetworkName, COUNT(tmp1.BenefitName) AS cnt
  FROM tmp1
  GROUP BY tmp1.NetworkName, tmp1.PlanId),

  avg_num_benefits AS
  (SELECT NetworkName, CEILING(AVG(cnt)) avg_num
  FROM total_count
  GROUP BY NetworkName)

  SELECT tmp1.NetworkName AS name,
  CAST(AVG(tmp1.CopayOutofNetAmount)AS DECIMAL(10,2)) AS avg_copay,
  CAST(AVG(tmp1.CoinsOutofNet) AS DECIMAL(10,2)) AS avg_coins,
  COUNT(tmp1.PlanId) AS num_plans,
  avg_num
  FROM tmp1
  JOIN avg_num_benefits ON avg_num_benefits.NetworkName=tmp1.NetworkName
  GROUP BY tmp1.NetworkName
  ORDER BY avg_num DESC, num_plans DESC;`;

  connection.query(query, function(err, rows, fields){
    if(err) console.log(err);
    else{
      res.json(rows)
    }
  })
};

function getCategory(req, res){
  var query = `
  WITH cte AS
  (
    SELECT Category, count(*) as num
    FROM Benefits
    Group by Category
  )
  SELECT Category, num/2777947 AS Percent
  FROM cte
  order by Percent desc
  limit 10
  `;

  connection.query(query, function(err, rows, fields){
    if(err) console.log(err);
    else{
      res.json(rows);
    }
  })
};


// The exported functions, which can be accessed in index.js.
module.exports = {
	getRecs: getRecs,
  getBen1: getBen1,
  getBen2: getBen2,
  getState1: getState1,
  getState2: getState2,
  getProvider: getProvider,
  getCategory: getCategory,
}
