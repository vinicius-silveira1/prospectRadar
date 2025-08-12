import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useProspectImage } from '@/hooks/useProspectImage'; // Re-add this import
import { getInitials, getColorFromName } from '@/utils/imageUtils';

// Internal component for isolated image loading
const ProspectImage = ({ prospect }) => {
  const { imageUrl, isLoading } = useProspectImage(prospect?.name, prospect?.image);

  if (isLoading) {
    return <div className="w-24 h-24 bg-gray-200 dark:bg-super-dark-border rounded-full animate-pulse mx-auto" />;
  }

  return (
    imageUrl ? (
      <img
        src={imageUrl}
        alt={prospect?.name || 'Prospect'}
        className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-super-dark-border shadow-lg mx-auto"
        crossOrigin="anonymous"
      />
    ) : (
      <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white dark:border-super-dark-border shadow-lg mx-auto" style={{ backgroundColor: getColorFromName(prospect?.name) }}>
        <span>{getInitials(prospect?.name)}</span>
      </div>
    )
  );
};

const CompareProspectCard = ({ prospect, onRemove }) => {
  return (
    <div key={prospect.id} className="relative bg-white dark:bg-super-dark-secondary rounded-lg shadow-md border border-slate-200 dark:border-super-dark-border overflow-hidden group">
      <button onClick={() => onRemove(prospect.id)} className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"><X size={16} /></button>
      <Link to={`/prospects/${prospect.id}`} className="block">
        <div className="p-3 text-center"> {/* Added text-center for alignment */}
          <ProspectImage prospect={prospect} /> {/* Re-add image component */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-super-dark-text-primary mt-2 leading-tight">{prospect.name}</h3>
          <p className="text-sm text-gray-600 dark:text-super-dark-text-secondary">{prospect.position} • {prospect.high_school_team}</p>
          <div className="mt-2 flex justify-center items-center gap-2">
            <span className="text-xs bg-gray-100 text-gray-700 dark:bg-super-dark-secondary dark:text-super-dark-text-primary px-2 py-1 rounded-full font-semibold">#{prospect.ranking || 'N/A'}</span>
            <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 px-2 py-1 rounded-full font-semibold">Tier {prospect.tier}</span>
          </div>
          
        </div>
      </Link>
    </div>
  );
};

export default CompareProspectCard;