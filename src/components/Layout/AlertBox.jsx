import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const AlertBox = ({ type = 'info', title, message }) => {
  let bgColorClass, borderColorClass, textColorClass, IconComponent;

  switch (type) {
    case 'success':
      bgColorClass = 'bg-green-100 dark:bg-green-900/30';
      borderColorClass = 'border-green-500 dark:border-green-400';
      textColorClass = 'text-green-700 dark:text-green-200';
      IconComponent = CheckCircle;
      break;
    case 'warning':
      bgColorClass = 'bg-yellow-100 dark:bg-yellow-900/30';
      borderColorClass = 'border-yellow-500 dark:border-yellow-400';
      textColorClass = 'text-yellow-700 dark:text-yellow-200';
      IconComponent = AlertTriangle;
      break;
    case 'error':
      bgColorClass = 'bg-red-100 dark:bg-red-900/30';
      borderColorClass = 'border-red-500 dark:border-red-400';
      textColorClass = 'text-red-700 dark:text-red-200';
      IconComponent = XCircle;
      break;
    case 'info':
    default:
      bgColorClass = 'bg-blue-100 dark:bg-blue-900/30';
      borderColorClass = 'border-blue-500 dark:border-blue-400';
      textColorClass = 'text-blue-700 dark:text-blue-200';
      IconComponent = Info;
      break;
  }

  return (
    <div className={`flex p-4 rounded-r-lg ${bgColorClass} ${borderColorClass} ${textColorClass}`} role="alert">
      <div className="flex">
        <div className="flex-shrink-0"><IconComponent className="h-5 w-5 mr-3"/></div>
        <div>
          {title && <p className="text-lg font-semibold mb-1">{title}</p>}
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default AlertBox;
