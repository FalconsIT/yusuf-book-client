import { useRef, useState } from 'react';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { useToastStore } from '../store/useToastStore';
import { apiClient } from '../api/client';

export default function ContactPage() {
  const formRef = useRef(null);
  const { addToast } = useToastStore();
  const [isLoading, setIsLoading] = useState(false);

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
      addToast('Your message has been sent successfully!', 'success');
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
    </div>
  );
}
