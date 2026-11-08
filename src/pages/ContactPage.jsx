import { useRef, useState } from 'react';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { useToastStore } from '../store/useToastStore';
import { apiClient } from '../api/client';
import { Check } from 'lucide-react';

export default function ContactPage() {
  const formRef = useRef(null);
  const { addToast } = useToastStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(formRef.current);
    const contactData = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      // Send email through backend
      await apiClient.post('/contact', contactData);
      setSuccessData(contactData);
      setShowSuccessModal(true);
      formRef.current?.reset();
    } catch (error) {
      console.error('Failed to send message:', error);
      addToast('Failed to send message. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-16 animate-in fade-in duration-500">
      <div>
        <span className="text-xs font-bold tracking-widest text-brand-accentDark mb-4 block">WE'RE ALL EARS</span>
        <h1 className="text-5xl text-brand-primary mb-6">Let's talk<br /><em className="text-brand-accentDark">about books.</em></h1>
        <p className="text-lg text-gray-600 mb-8">Have a thought, a question, or a book you think we should read? We'd love to hear from you.</p>
        <a href="mailto:aliyhossain@gmail.com" className="font-semibold text-brand-primaryHover border-b-2 border-brand-accent pb-1 transition-colors hover:text-brand-primary">
          aliyhossain@gmail.com ↗
        </a>
      </div>
      
      <form ref={formRef} onSubmit={handleSubmit} className="bg-white border border-brand-border p-8 rounded-xl flex flex-col gap-6 shadow-sm">
        <Input label="Your name" name="name" required placeholder="How should we call you?" />
        <Input label="Email address" name="email" type="email" required placeholder="you@example.com" />
        <Textarea label="Your message" name="message" required rows="4" placeholder="Tell us what's on your mind..." />
        <Button type="submit" disabled={isLoading} className="self-start">
          {isLoading ? 'Sending...' : 'Send a note ↗'}
        </Button>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal 
          onClose={() => setShowSuccessModal(false)}
          data={successData}
        />
      )}
    </div>
  );
}

function SuccessModal({ onClose, data }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300 flex flex-col items-center text-center">
        {/* Profile Picture */}
        <div className="mb-6">
          <img 
            src="/favicon.svg" 
            alt="Profile" 
            className="w-24 h-24 rounded-full border-4 border-brand-primary object-cover mx-auto"
          />
        </div>

        {/* Success Icon */}
        <div className="mb-4 p-3 bg-green-100 rounded-full">
          <Check size={32} className="text-green-600" />
        </div>

        <h2 className="text-2xl font-bold text-brand-primary mb-2">Message Sent!</h2>
        <p className="text-gray-600 mb-4">Thank you for reaching out, {data?.name}.</p>
        
        <div className="bg-gray-50 p-4 rounded-lg w-full mb-6 text-left">
          <p className="text-xs text-gray-500 mb-1">We'll get back to you at:</p>
          <p className="text-sm font-semibold text-gray-700">{data?.email}</p>
        </div>

        <p className="text-gray-600 text-sm mb-6">
          We appreciate your feedback and will respond as soon as possible.
        </p>

        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primaryHover transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
