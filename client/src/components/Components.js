import React from "react";
import Chart from "react-apexcharts";

export const Category = (props) => {
    return (
        <Chart
            options=  {{
                labels: props.labels,
                colors: ["#378aff", "#fba330", "#f54f52", "#92f03b", "#9552ea",
                    "#0c3f5c", "#58508d", "#bc5090", "#fb6361", "#fba600",
                    "#c608d1", "#fe02fe", "#fe77fd", "#fea9fd", "#2900a5"
                ]
            }}
            series={props.series}
            type="pie"
            height={props.height}
        />
    );
};

export const RevenueBar = (props) => {

    var labelFormatter = function(value) {
        var val = Math.abs(value);
        if (val >= 1000) {
            val = (val / 1000).toFixed(2) + "k";
        }
        return val;
    };



    return (
        <div>
            <h3 className="h5">Yearly Change </h3>
            <Chart
                options= {{
                    chart: {
                        type: 'line',
                    },
                    stroke: {
                        width: [4, 4, 4],
                    },
                    colors: ["#fbbc45", "#40a0fc", "#37e7a5"],
                    dataLabels: {
                        enabled: true,
                        enabledOnSeries: []
                    },
                    labels: props.labels,
                    xaxis: {
                        type: "category",
                    },
                    yaxis: [
                        {
                          min: 70,
                          max: 200,
                          opposite: true,
                          tickAmount: 4,
                          seriesName: "Individual Rate",
                        },
                        {
                          min: 10000,
                          max: 32000,
                          seriesName: "Plan Num",
                          tickAmount: 4,
                          labels: {
                            formatter: labelFormatter,
                          }
                        },
                        {
                          seriesName: "Issuer-Network Num",
                          show: false,
                        },
                    ]
                }}
                series={[
                    {
                        name: 'Individual Rate',
                        type: 'line',
                        data: props.individualRate
                    },
                    {
                        name: 'Plan Num',
                        type: 'column',
                        data: props.planNum
                    },{
                        name: 'Issuer-Network Num',
                        type: 'column',
                        data: props.issuerNetworkNum
                    },
                ]}
                type="line"
            />
        </div>
    );
}

export const SalaryBar = (props) => {

    return (
        <div>
            <h3 className="h5">Plan Number VS State</h3>
            <Chart
                options= {{
                    chart: {
                        type: 'line',
                    },
                    colors: ["#43335a"],
                    dataLabels: {
                        enabled: false,
                        enabledOnSeries: [0]
                    },
                    labels: props.labels,
                    xaxis: {
                        type: 'Plan Num'
                    },
                    yaxis: [
                        {
                          min: 2000,
                          max: 7500,
                          tickAmount: 6,
                          seriesName: "Salary",
                        }
                    ]
                }}
                series={[
                    {
                        name: 'Salary',
                        type: 'column',
                        data: props.salaryData
                    }
                ]}
                type="line"
            />
        </div>
    );
}