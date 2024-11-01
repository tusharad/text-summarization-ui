import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import ReactPaginate from 'react-paginate';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const [faqData, setFaqData] = useState<{ faq: string; freq: number; coverage_percentage: number; coverageDescription: string }[]>([]);
  const [stagingFaqData, setStagingFaqData] = useState<{ faq: string; coverage_percentage: number }[]>([]);
  const [faqPageNumber, setFaqPageNumber] = useState(0);
  const [visibleDescriptionIndex, setVisibleDescriptionIndex] = useState<number | null>(null);

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchFaqData = async () => {
      try {
        const response = await fetch('http://localhost:5000/get_faqs_with_freq');
        const data = await response.json();
        setFaqData(data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };

    const fetchStagingFaqData = async () => {
      try {
        const response = await fetch('http://localhost:5000/staging_faq');
        const data = await response.json();
        setStagingFaqData(data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };

    fetchFaqData();
    fetchStagingFaqData();
  }, []);

  const categories = {
    'Fully Covered': 0,
    'Majorly Covered': 0,
    'Partially Covered': 0,
    'Not Covered': 0,
  };

  stagingFaqData.forEach(stagingFaq => {
    if (stagingFaq.coverage_percentage === 100) categories['Fully Covered'] += 1;
    else if (stagingFaq.coverage_percentage > 80) categories['Majorly Covered'] += 1;
    else if (stagingFaq.coverage_percentage > 40) categories['Partially Covered'] += 1;
    else categories['Not Covered'] += 1;
  });

  const pieData = {
    labels: Object.keys(categories),
    datasets: [{
      label: 'SOP Coverage',
      data: Object.values(categories),
      backgroundColor: [
        '#4CAF50', // Green for Fully Covered
        '#2196F3', // Blue for Partially Covered
        '#FF9800', // Amber for Majorly Covered
        '#F44336', // Red for Not Covered
      ],
      hoverOffset: 2,
    }],
  };

  const displayFaqs = faqData.slice(faqPageNumber * itemsPerPage, (faqPageNumber + 1) * itemsPerPage);

  const handleFaqPageClick = ({ selected }: { selected: number }) => {
    setFaqPageNumber(selected);
  };

  const handleToggleDescription = (index: number) => {
    setVisibleDescriptionIndex(visibleDescriptionIndex === index ? null : index);
  };

  return (
    <div className="p-4 bg-white text-gray-900">
      <header className="flex justify-between items-center mb-6 p-6 border-b bg-red-600 text-white rounded-t-lg">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <Link to="/" className="bg-white text-red-500 px-4 py-2 rounded-lg shadow hover:bg-gray-300">
          Home
        </Link>
      </header>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-auto md:w-1/2">
          <h2 className="text-lg font-bold mb-2">Frequently Asked Questions</h2>
          <table className="w-full mb-4 border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-900 p-2">Question</th>
                <th className="border border-gray-900 p-2">Frequency</th>
                <th className="border border-gray-900 p-2">Coverage Percentage</th>
              </tr>
            </thead>
            <tbody>
              {displayFaqs.map((faq, index) => (
                <tr key={index}>
                  <td className="border border-gray-900 p-2">{faq.faq}</td>
                  <td className="border border-gray-900 p-2 text-center">{faq.freq}</td>
                  <td className="border border-gray-900 p-2 text-center">
                    {faq.coverage_percentage}%
                    <button
                      onClick={() => handleToggleDescription(index)}
                      className="ml-2 text-gray-500 hover:text-yellow-500 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faQuestionCircle} />
                    </button>
                    {visibleDescriptionIndex === index && (
                      <div className="text-sm text-gray-700 mt-1">
                        {faq.coverageDescription}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ReactPaginate
            pageCount={Math.ceil(faqData.length / itemsPerPage)}
            onPageChange={handleFaqPageClick}
            previousLabel={'Previous'}
            nextLabel={'Next'}
            containerClassName={'flex justify-center mb-4 space-x-2'}
            pageClassName={'px-3 py-1 border rounded-lg cursor-pointer hover:bg-red-100'}
            activeClassName={'bg-red-500 text-white'}
            breakClassName={'px-3 py-1'}
            previousClassName={'px-3 py-1 border rounded-lg cursor-pointer hover:bg-red-100'}
            nextClassName={'px-3 py-1 border rounded-lg cursor-pointer hover:bg-red-100'}
          />
        </div>
        <div className="flex-auto md:w-1/3">
          <h2 className="text-2xl font-bold mb-2">SOP Coverage vs Customer Queries</h2>
          <div className="w-full">
            <Pie data={pieData} />
          </div>
          <div className="mb-4">
            <ul className="list-disc ml-6">
              <li><span style={{ color: '#4CAF50' }}>Fully Covered</span>: 100%</li>
              <li><span style={{ color: '#2196F3' }}>Majorly Covered</span>: 80% and above</li>
              <li><span style={{ color: '#FF9800' }}>Partially Covered</span>: 40% to less than 80%</li>
              <li><span style={{ color: '#F44336' }}>Not Covered</span>: Less than 40%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

