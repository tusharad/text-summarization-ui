import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import MainThread from './components/MainThread.tsx';
import Modal from './components/Modal.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import ComposeEmailModal from './components/ComposeEmailModal.tsx';
import Notification from './components/Notification.tsx';
import axios from 'axios';
import { Thread } from './types';

const App: React.FC = () => {
  const [emailThreads, setEmailThreads] = useState<Thread[]>([]);
  const [currentThreadIndex, setCurrentThreadIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isComposeModalOpen, setIsComposeModalOpen] = useState<boolean>(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState<boolean>(false);
  const [replyEmailData, setReplyEmailData] = useState<{ senderEmail: string; threadId: number } | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>('');
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [showSmartReplyNotification, setSmarReplyShowNotification] = useState<boolean>(false);

  useEffect(() => {
    fetchEmailThreads();

    const intervalId = setInterval(() => {
      checkForNewEmails();
    }, 10000); // 10000 milliseconds = 10 seconds

    return () => clearInterval(intervalId);
  }, [lastUpdateTime]); // Re-run the effect when lastUpdateTime changes

  const fetchEmailThreads = async () => {
    try {
      const response = await axios.get<Thread[]>('http://localhost:5000/all_email_threads');
      setEmailThreads(response.data.threads);
      setLastUpdateTime(response.data.time);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching email threads:', err);
      setError('Failed to load email threads. Please try again later.');
      setIsLoading(false);
    }
  };

  const checkForNewEmails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/check_new_emails/${lastUpdateTime }`);
      if (response.data.threads) {
        console.log("updating")
        setEmailThreads(response.data.threads);
        setLastUpdateTime(response.data.time);
        setShowNotification(true);
      }
    } catch (err) {
      console.error('Error checking for new emails:', err);
      // Optionally handle the error if needed
    }
  };

  const handleReply = (senderEmail: string, threadId: number) => {
    console.log("reached here", senderEmail);
    setReplyEmailData({ senderEmail, threadId });
    setIsReplyModalOpen(true);
  };

  const closeReplyModal = () => {
    setIsReplyModalOpen(false);
    setReplyEmailData(null);
  };

  const openModal = async (threadId: number) => {
    setIsModalOpen(true);
    setSummary(''); // Clear previous summary

    try {
      const response = await fetch(`http://localhost:5000/summarize/${threadId}`, {
        method: 'POST',
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let summaryStream = '';

      while (!done) {
        const { value, done: doneReading } = await reader!.read();
        done = doneReading;
        const chunk = decoder.decode(value, { stream: true });
        summaryStream += chunk;
        setSummary(prev => prev + chunk);
      }

      console.log('Final summary:', summaryStream);
    } catch (err) {
      console.error('Error:', err);
      setSummary('An error occurred. Please try again.');
    }
  };

  const getSopBasedEmailResponse = async (threadId: number) => {
    try {
        const response = await fetch(`http://localhost:5000/store_thread_and_document`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "thread_id" : threadId, "doc_id" : 1 })
        });

        setSmarReplyShowNotification(true);

    } catch (err) {
    console.log("Error during, store_thread_and_document api",err)
    }
  }

  const closeModal = () => setIsModalOpen(false);

  const handleThreadSelect = (index: number) => {
    setCurrentThreadIndex(index);
  };

  const handleComposeModalOpen = () => {
    console.log("reacher ere");
    setIsComposeModalOpen(true);
  };
  
  const handleComposeModalClose = () => setIsComposeModalOpen(false);

  const toggleEmailOpen = (threadIndex: number, emailIndex: number) => {
    const updatedThreads = [...emailThreads];
    const email = updatedThreads[threadIndex].emails[emailIndex];
    email.isOpen = !email.isOpen;
    setEmailThreads(updatedThreads);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-slate-500">
      <Sidebar
        emailThreads={emailThreads}
        onSelectThread={handleThreadSelect}
        currentThreadIndex={currentThreadIndex}
        onComposeNewEmail={handleComposeModalOpen}
      />
      <main className="flex-1 relative bg-gray-200 overflow-auto">
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <MainThread
            thread={emailThreads.length > currentThreadIndex ? emailThreads[currentThreadIndex] : null}
            onSummarize={openModal}
            onGetSop={getSopBasedEmailResponse}
            onToggleEmail={toggleEmailOpen}
            currentThreadIndex={currentThreadIndex}
            onReply={handleReply}
          />
        )}
      </main>
      {isModalOpen && <Modal summary={summary} onClose={closeModal} />}
      {isComposeModalOpen && <ComposeEmailModal onEmailSent={fetchEmailThreads} onClose={handleComposeModalClose} />}
      {isReplyModalOpen && replyEmailData && (
        <ComposeEmailModal
          onClose={closeReplyModal}
          senderEmail2={replyEmailData.senderEmail}
          threadId={replyEmailData.threadId}
          isReply={true}
          onEmailSent={fetchEmailThreads}
        />
      )}
      {showNotification && <Notification message="You got mail!" onClose={() => setShowNotification(false)} /> }
      {showSmartReplyNotification && <Notification message="Will reply in few minutes!!" onClose={() => setSmarReplyShowNotification(false)} /> }
    </div>
  );
};

export default App;
