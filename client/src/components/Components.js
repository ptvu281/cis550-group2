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