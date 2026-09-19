import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Globe, ShieldCheck, HelpCircle, X, FileText, 
  CheckCircle2, MapPin, CreditCard, Lock, Building, Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Footer = () => {
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();

  const [activeModal, setActiveModal] = useState(null); // 'support' | 'terms' | 'lang'
  const [supportTab, setSupportTab] = useState('aircover');

  const handleHostClick = () => {
    if (user?.role === 'HOTEL_MANAGER') {
      navigate('/dashboard');
    } else {
      openAuthModal('manager');
    }
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16 text-xs text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-gray-200">
          
          {/* Column 1: Support */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-[#FF385C]" />
              Support & Help
            </h3>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => { setActiveModal('support'); setSupportTab('aircover'); }} className="hover:underline hover:text-gray-900 transition text-left cursor-pointer">
                  AirCover & Guarantees
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveModal('support'); setSupportTab('cancellation'); }} className="hover:underline hover:text-gray-900 transition text-left cursor-pointer">
                  Cancellation & Refund Status
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveModal('support'); setSupportTab('safety'); }} className="hover:underline hover:text-gray-900 transition text-left cursor-pointer">
                  Safety & Security Info
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveModal('support'); setSupportTab('disability'); }} className="hover:underline hover:text-gray-900 transition text-left cursor-pointer">
                  Disability & Accessibility
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveModal('support'); setSupportTab('cancellation'); }} className="hover:underline hover:text-gray-900 transition text-left cursor-pointer">
                  Report a Booking Issue
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Hosting */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-1.5">
              <Building className="h-4 w-4 text-indigo-600" />
              Hosting & Managers
            </h3>
            <ul className="space-y-2.5">
              <li>
                <button onClick={handleHostClick} className="hover:underline hover:text-gray-900 font-semibold text-indigo-600 transition text-left cursor-pointer">
                  {user?.role === 'HOTEL_MANAGER' ? 'Go to Host Dashboard' : 'Airbnb your home (Register Host)'}
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveModal('support'); setSupportTab('aircover'); }} className="hover:underline hover:text-gray-900 transition text-left cursor-pointer">
                  AirCover for Hosts
                </button>
              </li>
              <li>
                <button onClick={handleHostClick} className="hover:underline hover:text-gray-900 transition text-left cursor-pointer">
                  Add New Hotel Property
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveModal('support'); setSupportTab('safety'); }} className="hover:underline hover:text-gray-900 transition text-left cursor-pointer">
                  Hosting Responsibly in India
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveModal('support'); setSupportTab('aircover'); }} className="hover:underline hover:text-gray-900 transition text-left cursor-pointer">
                  Host Damage Protection (₹1L)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Cities */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-rose-500" />
              Top Indian Stays
            </h3>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => navigate('/')} className="hover:underline hover:text-gray-900 transition text-left cursor-pointer">
                  Kolkata Heritage Suites
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/')} className="hover:underline hover:text-gray-900 transition text-left cursor-pointer">
                  Mumbai Sea View Penthouses
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/')} className="hover:underline hover:text-gray-900 transition text-left cursor-pointer">
                  Hyderabad Nizam Palaces
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/')} className="hover:underline hover:text-gray-900 transition text-left cursor-pointer">
                  Goa Beach Villas & Cottages
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/')} className="hover:underline hover:text-gray-900 transition text-left cursor-pointer">
                  Jaipur & Udaipur Havelis
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Platform & System Status */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Airbnb India Services
            </h3>
            <p className="text-gray-500 mb-3 leading-relaxed">
              Full-stack Airbnb accommodation booking portal supporting INR (₹) pricing, surge inventory management, and instant refund tracking.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All Systems Operational</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span>© 2026 Airbnb India, Inc.</span>
            <span>·</span>
            <button onClick={() => setActiveModal('terms')} className="hover:underline cursor-pointer">
              Privacy Policy
            </button>
            <span>·</span>
            <button onClick={() => setActiveModal('terms')} className="hover:underline cursor-pointer">
              Terms of Service
            </button>
            <span>·</span>
            <button onClick={() => setActiveModal('support')} className="hover:underline cursor-pointer">
              AirCover Terms
            </button>
          </div>

          <div className="flex items-center gap-4 font-semibold text-gray-800">
            <button 
              onClick={() => setActiveModal('lang')}
              className="flex items-center gap-1.5 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              <Globe className="h-4 w-4 text-gray-700" />
              <span>English (IN)</span>
            </button>
            <button 
              onClick={() => setActiveModal('lang')}
              className="flex items-center gap-1.5 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition font-bold text-gray-900 cursor-pointer"
            >
              <span className="text-[#FF385C] font-extrabold text-sm">₹</span>
              <span>INR (₹)</span>
            </button>
          </div>

        </div>

      </div>

      {/* MODAL 1: HELP & SUPPORT MODAL */}
      {activeModal === 'support' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#FF385C]" />
                <h3 className="font-bold text-gray-900 text-lg">Airbnb Support & Guarantees</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Support Tabs */}
            <div className="flex border-b border-gray-200 text-xs font-bold">
              <button
                onClick={() => setSupportTab('aircover')}
                className={`flex-1 py-2.5 text-center border-b-2 transition cursor-pointer ${supportTab === 'aircover' ? 'border-[#FF385C] text-[#FF385C]' : 'border-transparent text-gray-500'}`}
              >
                AirCover
              </button>
              <button
                onClick={() => setSupportTab('cancellation')}
                className={`flex-1 py-2.5 text-center border-b-2 transition cursor-pointer ${supportTab === 'cancellation' ? 'border-[#FF385C] text-[#FF385C]' : 'border-transparent text-gray-500'}`}
              >
                Refund Policy
              </button>
              <button
                onClick={() => setSupportTab('safety')}
                className={`flex-1 py-2.5 text-center border-b-2 transition cursor-pointer ${supportTab === 'safety' ? 'border-[#FF385C] text-[#FF385C]' : 'border-transparent text-gray-500'}`}
              >
                Safety & Security
              </button>
            </div>

            {supportTab === 'aircover' && (
              <div className="space-y-3 text-xs text-gray-700 leading-relaxed pt-2">
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl space-y-1">
                  <h4 className="font-bold text-[#FF385C] text-sm flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    Always Included, Always Free
                  </h4>
                  <p>AirCover provides comprehensive protection for every guest and host on Airbnb India.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Booking Protection Guarantee:</strong> If a host cancels within 30 days of check-in, we'll find you a similar or better stay.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Get-What-You-Book Guarantee:</strong> If your listing isn't as advertised, we'll make it right or issue a 100% full refund.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Host Damage Protection:</strong> Up to ₹1,00,000 protection for hosts against rare property damage.</span>
                  </div>
                </div>
              </div>
            )}

            {supportTab === 'cancellation' && (
              <div className="space-y-3 text-xs text-gray-700 leading-relaxed pt-2">
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl space-y-1">
                  <h4 className="font-bold text-indigo-900 text-sm flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4 text-indigo-600" />
                    Hassle-Free Cancellation & Instant Refund Tracking
                  </h4>
                  <p>Guest cancellations automatically generate a unique Refund Reference ID (e.g. `RFD_982140`).</p>
                </div>
                <ul className="space-y-2 list-disc pl-4 text-gray-600">
                  <li><strong>Full Refund:</strong> 100% refund calculated for eligible stay cancellations.</li>
                  <li><strong>Timeline:</strong> Refund processing takes 3–5 business days to credit back to your original payment card or UPI/Razorpay account.</li>
                  <li><strong>Status Visibility:</strong> Real-time status update visible in your Profile under "My Reservations".</li>
                </ul>
              </div>
            )}

            {supportTab === 'safety' && (
              <div className="space-y-3 text-xs text-gray-700 leading-relaxed pt-2">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-1">
                  <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                    <Lock className="h-4 w-4 text-emerald-600" />
                    Verified Profiles & Secure Payments
                  </h4>
                  <p>All hosts and guests are verified for identity safety and secure transactions.</p>
                </div>
                <ul className="space-y-2 list-disc pl-4 text-gray-600">
                  <li>Encrypted Razorpay & Card payment gateway integration.</li>
                  <li>Initial-based avatar privacy for user identity protection.</li>
                  <li>24/7 dedicated Indian customer helpline & dispute resolution.</li>
                </ul>
              </div>
            )}

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-black transition shadow-sm mt-2 cursor-pointer"
            >
              Close Support Center
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: TERMS & PRIVACY MODAL */}
      {activeModal === 'terms' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-900">
                <FileText className="h-5 w-5 text-[#FF385C]" />
                <h3 className="font-bold text-lg">Terms & Privacy Policy</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-600 leading-relaxed">
              <h4 className="font-bold text-gray-900 text-sm">1. Terms of Service</h4>
              <p>By using Airbnb India, guests agree to respect host property rules and complete payments in Indian Rupee (₹). Hotel Managers agree to maintain accurate room inventory and honor accepted bookings.</p>
              
              <h4 className="font-bold text-gray-900 text-sm pt-2">2. Privacy & Data Protection</h4>
              <p>We store user credentials securely. Avatar displays use initial badges (e.g. SN, AS) to protect user photos unless specified.</p>

              <h4 className="font-bold text-gray-900 text-sm pt-2">3. Pricing & Taxes</h4>
              <p>All prices are listed in INR (₹) and include applicable taxes, cleaning fees, and service charges.</p>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-black transition shadow-sm mt-2 cursor-pointer"
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: LANGUAGE & CURRENCY MODAL */}
      {activeModal === 'lang' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-900">
                <Globe className="h-5 w-5 text-[#FF385C]" />
                <h3 className="font-bold text-lg">Language & Currency</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold text-gray-800">
              <div>
                <label className="block text-gray-400 uppercase text-[10px] font-bold mb-2">Selected Language</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 border-2 border-gray-900 rounded-xl bg-rose-50/30 flex items-center justify-between">
                    <span>English (IN)</span>
                    <CheckCircle2 className="h-4 w-4 text-[#FF385C]" />
                  </div>
                  <div className="p-3 border border-gray-200 rounded-xl opacity-60">
                    <span>हिन्दी (Hindi)</span>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-xl opacity-60">
                    <span>বাংলা (Bengali)</span>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-xl opacity-60">
                    <span>మరాఠీ (Marathi)</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 uppercase text-[10px] font-bold mb-2">Selected Currency</label>
                <div className="p-3 border-2 border-gray-900 rounded-xl bg-rose-50/30 flex items-center justify-between">
                  <div>
                    <span className="font-bold block">Indian Rupee</span>
                    <span className="text-gray-500 font-normal">INR – ₹</span>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-[#FF385C]" />
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 bg-[#FF385C] text-white font-bold text-xs rounded-xl hover:bg-[#E00B41] transition shadow-sm mt-2 cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

    </footer>
  );
};
