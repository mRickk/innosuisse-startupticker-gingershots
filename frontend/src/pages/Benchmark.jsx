import React, { useEffect, useRef, useState } from 'react'

import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import { Divider, InputLabel, MenuItem, Radio, Select } from '@mui/material';

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
    const fetchData = async (endpoint) => {
        try {
            const response = await fetch(`http://localhost:8000/${endpoint}/`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            console.log('Fetched data:', data);
            return data;
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    };

    const [swissData, setSwissData] = useState(null);

    const [globalData, setGlobalData] = useState(null)

    useEffect(() => {
        fetchData("data-swiss").then(data => {
            if (data) setSwissData(data);
        });
        fetchData("data-world").then(data => {
            if (data) setGlobalData(data);
        });
    }, []);


    const heatmap = {};
    swissData.forEach(row => {
        const industry = row.Industry || 'Unknown';
        const canton = row.Canton || 'Unknown';

        const key = `${industry}-${canton}`;
        heatmap[key] = (heatmap[key] || 0) + row.Amount;
    });

    const chartData = Object.entries(heatmap).map(([key, value]) => {
        const [sector, canton] = key.split('-');
        return { sector, canton, value };
    });

    const heatmapData = {
        labels: chartData.map(item => `${item.sector} (${item.canton})`),
        datasets: [
            {
                label: 'Investments',
                data: chartData.map(item => item.value),
                backgroundColor: ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc',
                    '#f472b6', '#f9a8d4', '#fcb0b1', '#fcd34d',
                    '#22c55e', '#34d399', '#10b981', '#16a34a',
                    '#f97316', '#fb923c', '#f59e0b', '#fbbf24',],
            },
        ],
    };
    /*
        investorPortfolio = swissData.filter(row => row.Investors.includes(investorName));
        const valuationTimeline = investorPortfolio.map(row => ({
            date: new Date(row['Date of the funding round']),
            valuation: row.Valuation
        })).sort((a, b) => a.date - b.date);
    */
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
    const investments = swissData.map(row => ({
        company: row.Company,
        valuation: row.Valuation,
        amount: row.Amount,
        growth: row.Valuation / row.Amount
    }));

    const topPerformers = investments
        .sort((a, b) => b.growth - a.growth)
        .slice(0, 10);

    const topBarData = {
        labels: topPerformers.map(p => p.company),
        datasets: [
            {
                label: 'Valuation Growth (x)',
                data: topPerformers.map(p => p.growth.toFixed(2)),
                backgroundColor: topPerformers.map((_, i) => `hsl(${i * 36}, 70%, 60%)`),
            },
        ],
    };


    const dealsByMonth = {};

    swissData.forEach(row => {
        const date = new Date(row['Date of the funding round']);
        const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
        dealsByMonth[month] = (dealsByMonth[month] || 0) + 1;
    });

    const dealsByYear = Object.entries(dealsByMonth).reduce((acc, [month, count]) => {
        const year = month.split('-')[0];
        acc[year] = (acc[year] || 0) + count;
        return acc;
    }, {});

    const timelineData = {
        labels: Object.keys(dealsByYear).sort(),
        datasets: [
            {
                label: 'Deals Per Year',
                data: Object.values(dealsByYear),
                borderColor: '#4f46e5',
                fill: true,
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                tension: 0.4,
            },
        ],
    };


    const CEOByGender = { Male: [], Female: [], Other: [] };

    swissData.forEach(row => {
        if (row['Gender CEO'] === 'Male' || row['Gender CEO'] === 'Female' || row['Gender CEO'] === 'Other') {
            fundingByGender[row['Gender CEO']].push(row.Amount);
        }
    });

    const genderCounts = {
        Male: CEOByGender.Male.length,
        Female: CEOByGender.Female.length,
        Other: CEOByGender.Other.length,
    };

    const genderPieData = {
        labels: ['Male CEOs', 'Female CEOs', 'Non-Binary / Other'],
        datasets: [
            {
                data: [genderCounts.Male, genderCounts.Female, genderCounts.Other],
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


    const sectorFunding = {};
    swissData.forEach(row => {
        const sector = row.Industry;
        if (!sectorFunding[sector]) sectorFunding[sector] = [];
        sectorFunding[sector].push(row.raised_amount_usd);
    });

    const averageFundingBySector = Object.entries(sectorFunding).map(([sector, amounts]) => ({
        sector,
        avgFunding: amounts.reduce((a, b) => a + b, 0) / amounts.length
    }));

    /*const yourStartupFunding = {
        sector: yourSector,
        funding: yourFundingAmount
    };

    const sectorAvgFunding = averageFundingBySector.find(item => item.sector === yourSector)?.avgFunding || 0;

    const barData = {
        labels: ['Your Startup', 'Sector Avg'],
        datasets: [
            {
                label: 'Funding Amount',
                data: [yourStartupFunding.funding, sectorAvgFunding],
                backgroundColor: ['#4f46e5', '#a5b4fc'],
            },
        ],
    };

    const valuationOverTime = globalData
        .filter(row => row.org_name === yourStartupName)
        .map(row => ({
            date: new Date(row.announced_on), // Convert the announcement date to Date object
            valuation: row.post_money_valuation_usd // Use USD for valuation
        }))
        .sort((a, b) => a.date - b.date); // Sort by date

    // Calculate sector average valuations (assumed sector is stored in 'Industry' or another field)
    const sectorValuationOverTime = globalData
        .filter(row => row.Industry === yourStartupSector) // Filter for startups in the same sector
        .map(row => ({
            date: new Date(row.announced_on),
            valuation: row.post_money_valuation_usd
        }))
        .sort((a, b) => a.date - b.date);
        
    // Calculate average valuation per round for the sector (for simplicity, we calculate for all rows)
    const averageSectorValuation = sectorValuationOverTime.reduce((acc, curr) => {
        const round = curr.date.getFullYear(); // Assume each row represents a different round
        if (!acc[round]) acc[round] = { total: 0, count: 0 };
        acc[round].total += curr.valuation;
        acc[round].count += 1;
        return acc;
    }, {});
    
    const sectorAvgData = Object.entries(averageSectorValuation).map(([round, data]) => ({
        round: round,
        avgValuation: data.total / data.count
    }));

    const lineData = {
        labels: ['Seed', 'Series A', 'Series B'],
        datasets: [
            {
                label: 'Your Valuation',
                data: valuationOverTime.map(item => item.valuation),
                borderColor: '#4f46e5',
                tension: 0.4,
            },
            {
                label: 'Sector Avg',
                data: sectorAvgData.map(item => item.avgValuation),
                borderColor: '#a5b4fc',
                borderDash: [5, 5],
                tension: 0.4,
            },
        ],
    };*/


    const investorRounds = globalData.map(row => ({
        round: row.name,
        investors: row.investor_count,
        amount: row.raised_amount_usd,
    }));

    // Add additional bubble data manually or with more rows
    const moreInvestorRounds = [
        { round: 'Round X', investors: 15, amount: 5000000 },
        { round: 'Round Y', investors: 30, amount: 25000000 },
        { round: 'Round Z', investors: 5, amount: 1000000 },
        { round: 'Round W', investors: 25, amount: 15000000 },
        { round: 'Round V', investors: 20, amount: 12000000 },
        { round: 'Round U', investors: 10, amount: 3000000 },
    ];

    // Merge the original data and the additional rounds
    const allInvestorRounds = investorRounds.concat(moreInvestorRounds);

    // Bubble Chart Data
    const bubbleData = {
        datasets: [
            {
                label: 'Investor Activity',
                data: allInvestorRounds.map(round => ({
                    x: round.investors, // Number of investors on the x-axis
                    y: round.amount / 1000000, // Raised amount in millions for scale (optional)
                    r: round.amount / 5000000, // Bubble size (scaled, adjust as needed)
                })),
                backgroundColor: round => {
                    return round.amount > 10000000 ? '#4f46e5' : '#6366f1';
                },
            },
        ],
    };


    const phaseFunding = {};
    globalData.forEach(row => {
        const phase = row.name;
        if (!phaseFunding[phase]) phaseFunding[phase] = [];
        phaseFunding[phase].push(row.raised_amount_usd);
    });

    // Calculate Average Funding per Phase
    const avgFundingPerPhase = Object.entries(phaseFunding).map(([phase, amounts]) => ({
        phase,
        avgFunding: amounts.reduce((a, b) => a + b, 0) / amounts.length
    }));

    // Funnel Data Preparation (Dynamic phase extraction from the dataset)
    const funnelData = {
        labels: avgFundingPerPhase.map(item => item.phase), // Extract phase labels dynamically
        datasets: [
            {
                label: 'Average Funding (USD)',
                data: avgFundingPerPhase.map(item => item.avgFunding / 1000000), // Convert to millions for better visualization
                backgroundColor: ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc'], // Color for each phase
            },
        ],
    };


    const fundingByGender = { Male: [], Female: [] };

    swissData.forEach(row => {
        if (row['Gender CEO'] === 'Male' || row['Gender CEO'] === 'Female') {
            fundingByGender[row['Gender CEO']].push(row.Amount);
        }
    });

    function calculateBoxPlotStats(fundingAmounts) {
        fundingAmounts.sort((a, b) => a - b);

        const min = fundingAmounts[0];
        const max = fundingAmounts[fundingAmounts.length - 1];
        const median = fundingAmounts[Math.floor(fundingAmounts.length / 2)];
        const q1 = fundingAmounts[Math.floor(fundingAmounts.length / 4)];
        const q3 = fundingAmounts[Math.floor(fundingAmounts.length * 3 / 4)];

        return [min, q1, median, q3, max];
    }

    const maleStats = calculateBoxPlotStats(fundingByGender['Male']);
    const femaleStats = calculateBoxPlotStats(fundingByGender['Female']);

    const boxPlotData = {
        labels: ['Male CEO', 'Female CEO'],
        datasets: [
            {
                label: 'Funding Distribution',
                data: [
                    {
                        min: maleStats[0],
                        q1: maleStats[1],
                        median: maleStats[2],
                        q3: maleStats[3],
                        max: maleStats[4]
                    },
                    {
                        min: femaleStats[0],
                        q1: femaleStats[1],
                        median: femaleStats[2],
                        q3: femaleStats[3],
                        max: femaleStats[4]
                    }
                ],
                backgroundColor: ['#4f46e5', '#f472b6'],
            },
        ],
    };

    const chartsData = [
        /*{
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
        },*/
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

    const [userName, setUserName] = React.useState('');

    const handleChange = (event) => {
        setUserName(event.target.value);
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

                    <div>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120, border: "hidden" }}>
                            <InputLabel id="demo-simple-select-standard-label">Age</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={userName}
                                onChange={handleChange}
                                label="Age"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {swissData.Title 
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <div className='flex flex-row items-center gap-5'>
                        <button
                            className="text-white bg-black hover:bg-gray-800 h-8 hover:opacity-100 opacity-80 hover:text-red-600 items-center rounded-md text-xs py-2 px-4 transition-transform duration-100 ease-in-out active:scale-95"
                            onClick={() => downloader.handleDownload(NaN, 'data.json')}
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
