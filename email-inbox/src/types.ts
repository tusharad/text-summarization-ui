export interface Email {
    seq_no: number;
    sender: string;
    senderEmail: string;
    date: string;
    content: string;
    isOpen: boolean;
    isResolved: boolean;
    emailRecordId: number;
    coveragePercentage: number;
    coverageDescription: string;
    imagePath: string;
  }
  
  export interface Thread {
    threadId: number;
    threadTitle: string;
    emails: Email[];
    sentiment: string;
  }
  
