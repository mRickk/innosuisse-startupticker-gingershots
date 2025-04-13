import React, { useRef, useState } from 'react'

import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import { Divider, Radio } from '@mui/material';

import { jsPDF } from 'jspdf';

import html2canvas from 'html2canvas';

import { Bar, Line, Bubble, Pie } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Benchmark = () => {
    const heatmapData = {
        labels: ['FinTech (ZH)', 'HealthTech (VD)', 'E-Com (GE)', 'AI (TI)'],
        datasets: [
            {
                label: 'Investments',
                data: [12, 8, 5, 10],
                backgroundColor: ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc'],
            },
        ],
    };

    const roiData = {
        labels: ['2020', '2021', '2022', '2023', '2024'],
        datasets: [
            {
                label: 'Portfolio Valuation (M)',
                data: [30, 45, 60, 80, 100],
                borderColor: '#4f46e5',
                fill: true,
                backgroundColor: 'rgba(79, 70, 229, 0.2)',
                tension: 0.4,
            },
        ],
    };

    const topBarData = {
        labels: ['Startup A', 'Startup B', 'Startup C'],
        datasets: [
            {
                label: 'Valuation Growth (x)',
                data: [3.2, 2.8, 2.5],
                backgroundColor: ['#4f46e5', '#6366f1', '#818cf8'],
            },
        ],
    };

    const timelineData = {
        labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
        datasets: [
            {
                label: 'Deals Per Year',
                data: [3, 5, 7, 10, 8, 12],
                borderColor: '#4f46e5',
                fill: true,
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                tension: 0.4,
            },
        ],
    };

    const genderPieData = {
        labels: ['Male CEOs', 'Female CEOs', 'Non-Binary / Other'],
        datasets: [
            {
                data: [70, 25, 5],
                backgroundColor: ['#4f46e5', '#f472b6', '#fcd34d'],
            },
        ],
    };

    const investorCharts = [
        {
            title: 'Investment Distribution by Sector & Canton',
            description:
                'A heatmap-like bar chart to visualize where investments are focused by sector or canton.',
            Chart: () => <Bar data={heatmapData} />,
        },
        {
            title: 'ROI or Post-Money Valuation Evolution',
            description:
                'Track the ROI or valuation trends for the investor’s portfolio over time.',
            Chart: () => <Line data={roiData} />,
        },
        {
            title: 'Top Performing Investments',
            description:
                'Rank investments by their valuation increase since initial funding.',
            Chart: () => <Bar data={topBarData} />,
        },
        {
            title: 'Deal Flow Over Time',
            description:
                'Show how the number of deals in the investor\'s portfolio has grown year over year.',
            Chart: () => <Line data={timelineData} />,
        },
        {
            title: 'Gender Diversity in Portfolio',
            description:
                'Visual representation of the gender diversity among CEOs in funded startups.',
            Chart: () => <Pie data={genderPieData} />,
        },
    ];


    const barData = {
        labels: ['Your Startup', 'Sector Avg'],
        datasets: [
            {
                label: 'Funding Amount',
                data: [5, 8],
                backgroundColor: ['#4f46e5', '#a5b4fc'],
            },
        ],
    };

    const lineData = {
        labels: ['Seed', 'Series A', 'Series B'],
        datasets: [
            {
                label: 'Your Valuation',
                data: [1, 5, 12],
                borderColor: '#4f46e5',
                tension: 0.4,
            },
            {
                label: 'Sector Avg',
                data: [2, 6, 10],
                borderColor: '#a5b4fc',
                borderDash: [5, 5],
                tension: 0.4,
            },
        ],
    };

    const bubbleData = {
        datasets: [
            {
                label: 'Investor Activity',
                data: [
                    { x: 1, y: 2, r: 10 },
                    { x: 2, y: 4, r: 20 },
                    { x: 3, y: 3, r: 15 },
                ],
                backgroundColor: '#4f46e5',
            },
        ],
    };

    const funnelData = {
        labels: ['Seed', 'Series A', 'Series B'],
        datasets: [
            {
                label: 'Average Funding (M)',
                data: [1, 5, 10],
                backgroundColor: ['#4f46e5', '#6366f1', '#818cf8'],
            },
        ],
    };

    const boxPlotData = {
        labels: ['Male CEO', 'Female CEO'],
        datasets: [
            {
                label: 'Funding Received',
                data: [5, 3],
                backgroundColor: ['#4f46e5', '#f472b6'],
            },
        ],
    };

    const chartsData = [
        {
            title: 'Funding Amount vs Sector Average',
            description:
                'Compare your startup’s funding with the sector or canton average to gauge relative performance.',
            Chart: () => <Bar data={barData} />,
        },
        {
            title: 'Valuation Over Time',
            description:
                'Track your startup’s valuation through different funding rounds and compare it with sector averages to see how it evolves.',
            Chart: () => <Line data={lineData} />,
        },
        {
            title: 'Investor Activity',
            description:
                'Visualize how many investors are involved per round and how the raised amounts compare to other startups.',
            Chart: () => <Bubble data={bubbleData} />,
        },
        {
            title: 'Phase-wise Performance',
            description:
                'Illustrate funding stages, such as Seed to Series A, with the average funding amounts at each phase.',
            Chart: () => <Bar data={funnelData} />,
        },
        {
            title: 'Gender CEO and Funding Correlation',
            description:
                'Show how funding differs across companies with male or female CEOs.',
            Chart: () => <Bar data={boxPlotData} />,
        },
    ];

    const chartRefs = useRef([]);

    const generatePDF = () => {
        const doc = new jsPDF();

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const title = 'Performance Report';
        const date = 'Generated on: ' + new Date().toLocaleDateString();

        doc.setFontSize(14);
        doc.text(title, pageWidth / 2, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.text(date, pageWidth / 2, 30, { align: 'center' });

        const chartWidth = 90;
        const chartHeight = 50;
        const padding = 10;
        const textFontSize = 10;
        const spacing = 60;

        doc.setFontSize(textFontSize);

        let yOffset = 40;

        const chartPromises = chartRefs.current.map((chartElement, index) => {
            return html2canvas(chartElement).then((canvas) => {
                if (yOffset + chartHeight + padding > pageHeight) {
                    doc.addPage();
                    yOffset = 20;
                }

                const imgData = canvas.toDataURL('image/png');
                doc.addImage(imgData, 'PNG', 10, yOffset, chartWidth, chartHeight);

                const wrappedTitle = doc.splitTextToSize(chartsData[index].title, pageWidth - chartWidth - 25);
                const wrappedDescription = doc.splitTextToSize(chartsData[index].description, pageWidth - chartWidth - 25);

                doc.setFontSize(10);
                doc.text(wrappedTitle, chartWidth + 20, yOffset + 10);

                doc.setFontSize(8);
                doc.text(wrappedDescription, chartWidth + 20, yOffset + 25);

                yOffset += spacing;
            });
        });

        Promise.all(chartPromises).then(() => {
            doc.save('report.pdf');
        });
    };

    const downloader = {
        handleDownload: (data, fileName) => {
            const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
        },
    };

    const [user, setUser] = React.useState('');

    const handleChangeUser = (event) => {
        setUser(event.target.value);
    };

    return (
        <div className='grid grid-cols-1 max-w-[60%] mx-auto'>
            <div className='flex flex-col items-center gap-10 pt-36'>
                <div className="flex flex-row justify-between items-center w-full px-5">
                    <div className="flex flex-row items-center gap-4">
                        <span className="text-sm font-bold">Which role best describes you?</span>
                        <FormControl>
                            <RadioGroup
                                row
                                name="row-radio-buttons-group"
                                onClick={handleChangeUser}
                                sx={{
                                    '& .MuiFormControlLabel-root': {
                                        fontSize: '14px',
                                    },
                                    '& .Mui-checked': {
                                        color: '#8B0000',
                                    },
                                    '& .MuiSvgIcon-root': {
                                        fontSize: '14px',
                                    },
                                }}
                            >
                                <FormControlLabel
                                    value="Investor"
                                    control={<Radio />}
                                    label={<span style={{ fontSize: '14px' }}>Investor</span>}
                                />
                                <FormControlLabel
                                    value="Founder"
                                    control={<Radio />}
                                    label={<span style={{ fontSize: '14px' }}>Founder</span>}
                                />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className='flex flex-row items-center gap-5'>
                        <button
                            className="text-white bg-black hover:bg-gray-800 h-8 hover:opacity-100 opacity-80 hover:text-red-600 items-center rounded-md text-xs py-2 px-4 transition-transform duration-100 ease-in-out active:scale-95"
                            onClick={() => downloader.handleDownload(lineData, 'data.json')}
                        >
                            Download Data
                        </button>
                        <button
                            className="text-white bg-black hover:bg-gray-800 h-8 hover:opacity-100 opacity-80 hover:text-red-600 items-center rounded-md text-xs py-2 px-4 transition-transform duration-100 ease-in-out active:scale-95"
                            onClick={generatePDF}
                        >
                            Generate report
                        </button>
                    </div>
                </div>

                <Divider orientation='horizontal' className="border border-gray-300 w-full" />

                <div className=" px-6 max-w-6xl mx-auto">
                    {
                        user && (user === 'Investor' ? investorCharts : chartsData).map(({ title, description, Chart }, index) => (
                            <div
                                key={title}
                                className={`flex flex-col py-10 md:flex-row items-center ${index % 2 !== 0 ? "md:flex-row-reverse" : ""
                                    } gap-12`}
                            >
                                <div
                                    className="chart-container flex-1 min-w-[300px]"
                                    ref={(el) => { chartRefs.current[index] = el }}
                                >
                                    <Chart />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold mb-2">{title}</h2>
                                    <p className="text-gray-600">{description}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default Benchmark
