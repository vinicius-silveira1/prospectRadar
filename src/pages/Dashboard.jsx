import { useState } from 'react';
import { mockProspects } from '../data/mockData';
import ProspectCard from '../components/Prospects/ProspectCard';
import { TrendingUp, Users, Star, Trophy } from 'lucide-react';

const Dashboard = () => {
  const [prospects, setProspects] = useState(mockProspects);

  const handleToggleWatchlist = (prospectId) => {
    setProspects(prev => prev.map(prospect => 
      prospect.id === prospectId 
        ? { ...prospect, watchlisted: !prospect.watchlisted }
        : prospect
    ));
  };

  const topProspects = prospects.slice(0, 6);
  const trendingUp = prospects.filter(p => p.trending === 'up').slice(0, 3);
  const watchlistedProspects = prospects.filter(p => p.watchlisted);

  const stats = [
    { label: 'Total Prospects', value: prospects.length, icon: Users, color: 'text-blue-600' },
    { label: 'Watchlisted', value: watchlistedProspects.length, icon: Star, color: 'text-yellow-600' },
    { label: 'Trending Up', value: trendingUp.length, icon: TrendingUp, color: 'text-green-600' },
    { label: 'Mock Draft Ready', value: prospects.filter(p => p.mockDraftPosition <= 30).length, icon: Trophy, color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-nba-blue to-blue-600 text-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome to ProspectRadar</h1>
        <p className="text-blue-100">
          Track the next generation of NBA stars. From high school to the draft.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Prospects */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Top Prospects</h2>
          <a href="/prospects" className="text-nba-blue hover:text-blue-700 font-medium">
            View All →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topProspects.map((prospect) => (
            <ProspectCard
              key={prospect.id}
              prospect={prospect}
              onToggleWatchlist={handleToggleWatchlist}
            />
          ))}
        </div>
      </section>

      {/* Trending Section */}
      {trendingUp.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Trending Up 📈</h2>
            <a href="/trending" className="text-nba-blue hover:text-blue-700 font-medium">
              View All →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingUp.map((prospect) => (
              <ProspectCard
                key={prospect.id}
                prospect={prospect}
                onToggleWatchlist={handleToggleWatchlist}
              />
            ))}
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a 
            href="/mock-draft" 
            className="card hover:shadow-lg transition-shadow text-center py-8"
          >
            <Trophy className="h-8 w-8 text-nba-blue mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Create Mock Draft</h3>
            <p className="text-sm text-gray-600 mt-1">Build your own draft board</p>
          </a>
          <a 
            href="/compare" 
            className="card hover:shadow-lg transition-shadow text-center py-8"
          >
            <Users className="h-8 w-8 text-nba-blue mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Compare Prospects</h3>
            <p className="text-sm text-gray-600 mt-1">Side-by-side analysis</p>
          </a>
          <a 
            href="/watchlist" 
            className="card hover:shadow-lg transition-shadow text-center py-8"
          >
            <Star className="h-8 w-8 text-nba-blue mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Your Watchlist</h3>
            <p className="text-sm text-gray-600 mt-1">Track your favorites</p>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
