import React, { useState } from 'react';
import { Email as EmailType } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faStar, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

interface EmailProps {
  threadId: number;
  indexKey: number;
  email: EmailType;
  autoSend: boolean;
  threshold: number | null;
  onToggle: () => void;
  onReply: (senderEmail: string, threadId: number) => void;
}

const Email: React.FC<EmailProps> = ({ indexKey, email, onToggle, threadId, onReply, threshold, autoSend }) => {
  const [emailContent, setEmailContent] = useState(email.content);
  const [emailIsResolved, setEmailIsResolved] = useState(email.isResolved);
  const [toggleCoverageDescription, setToggleDescription] = useState<boolean | null>(true);

  const handleReplyClick = () => {
    onReply(email.senderEmail, threadId);
  };

  const handleConfirmSend = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/update/email/${email.emailRecordId}`, {
        content: emailContent,
      });
      alert('Email updated successfully!');
      setEmailIsResolved(true);
    } catch (error) {
      console.error('Error updating email:', error);
      alert('Failed to update email.');
    }
  };

  const getCoverageStyle = (coverage: number) => {
    if (coverage >= 0 && coverage <= 25) {
      return 'text-red-500';
    } else if (coverage > 25 && coverage < 75) {
      return 'text-yellow-500';
    } else if (coverage > 75 && coverage <= 100) {
      return 'text-green-500';
    }
    return 'hidden';
  };

  const coverageStyle = getCoverageStyle(email.coveragePercentage);

  return (
    <div className="p-6 border-b bg-white hover:shadow-lg rounded-lg transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center cursor-pointer" onClick={onToggle}>
          <img
            className="h-10 w-10 rounded-full mr-3 border-2 border-gray-300"
            src={`./assets/images/${email.senderEmail === "support@business.com" ? 'customer_support_profile.png' : 'generic_profile_image.png'}`}
            alt="Sender"
          />
          <div>
            <p className="font-semibold text-gray-900 text-lg">{email.sender}</p>
            <p className="text-sm text-gray-600">{email.senderEmail}</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 italic">{email.date}</p>
      </div>

      {email.isOpen ? (
        emailIsResolved ? (
          <pre className="text-gray-900 bg-gray-100 mt-4 px-4 py-3 rounded-lg border border-gray-300 pre-wrap">{email.content}</pre>
        ) : (email.coveragePercentage && threshold && email.coveragePercentage >= threshold) ? (
          <>
            <pre className="text-gray-900 bg-gray-100 mt-4 px-4 py-3 rounded-lg border border-gray-300 pre-wrap">{email.content}</pre>
            <div className="pt-4">
              <span className={`ml-4 font-semibold ${coverageStyle}`}>
                Mail auto-sent with coverage: {email.coveragePercentage}%
              </span>
              <button
                onClick={() => setToggleDescription(!toggleCoverageDescription)}
                className="ml-2 text-gray-500 hover:text-yellow-500 cursor-pointer"
              >
                <FontAwesomeIcon icon={faQuestionCircle} />
              </button>
              {!toggleCoverageDescription && (
                <div className="text-sm text-gray-700 mt-2 italic">
                  {email.coverageDescription}
                </div>
              )}
            </div>
          </>
        ) : (
          <div>
            <textarea
              className="w-full text-gray-800 border border-gray-300 rounded-lg p-3 mt-4 shadow-sm focus:ring-2 focus:ring-red-400 focus:outline-none"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              rows={12}
            />
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
                onClick={handleConfirmSend}
              >
                Send
              </button>
            </div>
            {email.coveragePercentage >= 0 && email.coveragePercentage <= 100 && (
              <div className="mt-4">
                <span className={`ml-4 font-semibold ${coverageStyle}`}>
                  Coverage: {email.coveragePercentage}%
                </span>
                <button
                  onClick={() => setToggleDescription(!toggleCoverageDescription)}
                  className="ml-2 text-gray-500 hover:text-yellow-500 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </button>
                {!toggleCoverageDescription && (
                  <div className="text-sm text-gray-700 mt-1">
                    {email.coverageDescription}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      ) : (
        <div onClick={onToggle} className="text-gray-500 truncate cursor-pointer hover:text-gray-800">
          {email.content.substring(0, 100)}...
        </div>
      )}

      <div className="flex justify-between items-center mt-6">
        <div className="flex space-x-4">
          <FontAwesomeIcon icon={faReply} className="text-gray-500 hover:text-red-500 cursor-pointer" onClick={handleReplyClick} />
          <FontAwesomeIcon icon={faStar} className="text-gray-500 hover:text-yellow-500 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Email;