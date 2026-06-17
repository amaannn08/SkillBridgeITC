import { useState } from 'react';
import { Search, Download, CheckCircle } from 'lucide-react';
import { MOCK_PLACED_STUDENTS } from '../../data/mockData';
import toast from 'react-hot-toast';

export default function AuditTrail() {
  const [search, setSearch] = useState('');
  const [qualFilter, setQualFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');

  const filtered = MOCK_PLACED_STUDENTS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.college.toLowerCase().includes(search.toLowerCase()) ||
      s.company.toLowerCase().includes(search.toLowerCase());
    const matchQual = qualFilter === 'all' || s.qualification === qualFilter;
    const matchDistrict = districtFilter === 'all' || s.district === districtFilter;
    return matchSearch && matchQual && matchDistrict;
  });

  const quals = [...new Set(MOCK_PLACED_STUDENTS.map(s => s.qualification))];
  const districts = [...new Set(MOCK_PLACED_STUDENTS.map(s => s.district))];

  const exportCSV = () => {
    const headers = ['Name','Phone','Email','College','Qualification','Branch','Company','Role','Salary','Placed On','District'];
    const rows = filtered.map(s => [s.name, s.phone, s.email, s.college, s.qualification, s.branch, s.company, s.role, s.salary, s.placedOn, s.district]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'medak_placed_students.csv'; a.click();
    toast.success('CSV exported');
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <CheckCircle size={22} className="text-green-500" /> Placement Audit Trail
          </h1>
          <p className="page-subtitle">Full record of every student placed through the portal — {MOCK_PLACED_STUDENTS.length} total</p>
        </div>
        <button onClick={exportCSV} className="btn btn-outline btn-sm flex-shrink-0">
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="search-wrap flex-1">
            <Search size={15} className="search-icon" />
            <input className="form-input" placeholder="Search by name, college, or company…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-input form-select w-full sm:w-40" value={qualFilter} onChange={e => setQualFilter(e.target.value)}>
            <option value="all">All Qualifications</option>
            {quals.map(q => <option key={q}>{q}</option>)}
          </select>
          <select className="form-input form-select w-full sm:w-40" value={districtFilter} onChange={e => setDistrictFilter(e.target.value)}>
            <option value="all">All Districts</option>
            {districts.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>

        <div className="table-wrapper">
          <table className="mobile-card-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Contact</th>
                <th>College</th>
                <th>Qualification</th>
                <th>Company</th>
                <th>Role</th>
                <th>Salary</th>
                <th>Placed On</th>
                <th>District</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s._id}>
                  <td>
                    <p className="font-semibold text-gray-800">{s.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.college}</p>
                  </td>
                  <td data-label="Contact">
                    <div>
                      <p className="text-sm text-gray-600">{s.phone}</p>
                      <p className="text-xs text-gray-400">{s.email}</p>
                    </div>
                  </td>
                  <td data-label="College" className="text-sm text-gray-600 hidden sm:table-cell">{s.college}</td>
                  <td data-label="Qualification">
                    <div>
                      <span className="badge badge-blue">{s.qualification}</span>
                      <p className="text-xs text-gray-400 mt-1">{s.branch}</p>
                    </div>
                  </td>
                  <td data-label="Company" className="text-sm font-medium text-gray-800">{s.company}</td>
                  <td data-label="Role" className="text-sm text-gray-600">{s.role}</td>
                  <td data-label="Salary" className="text-sm font-semibold text-green-700">₹{s.salary.toLocaleString('en-IN')}/mo</td>
                  <td data-label="Placed On" className="text-sm text-gray-500">{s.placedOn}</td>
                  <td data-label="District"><span className="badge badge-gray">{s.district}</span></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400">No records match your filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">{filtered.length} of {MOCK_PLACED_STUDENTS.length} records shown</p>
      </div>
    </div>
  );
}
