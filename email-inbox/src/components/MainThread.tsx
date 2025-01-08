import React, { useEffect, useState } from 'react';
import { Thread } from '../types';
import Email from './Email.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import AutoSendDropdown from './AutoSendDropdown.tsx';
import SummarizeDropdown from './SummarizeDropdown.tsx';

interface MainThreadProps {
    thread: Thread | null;
    onSummarize: (thread_id: number, option?: string) => void;
    onGetSop: (thread_id: number) => void;
    onToggleEmail: (threadIndex: number, emailIndex: number) => void;
    currentThreadIndex: number;
    onReply: (senderEmail: string, threadId: number) => void;
}

const MainThread: React.FC<MainThreadProps> = ({ thread, onSummarize, onToggleEmail, currentThreadIndex, onReply, onGetSop }) => {
    const [autoSend, setAutoSend] = useState<boolean>(false);
    const [threshold, setThreshold] = useState<number | null>(null);
    // const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [isSummarizeDropdownOpen, setSummarizeDropdownOpen] = useState<boolean>(false);

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
    }, [])

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
                                     <div className="absolute top-12 right-16 flex">
                                    <SummarizeDropdown onSummarize={onSummarize} threadId={thread.threadId} />
                                    </div>
                                    <div className="absolute top-12 right-52">
                                        <button
                                            className="bg-gray-100 text-red-500 px-2 font-bold py-2 rounded-lg shadow hover:from-red-800 hover:bg-gray-300"
                                            onClick={() => onGetSop(thread.threadId)}
                                        >
                                            Smart Reply
                                        </button>
                                    </div>
                                    <div className="absolute top-8 right-72 mr-5 flex space-x-2 px-2">
                                        <AutoSendDropdown
                                            autoSend={autoSend}
                                            threshold={threshold}
                                            setAutoSend={setAutoSend}
                                            setThreshold={setThreshold}
                                            handleSetAutoSend={handleSetAutoSend}
                                        />
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
