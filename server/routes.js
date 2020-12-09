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
    Benefits.CopayOutofNetAmount AS copayoon, Benefits.CoinsOutofNet AS coinsoon, Rates.IndividualRate AS indvrate,
    CASE
      WHEN '${inputFamily}' = "Couple" THEN IFNULL(FamilyOption.Couple, "No group rate found.")
      WHEN '${inputFamily}' = "Primary Subscriber And One Dependent" THEN IFNULL(FamilyOption.PrimarySubscriberAndOneDependent, "No group rate found.")
      WHEN '${inputFamily}' = "Primary Subscriber And Two Dependents" THEN IFNULL(FamilyOption.PrimarySubscriberAndTwoDependents, "No group rate found.")
      WHEN '${inputFamily}' = "Primary Subscriber And Three Or More Dependents" THEN IFNULL(FamilyOption.PrimarySubscriberAndThreeOrMoreDependents, "No group rate found.")
      WHEN '${inputFamily}' = "Couple And One Dependent" THEN IFNULL(FamilyOption.CoupleAndOneDependent, "No group rate found.")
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

//This is very long and takes 9 seconds. We should try to cut this down somehow.
function getBen1(req, res) {
  var inputYear = req.params.selectedYear;
  var inputOpt = req.params.selectedOption;
  var query = `
    WITH max_avg_copay AS
    (SELECT Category, BenefitName, CAST(AVG(IndividualRate) AS DECIMAL(10,2)) AS avg, 0 AS cnt, "Most Expensive Benefits" AS table_type
    FROM Benefits JOIN Rates ON Rates.PlanId = Benefits.PlanId
    WHERE BusinessYear = '${inputYear}'
    GROUP BY BenefitName
    ORDER BY avg DESC
    LIMIT 5),

    min_avg_copay AS
    (SELECT Category,  BenefitName, CAST(AVG(IndividualRate) AS DECIMAL(10,2)) AS avg, COUNT(BenefitName) AS cnt, "Most Affordable Benefits" AS table_type
    FROM Benefits JOIN Rates ON Rates.PlanId = Benefits.PlanId
    WHERE BusinessYear = '${inputYear}'
    GROUP BY BenefitName
    ORDER BY avg ASC, cnt DESC
    LIMIT 5),

    freq_benefits AS
    (SELECT Category,  BenefitName,  CAST(AVG(IndividualRate) AS DECIMAL(10,2)) AS avg, COUNT(BenefitName) AS cnt, "Most Frequent Benefits" AS table_type
    FROM Benefits JOIN Rates ON Rates.PlanId = Benefits.PlanId
    WHERE BusinessYear = '${inputYear}'
    GROUP BY BenefitName
    ORDER BY cnt DESC
    LIMIT 5),

    big_table AS
    (SELECT * FROM freq_benefits
    UNION
    SELECT * FROM min_avg_copay
    UNION
    SELECT * FROM max_avg_copay)

    SELECT Category, BenefitName, avg
    FROM big_table
    WHERE  big_table.table_type = '${inputOpt}'`;

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

// The exported functions, which can be accessed in index.js.
module.exports = {
	getRecs: getRecs,
  getBen1: getBen1,
  getBen2: getBen2
}
