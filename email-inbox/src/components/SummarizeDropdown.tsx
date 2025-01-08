import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface SummarizeDropdownProps {
    onSummarize: (threadId: number, type?: string) => void;
    threadId: number;
}

const SummarizeDropdown: React.FC<SummarizeDropdownProps> = ({ onSummarize, threadId }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    return (
        <div className="">
            <button
                aria-label="Summarize"
                className="bg-gray-100 text-red-500 px-2 py-2 font-semibold rounded-s-lg shadow transition-all hover:bg-gray-200"
                onClick={() => onSummarize(threadId)}
            >
                Summarize
            </button>

            <button
                aria-label="Open summarize options"
                className="bg-gray-100 text-red-500 px-2 py-2 font-semibold rounded-e-lg shadow transition-all hover:bg-gray-200"
                onClick={() => setDropdownOpen(!isDropdownOpen)}
            >
                <FontAwesomeIcon icon={faChevronDown} />
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white border border-red-500 rounded-lg shadow-lg z-20 p-2">
                    <ul>
                        <li
                            className="p-2 text-red-500 font-bold hover:bg-gray-300 cursor-pointer border-b border-red-300"
                            onClick={() => { setDropdownOpen(false); onSummarize(threadId, 'convert_to_spanish'); }}
                        >
                            Summarize in Spanish
                        </li>
                        <li
                            className="p-2 text-red-500 font-bold hover:bg-gray-300 cursor-pointer border-b border-red-300"
                            onClick={() => { setDropdownOpen(false); onSummarize(threadId, 'corporate_email'); }}
                        >
                            Summarize for Corporate Email
                        </li>
                        <li
                            className="p-2 text-red-500 font-bold hover:bg-gray-300 cursor-pointer"
                            onClick={() => onSummarize(threadId, 'customer_support')}
                        >
                            Summarize for Customer Support
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SummarizeDropdown;
