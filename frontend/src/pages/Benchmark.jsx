import React, { useState } from 'react'

import { Line, Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement,
} from 'chart.js';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import { Radio } from '@mui/material';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Benchmark = () => {

    const lineData = {
        labels: ['Page A', 'Page B', 'Page C', 'Page D', 'Page E', 'Page F', 'Page G'],
        datasets: [
            {
                label: 'Visitors',
                data: [4000, 3000, 2000, 2780, 1890, 2390, 3490],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
            {
                label: 'Page Views',
                data: [2400, 1398, 9800, 3908, 4800, 3800, 4300],
                fill: false,
                borderColor: 'rgb(153, 102, 255)',
                tension: 0.1,
            },
        ],
    };

    // Bar Chart Data
    const barData = {
        labels: ['Page A', 'Page B', 'Page C', 'Page D', 'Page E'],
        datasets: [
            {
                label: 'Visits',
                data: [4000, 3000, 2000, 2780, 1890],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Pie Chart Data
    const pieData = {
        labels: ['Group A', 'Group B', 'Group C', 'Group D'],
        datasets: [
            {
                data: [400, 300, 300, 200],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF8042'],
                hoverOffset: 4,
            },
        ],
    };

    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const handleToggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
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

    const [value, setValue] = React.useState('female');

    const handleChangeUser = (event) => {
        setValue(event.target.value);
    };

    return (
        <div className="flex justify-center items-center pt-44">
            <div className="px-4 sm:px-6 lg:px-8 w-full max-w-7xl">
                <div className="relative group container mx-auto">
                    <FormControl>
                        <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={value}
                            onChange={handleChangeUser}
                        >
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                        </RadioGroup>
                    </FormControl>
                    <div className="flex justify-end mb-3">
                        <button
                            className="text-white bg-black hover:bg-gray-800 rounded-md text-xs py-2 px-4"
                            onClick={() => downloader.handleDownload(lineData, 'data.json')}
                        >
                            Download Data
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-10">
                        <div className="bg-white border-2 border-gray-100 rounded-lg p-4 mb-10">
                            <h5 className="text-lg font-medium text-gray-800 mb-4">Total Transactions</h5>
                            <Line data={lineData} />
                        </div>

                        <div className="bg-white border-2 border-gray-100 rounded-lg p-4 mb-10">
                            <h5 className="text-lg font-medium text-gray-800 mb-4">Pending Transactions</h5>
                            <Bar data={barData} />
                        </div>

                        <div className="bg-white border-2 border-gray-100 rounded-lg p-4 mb-10">
                            <h5 className="text-lg font-medium text-gray-800 mb-4">Balance Distribution</h5>
                            <Pie data={pieData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Benchmark
