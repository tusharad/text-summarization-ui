import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';


interface AutoSendDropdownProps {
    autoSend: boolean;
    threshold: number | null;
    setAutoSend: (value: boolean) => void;
    setThreshold: (value: number) => void;
    handleSetAutoSend: () => void;
}

const AutoSendDropdown: React.FC<AutoSendDropdownProps> = ({
    autoSend,
    threshold,
    setAutoSend,
    setThreshold,
    handleSetAutoSend,
}) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    return (
        <div className="relative flex items-center justify-end space-x-2 p-4">
            {/* Settings Button */}
            <button
                aria-label="Settings"
                className="bg-gray-100 text-red-500 px-4 py-2 font-semibold rounded-lg shadow transition-all hover:bg-gray-300"
                onClick={() => setDropdownOpen(!isDropdownOpen)}
            >
                <FontAwesomeIcon icon={faGear} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="absolute right-0 top-16 w-72 bg-white border border-gray-300 rounded-lg shadow-xl z-20 p-4 animate-fadeIn">
                    <label className="flex items-center space-x-3 text-lg">
                        <input
                            type="checkbox"
                            checked={autoSend}
                            onChange={(e) => setAutoSend(e.target.checked)}
                            className="form-checkbox text-red-500 focus:ring focus:ring-red-300"
                        />
                        <span className="text-gray-800">Auto send for SOP</span>
                    </label>

                    {/* Threshold Input */}
                    <div className="mt-4">
                        <label className={`block text-lg font-medium ${autoSend ? 'text-gray-900' : 'text-gray-400'}`}>
                            Set Threshold
                        </label>
                        <input
                            type="number"
                            value={(threshold && threshold !== 101) ? threshold : ''}
                            onChange={(e) => setThreshold(Number(e.target.value))}
                            className={`w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring ${autoSend ? 'border-gray-400'
                                : 'border-gray-300 bg-gray-100 cursor-not-allowed'}`}
                            disabled={!autoSend}
                            min="0"
                            max="100"
                            placeholder="%"
                        />
                    </div>

                    {/* Save Button */}
                    <button
                        className="mt-4 w-full bg-red-500 text-white px-4 py-2 font-bold rounded-lg shadow hover:bg-red-600 transition-all"
                        onClick={() => { handleSetAutoSend(); setDropdownOpen(false); }}
                    >
                        Save
                    </button>
                </div>
            )}
        </div>
    );
};

export default AutoSendDropdown;
