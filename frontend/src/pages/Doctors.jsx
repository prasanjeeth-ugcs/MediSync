import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { specialityData } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { Filter, X } from 'lucide-react';

const Doctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  const { speciality: initialSpeciality } = useParams();

  const normalizeSpeciality = (spec) =>
    spec.toLowerCase().replace(/\s+/g, ' ')
      .replace(/\bphysicians\b/, 'physician')
      .replace(/\bpediatricians\b/, 'pediatrician')
      .replace(/\bgynecologists\b/, 'gynecologist')
      .replace(/\bdermatologists\b/, 'dermatologist')
      .replace(/\bneurologists\b/, 'neurologist')
      .replace(/\bcardiologists\b/, 'cardiologist')
      .replace(/\bsurgeons\b/, 'surgeon')
      .replace(/\bdoctors\b/, 'doctor')
      .replace(/\sspecialist\s*$/, '')
      .trim();

  const [selectedSpecs, setSelectedSpecs] = useState(() =>
    initialSpeciality ? [normalizeSpeciality(decodeURIComponent(initialSpeciality))] : []
  );
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const available = doctors.filter(d => d.available);
    setFilteredDoctors(
      selectedSpecs.length === 0
        ? available
        : available.filter(d => selectedSpecs.includes(normalizeSpeciality(d.speciality)))
    );
  }, [selectedSpecs, doctors]);

  const toggleSpeciality = (spec) =>
    setSelectedSpecs(prev =>
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );

  const toggleDescription = (id) =>
    setExpandedDescriptions(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );

  const truncate = (text, n = 120) =>
    text.length <= n ? text : text.slice(0, n).trimEnd() + '…';

  return (
    <div className="min-h-screen bg-surface-50 w-full flex flex-col">
      <div className="w-full flex flex-col md:flex-row">

        {/* ─── Sidebar / Drawer ─── */}
        <aside
          className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:bg-transparent md:static md:z-auto transition-all duration-300 ${filterOpen ? 'block' : 'hidden md:block'}`}
          onClick={() => setFilterOpen(false)}
        >
          <div
            className={`w-72 max-w-full h-full md:h-auto bg-surface border-r border-surface-200 p-6 flex flex-col transition-all duration-300 ${filterOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} md:static fixed left-0 top-0`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-ink uppercase tracking-wider">Filter by Specialty</h2>
              <button className="md:hidden btn-ghost p-2" onClick={() => setFilterOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <ul className="space-y-0.5 w-full max-h-[70vh] overflow-y-auto">
              {[...specialityData]
                .sort((a, b) => a.speciality.localeCompare(b.speciality))
                .map((item) => {
                  const norm = normalizeSpeciality(item.speciality);
                  const checked = selectedSpecs.includes(norm);
                  return (
                    <li key={item.speciality}>
                      <label className={`flex items-center w-full cursor-pointer py-2.5 px-3 rounded-xl transition-colors text-sm font-medium ${checked ? 'bg-brand-50 text-brand-700' : 'text-ink-secondary hover:bg-surface-100 hover:text-ink'}`}>
                        <input
                          type="checkbox"
                          className="mr-3 accent-brand-600 h-4 w-4 rounded"
                          checked={checked}
                          onChange={() => toggleSpeciality(norm)}
                        />
                        {item.speciality}
                      </label>
                    </li>
                  );
                })}
            </ul>

            {selectedSpecs.length > 0 && (
              <button
                onClick={() => setSelectedSpecs([])}
                className="mt-4 text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        {/* Mobile filter button */}
        <button
          className="md:hidden fixed bottom-6 right-6 z-50 btn-primary shadow-lg gap-2 rounded-full px-5 py-3"
          onClick={() => setFilterOpen(true)}
        >
          <Filter size={18} />
          Filter
        </button>

        {/* ─── Main content ─── */}
        <main className="flex-1 px-6 pt-8 pb-12">
          <h1 className="text-2xl font-bold text-ink mb-6">
            {selectedSpecs.length > 0
              ? `${selectedSpecs.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}`
              : 'All Doctors'}
            <span className="ml-2 text-sm text-ink-muted font-normal">({filteredDoctors.length} results)</span>
          </h1>

          {filteredDoctors.length === 0 ? (
            <div className="flex flex-col items-center mt-20 text-center">
              <p className="text-base text-ink-secondary font-medium">No doctors match your filter.</p>
              <p className="text-sm text-ink-muted mt-2">Try clearing the filters or selecting a different specialty.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDoctors.map((doc) => {
                const isExpanded = expandedDescriptions.includes(doc._id);
                return (
                  <div
                    key={doc._id}
                    onClick={() => navigate(`/appointment/${doc._id}`)}
                    className="card-hover p-5 flex flex-col gap-4 cursor-pointer"
                  >
                    <div className="h-36 w-full bg-surface-100 rounded-xl flex items-center justify-center">
                      <img
                        src={doc.image}
                        alt={doc.name}
                        className="w-20 h-20 object-cover rounded-full border-2 border-surface-200 shadow-sm"
                      />
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center justify-between mb-1">
                        <span className="badge-success">Available</span>
                      </div>
                      <h2 className="text-base font-semibold text-ink">{doc.fullName}</h2>
                      <p className="text-sm text-brand-600 font-medium">{doc.speciality}</p>
                      <p className="text-xs text-ink-muted mt-1">{doc.degree} · {doc.experience}</p>

                      <p className="mt-2 text-sm text-ink-secondary leading-relaxed">
                        {isExpanded ? doc.about : truncate(doc.about)}
                      </p>
                      {doc.about.length > 120 && (
                        <button
                          onClick={e => { e.stopPropagation(); toggleDescription(doc._id); }}
                          className="mt-1 text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors text-left"
                        >
                          {isExpanded ? 'Show less' : 'Read more'}
                        </button>
                      )}

                      <div className="mt-4 pt-3 border-t border-surface-200 flex items-center justify-between">
                        <p className="text-sm font-bold text-ink">
                          ₹{doc.fees}
                          <span className="ml-1 text-xs text-ink-muted font-normal">Consultation</span>
                        </p>
                        <span className="text-xs text-brand-600 font-medium">Book →</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Doctors;
