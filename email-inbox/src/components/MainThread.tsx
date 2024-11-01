import React, { useEffect, useState } from 'react';
import { Thread } from '../types';
import Email from './Email.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

interface MainThreadProps {
  thread: Thread | null;
  onSummarize: (thread_id: number) => void;
  onGetSop: (thread_id: number) => void;
  onToggleEmail: (threadIndex: number, emailIndex: number) => void;
  currentThreadIndex: number;
  onReply: (senderEmail: string, threadId: number) => void;
}

const MainThread: React.FC<MainThreadProps> = ({ thread, onSummarize, onToggleEmail, currentThreadIndex, onReply, onGetSop }) => {
  const [autoSend, setAutoSend] = useState<boolean>(false);
  const [threshold, setThreshold] = useState<number | null>(null);
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchAutoSend = async () => {
      try {
        const response = await fetch('http://localhost:5000/get_auto_send');
        const data = await response.json();
        setAutoSend(data.isAutoSend);
        setThreshold(data.thresholdVal);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    }
    fetchAutoSend();
  },[])

  const handleSetAutoSend = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/set_auto_send/${autoSend}/${threshold}`);
    } catch (error) {
      console.error('Error setting up threshold:', error);
    }
  };

  return (
    thread ? (
      <>
        <div className="w-full px-3 py-2 mx-auto">
          <div className="flex flex-wrap -mx-3">
            <div className="w-full max-w-full mb-6">
              <div className="relative flex flex-col min-w-0 break-words bg-gray-200 rounded-2xl bg-clip-border">
                <div className="h-full overflow-y-auto" id="main-thread">
                  <div className="absolute top-12 right-8 flex space-x-2">
                    <button
                      className="bg-gray-100 text-red-500 px-4 font-bold py-2 rounded-lg shadow hover:from-red-800 hover:bg-gray-300"
                      onClick={() => onSummarize(thread.threadId)}
                    >
                      Summarize
                    </button>
                  </div>
                  <div className="absolute top-12 right-72 flex space-x-2 px-2">
                      <button
                        className="bg-gray-100 text-red-500 px-4 font-bold py-2 rounded-lg shadow hover:from-red-800 hover:bg-gray-300"
                        onClick={() => setDropdownOpen(!isDropdownOpen)}
                      >
                        <FontAwesomeIcon icon={faGear} />
                      </button>
                      <div
                        className={`absolute right-0 mt-11 w-60 bg-white border border-gray-300 rounded-lg shadow-lg z-10 transition-all duration-300 ease-in-out transform ${
                          isDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                        }`}
                      >
                        <div className="p-4">
                          <label className="flex items-center space-x-4">
                            <input
                              type="checkbox"
                              checked={autoSend}
                              onChange={(e) => setAutoSend(e.target.checked)}
                              className="form-checkbox"
                            />
                            <span>Auto-send for SOP</span>
                          </label>
                          <div className="mt-2">
                            <label className={(autoSend) ? 'text-gray-900' : 'text-gray-500'}>
                              Set threshold
                              <input
                                type="number"
                                value={threshold ?? ''}
                                onChange={(e) => setThreshold(Number(e.target.value))}
                                className="ml-2 p-1 border border-gray-900 rounded"
                                disabled={!autoSend}
                                min="0"
                                max="100"
                                placeholder="%"
                              />
                            </label>
                            <button className='bg-gray-100 text-red-500 px-4 font-bold py-2 rounded-lg shadow hover:from-red-800 hover:bg-gray-300'
                               onClick={() => { handleSetAutoSend(); setDropdownOpen(!isDropdownOpen)} }
                            >
                              save
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  <div className="absolute top-12 right-40">
                    <button
                      className="bg-gray-100 text-red-500 px-4 font-bold py-2 rounded-lg shadow hover:from-red-800 hover:bg-gray-300"
                      onClick={() => onGetSop(thread.threadId)}
                    >
                      Smart Reply
                    </button>
                  </div>
                  <div className="p-6 bg-gray-200">
                    <div className="p-6 border-b bg-red-600 text-white rounded-t-lg">
                      <h1 className="text-2xl text-white font-semibold">{thread.threadTitle}</h1>
                    </div>
                    {thread.emails.map((email, index) => (
                      <Email
                        key={index}
                        threadId={thread.threadId}
                        indexKey={index}
                        email={email}
                        onToggle={() => onToggleEmail(currentThreadIndex, index)}
                        onReply={onReply}
                        autoSend={autoSend}
                        threshold={threshold}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    ) : (
      <div className="w-full px-3 py-2 mx-auto">No threads found :(</div>
    )
  );
};

export default MainThread;
