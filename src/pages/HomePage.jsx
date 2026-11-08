import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Lock } from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useBookStore } from '../store/useBookStore';
import { useAuthStore } from '../store/useAuthStore';
import { useEffect, useState } from 'react';

export default function HomePage() {
  useDocumentTitle('Read Better');
  const navigate = useNavigate();
  const { books, fetchBooks, setActiveBook } = useBookStore();
  const { isAuthenticated } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const firstTwoBooks = books.slice(0, 2);

  const handleBookClick = (bookId) => {
    if (!isAuthenticated) {
      setSelectedBookId(bookId);
      setShowLoginModal(true);
    } else {
      setActiveBook(bookId);
      navigate('/library');
    }
  };

  const handleLoginAndRead = (email) => {
    // Login logic is handled by the modal
    setActiveBook(selectedBookId);
    navigate('/library');
  };

  return (
    <div className="flex flex-col gap-24 pt-8 animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-500 mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-accentDark"></span>
            YOUR NEXT CHAPTER STARTS HERE
          </span>
          <h1 className="text-5xl md:text-6xl text-brand-primary leading-tight mb-6">
            A little more reading.<br />
            <em className="text-brand-accentDark font-medium">A lot more becoming.</em>
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-md">
            I am trying to develop a place where students will get the required assistance to overcome their barriers to learning in subjects like Accounting and Business studies. These academic contents have been made especially for students of Ordinary Level, Advanced Subsidiary Level & Advanced Level. It will be helpful if you please provide your feedback about the contents. I believe education is a right and should be available and free for everyone. Wish you the best, Mohammad Ali Yusuf Hossain.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/library" className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-primary text-[#fffdf7] text-sm font-semibold rounded hover:-translate-y-0.5 hover:bg-brand-primaryHover transition-all">
              Open my library <ArrowUpRight size={18} />
            </Link>
            <Link to="/about" className="text-sm font-semibold text-brand-primaryHover flex items-center gap-2 transition-colors">
              Get to know us <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        
        <div className="bg-[#e9e8d9] rounded-2xl p-8 h-[400px] flex flex-col justify-end relative overflow-hidden shadow-inner">
          <div className="absolute top-8 right-8 w-40 h-40 bg-[#d8c99f] rounded-full opacity-70 blur-2xl"></div>
          <div className="flex gap-4 items-end z-10 rotate-[-4deg] translate-y-4 hover:rotate-0 transition-transform duration-500 ease-out cursor-default">
            <div className="w-32 h-48 bg-[#435e4b] rounded shadow-2xl p-4 flex flex-col justify-center text-[#f7f2df]">
              <span className="font-serif text-2xl leading-none mb-2">THE ART OF FOCUS</span>
            </div>
            <div className="w-28 h-40 bg-[#bd805d] rounded shadow-xl p-4 flex flex-col justify-center text-[#fff6e8]">
              <span className="font-serif text-xl leading-none">little things, big change</span>
            </div>
          </div>
        </div>
      </section>



      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginAndRead}
        />
      )}
    </div>
  );
}

function LoginModal({ onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const { login } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      login(email);
      onLoginSuccess(email);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300">
        <h2 className="text-2xl font-bold text-brand-primary mb-2">Login Required</h2>
        <p className="text-gray-600 mb-6">Sign in to read this book</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primaryHover transition-colors"
            >
              Continue Reading
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
