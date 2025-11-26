import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";
import { getAffiliateUsersData } from "redux/actions/auth";
import { useSelector } from "react-redux";

const UserChart = ({ type = 'default', code }) => {
    const authData = useSelector((state) => state.authentication);

    const [options, setOptions] = useState({
        chart: {
            id: 'basic-bar',
            type: 'line',
            zoom: {
                enabled: false
            },
            width: '100%',
            height: 294
        },
        xaxis: {
            type: 'category',
            categories: [],
            tickPlacement: 'between',
            labels: {
                style: {
                    fontSize: '12px',
                    fontFamily: 'Styrene A Web',
                    colors: new Array(30).fill('#FFF')
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: '12px',
                    fontFamily: 'Styrene A Web',
                    colors: new Array(5).fill('#FFF')
                }
            }
        },
        title: {
            text: '',
            align: 'left'
        },
        tooltip: {
            enabled: false
        },
        markers: {
            size: [5],
            shape: 'circle',
            radius: 3
        }
    });
    const [series, setSeries] = useState([
        {
            name: 'Users',
            data: []
        }
    ]);

    useEffect(() => {
        initOptionData();
        initFunc();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        ApexCharts.exec('basic-bar', 'updateSeries', series);
        // eslint-disable-next-line
    }, [series]);

    useEffect(() => {
        ApexCharts.exec('basic-bar', 'updateOptions', options);
        // eslint-disable-next-line
    }, [options]);

    const initFunc = async () => {
        if (authData.isAuth) {
            let request = {
                userId: authData.userData._id,
                type: type
            };
            if (type === 'custom') {
                request.campaignCode = {
                    code
                };
            }

            const response = await getAffiliateUsersData(request);
            if (response.status) {
                let seriesData = [...series];
                seriesData[0].data = response.data;
                setSeries([...seriesData]);
            }
        }
    };

    const initOptionData = () => {
        let days = 30;
        let startDate = new Date();
        startDate.setDate(startDate.getDate() - days + 1);

        let optionData = { ...options };
        let categories = new Array(days);
        for (let i = 0; i < days; i++) {
            categories[i] = startDate.getDate();
            startDate.setDate(startDate.getDate() + 1);
        }

        optionData.xaxis.categories = categories;
        optionData.xaxis.tickPlacement = 'between';
        setOptions({ ...optionData });
    };

    return (
        <Chart options={options} series={series} />
    )
}

export default UserChart;
