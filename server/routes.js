var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

/* ---- ONES WE ACTUALLY USE CLEAN UP REST LATER ---- */
function getRecs(req, res) {
  var inputLocation = req.params.location;
  var inputAge = req.params.age;
  var inputBenefit = req.params.benefit;
  var inputFamily = req.params.family;
  var query = `
    SELECT DISTINCT Plan.PlanId AS planid, Benefits.BenefitName AS benefit, Network.NetworkName AS network,
    Benefits.CopayOutofNetAmount AS copayoon, Benefits.CoinsOutofNet AS coinsoon, CAST(Rates.IndividualRate AS DECIMAL(10,2)) AS indvrate,
    CASE
      WHEN '${inputFamily}' = "Couple" THEN IFNULL(CAST(FamilyOption.Couple AS DECIMAL(10,2)), "No group rate found.")
      WHEN '${inputFamily}' = "Primary Subscriber And One Dependent" THEN IFNULL(CAST(FamilyOption.PrimarySubscriberAndOneDependent AS DECIMAL(10,2)), "No group rate found.")
      WHEN '${inputFamily}' = "Primary Subscriber And Two Dependents" THEN IFNULL(CAST(FamilyOption.PrimarySubscriberAndTwoDependents AS DECIMAL(10,2)), "No group rate found.")
      WHEN '${inputFamily}' = "Primary Subscriber And Three Or More Dependents" THEN IFNULL(CAST(FamilyOption.PrimarySubscriberAndThreeOrMoreDependents AS DECIMAL(10,2)), "No group rate found.")
      WHEN '${inputFamily}' = "Couple And One Dependent" THEN IFNULL(CAST(FamilyOption.CoupleAndOneDependent AS DECIMAL(10,2)), "No group rate found.")
      ELSE 'Not Applicable'
    END AS grouprate
    FROM Plan JOIN Rates ON Plan.PlanId = Rates.PlanId
    JOIN Benefits ON Plan.PlanId = Benefits.PlanId
    LEFT OUTER JOIN FamilyOption ON Plan.PlanId = FamilyOption.PlanId
    JOIN Network ON Plan.IssuerId = Network.IssuerId
    WHERE Plan.StateCode = '${inputLocation}' AND
    Rates.Age = '${inputAge}' AND
    Benefits.Category = '${inputBenefit}'
    AND Plan.BusinessYear = 2016
    ORDER BY benefit, indvrate ASC, grouprate ASC`;

  connection.query(query, function(err, rows, fields){
    if(err) console.log(err);
    else{
      res.json(rows)
    }
  })
};

//Managed to cut the time down to ~5 seconds
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

  connection.query(query, function(err, rows, fields){
    if(err) console.log(err);
    else{
      res.json(rows)
    }
  })
};

function getBen2(req, res) {
  var inputBenefit = req.params.selectedBenefit;
  var inputStats = req.params.selectedStats;
  var query = `
  WITH 2014_stats AS
  (SELECT
  CASE
  WHEN	 '${inputStats}' = 'Average' THEN CAST(AVG(IndividualRate) AS DECIMAL(10,2))
  WHEN '${inputStats}' = 'Min' THEN CAST(MIN(IndividualRate) AS DECIMAL(10,2))
  WHEN '${inputStats}' = 'Max' THEN CAST(MAX(IndividualRate) AS DECIMAL(10,2))
  END AS four
  FROM Benefits JOIN Rates ON Rates.PlanId = Benefits.PlanId
  WHERE Benefits.Category = '${inputBenefit}' AND BusinessYear = 2014),

  2015_stats AS
  (SELECT
  CASE
  WHEN	 '${inputStats}' = 'Average' THEN CAST(AVG(IndividualRate) AS DECIMAL(10,2))
  WHEN '${inputStats}' = 'Min' THEN CAST(MIN(IndividualRate) AS DECIMAL(10,2))
  WHEN '${inputStats}' = 'Max' THEN CAST(MAX(IndividualRate) AS DECIMAL(10,2))
  END AS five
  FROM Benefits JOIN Rates ON Rates.PlanId = Benefits.PlanId
  WHERE Benefits.Category = '${inputBenefit}' AND BusinessYear = 2015),

  2016_stats AS
  (SELECT
  CASE
  WHEN	 '${inputStats}' = 'Average' THEN CAST(AVG(IndividualRate) AS DECIMAL(10,2))
  WHEN '${inputStats}' = 'Min' THEN CAST(MIN(IndividualRate) AS DECIMAL(10,2))
  WHEN '${inputStats}' = 'Max' THEN CAST(MAX(IndividualRate) AS DECIMAL(10,2))
  END AS six
  FROM Benefits JOIN Rates ON Rates.PlanId = Benefits.PlanId
  WHERE Benefits.Category = '${inputBenefit}' AND BusinessYear = 2016)

  SELECT 2014_stats.four, 2015_stats.five, 2016_stats.six
  FROM 2014_stats, 2015_stats, 2016_stats`;

  connection.query(query, function(err, rows, fields){
    if(err) console.log(err);
    else{
      res.json(rows)
    }
  })
};

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
  GROUP BY Plan.StateCode;`;

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

  WITH total_count AS
  (SELECT Plan.PlanId, Network.NetworkName, COUNT(BenefitName) AS cnt
  FROM Plan
  JOIN Network ON Network.IssuerId=Plan.IssuerId
  JOIN Benefits ON Plan.PlanId = Benefits.PlanId
  WHERE Plan.StateCode = '${inputState}'
  AND Plan.BusinessYear = '${inputYear}'
  GROUP BY NetworkName, PlanId
  ORDER BY COUNT(BenefitName) DESC),

  avg_num_benefits AS
  (SELECT NetworkName, CEILING(AVG(cnt)) avg_num
  FROM total_count
  GROUP BY NetworkName)

  SELECT Network.NetworkName AS name,
  CAST(AVG(CopayOutofNetAmount)AS DECIMAL(10,2)) AS avg_copay,
  CAST(AVG(CoinsOutofNet) AS DECIMAL(10,2)) AS avg_coins,
  COUNT(Plan.PlanId) AS num_plans,
  avg_num
  FROM Network
  JOIN Plan ON Network.IssuerId=Plan.IssuerId
  JOIN Benefits ON Plan.PlanId = Benefits.PlanId
  JOIN avg_num_benefits ON avg_num_benefits.NetworkName=Network.NetworkName
  WHERE Plan.StateCode = '${inputState}'
  AND Plan.BusinessYear = '${inputYear}'
  GROUP BY Network.NetworkName
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
