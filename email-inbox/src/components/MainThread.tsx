import React from 'react';
import { Thread } from '../types';
import Email from './Email.tsx';

interface MainThreadProps {
  thread: Thread | null;
  onSummarize: (thread_id: number) => void;
  onGetSop: (thread_id: number) => void;
  onToggleEmail: (threadIndex: number, emailIndex: number) => void;
  currentThreadIndex : number;
  onReply: (senderEmail: string, threadId: number) => void;
}

const MainThread: React.FC<MainThreadProps> = ({ thread, onSummarize, onToggleEmail,currentThreadIndex, onReply, onGetSop }) => {
  return (
    thread ?
    (<>
    <div className="w-full px-3 py-2 mx-auto">
      <div className="flex flex-wrap -mx-3">
        <div className="w-full max-w-full mb-6">
          <div className="relative flex flex-col min-w-0 break-words bg-gray-200 rounded-2xl bg-clip-border">
            <div className="h-full overflow-y-auto" id="main-thread">
              <div className="absolute top-12 right-8">
                <button
                  className="bg-gray-100 text-red-500 px-4 font-bold py-2 rounded-lg shadow hover:from-red-800 hover:bg-gray-300"
                  onClick={() => onSummarize(thread.threadId)}
                >
                  Summarize
                </button>
              </div>
              <div className='absolute top-12 right-40'>
                              <button
                  className="bg-gray-100 text-red-500 px-4 font-bold py-2 rounded-lg shadow hover:from-red-800 hover:bg-gray-300"
                  onClick={() => onGetSop(thread.threadId)}
                >
                  Smart Reply
                </button>

              </div>
              <div className="p-6 bg-gray-200">
                <div
                  className="p-6 border-b bg-red-600 text-white rounded-t-lg"
                >
                  <h1 className="text-2xl text-white font-semibold">{thread.threadTitle}</h1>
                </div>
                {thread.emails.map((email, index) => (
                  <Email
                  threadId={thread.threadId}
                    indexKey={index}
                    email={email}
                    onToggle={() => onToggleEmail(currentThreadIndex, index)}
                    onReply={onReply}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>) : (<div className="w-full px-3 py-2 mx-auto">No threads found :(</div>)
  );
};

export default MainThread;
