import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Download, Plus, GraduationCap, Upload, Trash2, CheckCircle, X } from 'lucide-react';
import { StatusBadge } from '../../components/shared/Badges';
import { MOCK_BATCHES } from '../../data/mockData';
import toast from 'react-hot-toast';

const EMPTY_STUDENT = { name:'', rollNumber:'', dob:'', gender:'Male', cgpa:'', skills:'', phone:'', email:'', address:'' };

export default function CoordBatchDetail() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState(() => {
    const found = MOCK_BATCHES.find(b => b._id === batchId);
    return found ? { ...found, students: [...found.students] } : null;
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCSV, setShowCSV] = useState(false);
  const [studentForm, setStudentForm] = useState({ ...EMPTY_STUDENT });
  const [dragging, setDragging] = useState(false);
  const [csvPreview, setCsvPreview] = useState(null);
  const fileRef = useRef();

  if (!batch) return (
    <div className="card empty-state mt-8">
      <p className="empty-state-title">Batch not found</p>
      <button onClick={() => navigate('/coordinator/batches')} className="btn btn-outline mt-4">Go Back</button>
    </div>
  );

  const setSF = (k, v) => setStudentForm(f => ({ ...f, [k]: v }));

  const addStudent = (e) => {
    e.preventDefault();
    const newStudent = {
      _id: `st_${Date.now()}`,
      ...studentForm,
      cgpa: parseFloat(studentForm.cgpa) || 0,
      skills: studentForm.skills.split(',').map(s => s.trim()).filter(Boolean),
      certifications: [],
      languagesKnown: [],
      resumeUrl: '#',
    };
    setBatch(b => ({ ...b, students: [...b.students, newStudent], totalStudents: b.totalStudents + 1 }));
    setStudentForm({ ...EMPTY_STUDENT });
    setShowAddModal(false);
    toast.success(`${newStudent.name} added to batch`);
  };

  const removeStudent = (studentId) => {
    setBatch(b => ({ ...b, students: b.students.filter(s => s._id !== studentId), totalStudents: b.totalStudents - 1 }));
    toast.success('Student removed');
  };

  const activateBatch = () => {
    if (batch.students.length === 0) { toast.error('Add at least one student before activating'); return; }
    setBatch(b => ({ ...b, status: 'active' }));
    toast.success('Batch activated! It is now eligible for job applications.');
  };

  const handleCSVDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer?.files[0] || e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = ev.target.result.split('\n').filter(l => l.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1).map(line => {
        const vals = line.split(',');
        return headers.reduce((obj, h, i) => ({ ...obj, [h]: (vals[i] || '').trim() }), {});
      }).filter(r => r.Name);
      setCsvPreview(rows);
    };
    reader.readAsText(file);
  };

  const confirmCSV = () => {
    const newStudents = csvPreview.map((r, i) => ({
      _id: `st_csv_${Date.now()}_${i}`,
      name: r.Name || '', rollNumber: r['Roll Number'] || '',
      dob: r.DOB || '', gender: r.Gender || 'Male',
      cgpa: parseFloat(r.CGPA) || 0,
      skills: (r.Skills || '').split(';').map(s => s.trim()).filter(Boolean),
      phone: r.Phone || '', email: r.Email || '', address: r.Address || '',
      languagesKnown: (r['Languages Known'] || '').split(';').map(s => s.trim()).filter(Boolean),
      certifications: (r.Certifications || '').split(';').map(s => s.trim()).filter(Boolean),
      resumeUrl: '#',
    }));
    setBatch(b => ({ ...b, students: [...b.students, ...newStudents], totalStudents: b.totalStudents + newStudents.length }));
    setCsvPreview(null); setShowCSV(false);
    toast.success(`${newStudents.length} students imported from CSV`);
  };

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate('/coordinator/batches')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Batches
      </button>

      {/* Header card */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Users size={26} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{batch.name}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{batch.qualification} · {batch.branch} · Batch of {batch.passingYear}</p>
              <div className="flex gap-2 mt-2">
                <StatusBadge type="batch" status={batch.status} />
                <span className="badge badge-blue">{batch.totalStudents} students</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {batch.status === 'draft' && (
              <button onClick={activateBatch} className="btn btn-success btn-sm">
                <CheckCircle size={14} /> Activate Batch
              </button>
            )}
            <button onClick={() => setShowCSV(true)} className="btn btn-outline btn-sm"><Upload size={14} /> CSV Upload</button>
            <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm"><Plus size={14} /> Add Student</button>
          </div>
        </div>
      </div>

      {/* Students */}
      {batch.students.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">🎓</div>
          <p className="empty-state-title">No students yet</p>
          <p className="empty-state-desc">Add students manually or upload a CSV file</p>
          <div className="flex gap-3 justify-center mt-4">
            <button onClick={() => setShowCSV(true)} className="btn btn-outline"><Upload size={15} /> Upload CSV</button>
            <button onClick={() => setShowAddModal(true)} className="btn btn-primary"><Plus size={15} /> Add Student</button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Roll No.</th>
                  <th>CGPA</th>
                  <th>Skills</th>
                  <th>Certifications</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {batch.students.map(st => (
                  <tr key={st._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <GraduationCap size={14} className="text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-800">{st.name}</p>
                          <p className="text-xs text-gray-400">{st.gender} · {st.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm text-gray-600 font-mono">{st.rollNumber}</td>
                    <td>
                      <span className={`font-bold text-sm ${st.cgpa >= 8.5 ? 'text-green-600' : st.cgpa >= 7 ? 'text-blue-600' : 'text-orange-600'}`}>
                        {st.cgpa}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {(st.skills || []).map(s => <span key={s} className="badge badge-gray">{s}</span>)}
                      </div>
                    </td>
                    <td>
                      {(st.certifications || []).length > 0
                        ? <div className="flex flex-wrap gap-1">{st.certifications.map(c => <span key={c} className="badge badge-green">{c}</span>)}</div>
                        : <span className="text-xs text-gray-400">—</span>}
                    </td>
                    <td>
                      <button onClick={() => removeStudent(st._id)} className="btn btn-ghost btn-sm text-red-400 hover:text-red-600 hover:bg-red-50">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content modal-content-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">Add Student</h3>
              <button onClick={() => setShowAddModal(false)} className="btn btn-ghost btn-icon"><X size={18} /></button>
            </div>
            <form onSubmit={addStudent} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Full Name <span className="text-red-500">*</span></label>
                  <input className="form-input" placeholder="Student full name" value={studentForm.name} onChange={e => setSF('name', e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Roll Number <span className="text-red-500">*</span></label>
                  <input className="form-input" placeholder="e.g. ITI/ELE/2024/001" value={studentForm.rollNumber} onChange={e => setSF('rollNumber', e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Date of Birth <span className="text-red-500">*</span></label>
                  <input className="form-input" type="date" value={studentForm.dob} onChange={e => setSF('dob', e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Gender</label>
                  <select className="form-input form-select" value={studentForm.gender} onChange={e => setSF('gender', e.target.value)}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">CGPA / Percentage</label>
                  <input className="form-input" type="number" step="0.1" min="0" max="10" placeholder="e.g. 8.4" value={studentForm.cgpa} onChange={e => setSF('cgpa', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Phone</label>
                  <input className="form-input" type="tel" placeholder="10-digit mobile" value={studentForm.phone} onChange={e => setSF('phone', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Email <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input className="form-input" type="email" placeholder="student@gmail.com" value={studentForm.email} onChange={e => setSF('email', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Home Address</label>
                  <input className="form-input" placeholder="City, State" value={studentForm.address} onChange={e => setSF('address', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="form-label">Skills <span className="text-gray-400 font-normal">(comma-separated)</span></label>
                <input className="form-input" placeholder="e.g. Wiring, PLC Basics, Safety" value={studentForm.skills} onChange={e => setSF('skills', e.target.value)} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline flex-1">Cancel</button>
                <button type="submit" className="btn btn-primary flex-1"><Plus size={15} /> Add Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Upload Modal */}
      {showCSV && (
        <div className="modal-overlay" onClick={() => { setShowCSV(false); setCsvPreview(null); }}>
          <div className="modal-content modal-content-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">Bulk Upload via CSV</h3>
              <button onClick={() => { setShowCSV(false); setCsvPreview(null); }} className="btn btn-ghost btn-icon"><X size={18} /></button>
            </div>

            {!csvPreview ? (
              <>
                <div
                  className={`csv-drop-zone ${dragging ? 'dragging' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleCSVDrop}
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload size={32} className="text-blue-400 mx-auto mb-3" />
                  <p className="font-semibold text-gray-700 mb-1">Drag & drop your CSV file here</p>
                  <p className="text-sm text-gray-400">or click to browse</p>
                  <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleCSVDrop} />
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-xl text-sm text-blue-700">
                  <p className="font-semibold mb-1">Required CSV columns:</p>
                  <p className="font-mono text-xs">Name, Roll Number, DOB, Gender, CGPA, Skills, Phone, Email, Address, Languages Known, Certifications</p>
                  <p className="text-xs mt-1 text-blue-500">Skills, Languages Known, Certifications should be semicolon-separated within each cell</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-green-50 border border-green-100 rounded-xl p-3 mb-4 flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <p className="text-sm font-semibold text-green-700">{csvPreview.length} students parsed successfully</p>
                </div>
                <div className="table-wrapper mb-5" style={{ maxHeight: 280, overflowY: 'auto' }}>
                  <table>
                    <thead><tr><th>Name</th><th>Roll No.</th><th>CGPA</th><th>Gender</th></tr></thead>
                    <tbody>
                      {csvPreview.map((r, i) => (
                        <tr key={i}>
                          <td className="font-medium text-gray-800">{r.Name}</td>
                          <td className="text-sm text-gray-500">{r['Roll Number']}</td>
                          <td className="text-sm">{r.CGPA}</td>
                          <td className="text-sm">{r.Gender}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setCsvPreview(null)} className="btn btn-outline flex-1">Re-upload</button>
                  <button onClick={confirmCSV} className="btn btn-success flex-1"><CheckCircle size={15} /> Import {csvPreview.length} Students</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
