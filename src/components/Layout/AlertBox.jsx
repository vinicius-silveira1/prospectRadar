import { Info } from 'lucide-react';

const AlertBox = ({ message }) => {
  return (
    <div className="bg-blue-100 dark:bg-blue-900/50 border-l-4 border-blue-500 dark:border-blue-400 text-blue-700 dark:text-blue-200 p-4 rounded-r-lg" role="alert">
      <div className="flex">
        <div className="py-1"><Info className="h-5 w-5 mr-3"/></div>
        <div>
          <p className="text-sm font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default AlertBox;
