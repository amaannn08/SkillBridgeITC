import { useNavigate } from 'react-router-dom';
import { Clock, Mail, ArrowLeft } from 'lucide-react';

export default function Pending() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F8FAFC]">
      <div className="max-w-md w-full text-center animate-fade-in">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock size={36} className="text-orange-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Registration Under Review
        </h1>
        <p className="text-gray-500 leading-relaxed mb-8">
          Your registration request has been received and is currently being reviewed by the Super Admin. This typically takes 1–2 business days.
        </p>

        <div className="card p-5 mb-6 text-left space-y-3">
          {[
            { icon: Mail,  text: 'You will receive an email notification once your account is approved or if additional information is required.' },
            { icon: Clock, text: 'Review typically takes 1–2 business days. For urgent queries, contact skillbridge-admin@gov.in' },
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <item.icon size={15} className="text-orange-500" />
              </div>
              <p className="text-sm text-gray-600 leading-snug">{item.text}</p>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/')} className="btn btn-outline gap-2">
          <ArrowLeft size={15} /> Back to Home
        </button>
      </div>
    </div>
  );
}
