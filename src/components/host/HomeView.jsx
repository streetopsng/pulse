import { useState } from 'react';
import { PulseCard } from './PulseCard';
import { usePulse } from '../../context/PulseContext';

export function HomeView() {
  const { pulses, startCreate } = usePulse();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPulses = pulses.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
    if (!matchesSearch) return false;
    if (statusFilter === 'live') return p.delivery === 'live' && p.status !== 'completed';
    if (statusFilter === 'async') return p.delivery === 'private' && p.status !== 'completed';
    if (statusFilter === 'completed') return p.status === 'completed';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
      {/* Google-style Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-normal text-slate-800 tracking-tight">
            Surveys
          </h1>
          {pulses.length > 0 && (
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {pulses.length}
            </span>
          )}
        </div>

        {/* Google Workspace Elevated Action Pill */}
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 shadow-sm hover:shadow-md transition-all text-sm font-medium cursor-pointer self-start sm:self-auto group"
        >
          <svg className="w-4 h-4 text-purple-600 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span>New pulse</span>
        </button>
      </div>

      {/* Google Search & Filters (Shown whenever there are surveys or user is searching) */}
      {pulses.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search surveys..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-white/90 border border-slate-200/90 rounded-full text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { key: 'all', label: 'All' },
              { key: 'live', label: 'Live' },
              { key: 'async', label: 'Async' },
              { key: 'completed', label: 'Completed' },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setStatusFilter(key)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  statusFilter === key
                    ? 'bg-purple-100/70 text-purple-800 border border-purple-200'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {pulses.length === 0 ? (
        /* Google Workspace Style Empty State */
        <div className="bg-white/80 border border-slate-200/90 rounded-2xl p-10 sm:p-16 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-purple-600 mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          <h2 className="text-xl font-normal text-slate-800 mb-2">
            No surveys yet
          </h2>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
            Create a pulse survey to collect real-time sentiment and feedback from your team.
          </p>

          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create pulse</span>
          </button>
        </div>
      ) : filteredPulses.length === 0 ? (
        /* No Search Matches */
        <div className="bg-white/80 border border-slate-200/90 rounded-2xl p-8 text-center shadow-xs">
          <p className="text-slate-500 text-sm">
            No surveys match your current search or filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
            className="text-xs font-semibold text-purple-600 hover:text-purple-700 mt-2 cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      ) : (
        /* Surveys List */
        <div className="flex flex-col gap-3">
          {filteredPulses.map((pulse) => (
            <PulseCard key={pulse.id} pulse={pulse} />
          ))}
        </div>
      )}
    </div>
  );
}
