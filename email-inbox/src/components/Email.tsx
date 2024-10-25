import React, { useState } from 'react';
import { Email as EmailType } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faStar, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

interface EmailProps {
  threadId: number;
  indexKey: number;
  email: EmailType;
  onToggle: () => void;
  onReply: (senderEmail: string, threadId: number) => void;
}

const Email: React.FC<EmailProps> = ({ indexKey, email, onToggle, threadId, onReply }) => {
  const [emailContent, setEmailContent] = useState(email.content);
  const [emailIsResolved, setEmailIsResolved] = useState(email.isResolved);
    const [toggleCoverageDescription, setToggleDescription] = useState<boolen | null>(true);

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
      // Handle response or update state as necessary
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
    } else if (coverage > 75 && coverage <= 100){
        return 'text-green-500'
    }
    return 'hidden';
  };

  const coverageStyle = getCoverageStyle(email.coveragePercentage);

 return (
    <div className="p-6 border-b bg-white hover:bg-gray-50 transition">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center cursor-pointer" onClick={onToggle}>
          <img
            className="h-8 w-8 rounded-full mr-2"
            src={`./assets/images/${email.senderEmail === "support@business.com" ? 'customer_support_profile.png' : 'generic_profile_image.png'}`}
            alt="Sender"
          />
          <div>
            <p className="font-semibold text-primary">{email.sender}</p>
            <p className="text-sm text-secondary">{email.senderEmail}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">{email.date}</p>
      </div>
      {email.isOpen ? (
        emailIsResolved ? (
          <pre onClick={onToggle} className="text-gray-900 bg-gray-200 mt-4 px-2 py-2 pre-wrap">{email.content}</pre>
        ) : (
          <div>
            <textarea
              className="w-full text-gray-800 border border-gray-700 rounded-md p-2 mt-4"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              rows={25} // Increased number of rows
            />
            <button
              className="bg-red-500 text-white px-4 py-2 mr-2 rounded-lg shadow hover:bg-red-600 mt-2"
            >
              Cancel
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 mt-2"
              onClick={handleConfirmSend}
            >
              Send
            </button>
            {email.coveragePercentage >= 0 && email.coveragePercentage <= 100 && (
            <>
                <span className={`ml-4 font-semibold ${coverageStyle}`}>
                  Coverage: {email.coveragePercentage}%
                </span>

                <button
                                            onClick={() => setToggleDescription(!toggleCoverageDescription)}
                                            className="ml-2 text-gray-500 hover:text-yellow-500 cursor-pointer"
                                        >
                                            <FontAwesomeIcon icon={faQuestionCircle} />
                                        </button>
                                        {(toggleCoverageDescription ? null : ( 
                                            <div className="text-sm text-gray-700 mt-1">
                                                {email.coverageDescription}
                                            </div>)
                                        )}

                </>
              )}
          </div>
        )
      ) : (
        <div onClick={onToggle} className="text-gray-500 truncate">{email.content.substring(0, 100)}...</div>
      )}
      <div className="flex justify-between mt-4">
        <span></span>
        <div className="flex space-x-4">
          <FontAwesomeIcon icon={faReply} className="text-gray-500 hover:text-red-500 cursor-pointer" onClick={handleReplyClick} />
          <FontAwesomeIcon icon={faStar} className="text-gray-500 hover:text-yellow-500 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Email;

