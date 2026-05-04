import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const FAQS = [
  {
    q: 'How do I reset my password?',
    a: 'Go to Settings → Change Password. Enter your current password, then set a new one with at least 6 characters. If you\'ve forgotten your password entirely, contact your administrator.'
  },
  {
    q: 'Can I have multiple boards?',
    a: 'Yes — you can create unlimited boards. Use the "+ Create Board" button in the sidebar or the dashed card on the Dashboard. Each board is completely independent with its own tasks.'
  },
  {
    q: 'How does drag and drop work?',
    a: 'On the Project Board page, click and hold any task card, then drag it to another column. The change is saved to the database automatically. If the move fails, the card reverts to its original position.'
  },
  {
    q: 'Why can\'t I see my team members?',
    a: 'Team members only appear in the Team Directory once they have registered on the platform. Share the app URL with your colleagues and ask them to sign up.'
  },
  {
    q: 'What are the task priority levels?',
    a: 'Tasks have four priority levels: Critical (red), High (orange), Medium (yellow), and Low (green). You can set priority when creating a card and view/filter all your tasks by priority on the My Tasks page.'
  },
  {
    q: 'Can I delete a board?',
    a: 'Yes. On the Dashboard, hover over any board card, click the three-dot (⋯) menu, and select "Delete Board". Warning: this also deletes all tasks inside that board and cannot be undone.'
  },
  {
    q: 'Is the app production ready?',
    a: 'Yes — it uses MongoDB Atlas for cloud storage, bcrypt for password hashing, and JWT for secure authentication. Deploy the backend to any Node.js host (Render, Railway, etc.) and the frontend to Vercel or Netlify.'
  },
  {
    q: 'How do I deploy to production?',
    a: 'Backend: set the MONGO_URI and JWT_SECRET environment variables, then run "npm start". Frontend: run "npm run build" and upload the dist/ folder to your hosting. Update the API_BASE in src/api.js to point to your live backend URL.'
  },
];

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-b border-outline-variant/30 last:border-b-0 transition-colors ${open ? 'bg-surface-container-low' : ''}`}>
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
        onClick={() => setOpen(v => !v)}
      >
        <span className="font-body-md text-body-md font-medium text-on-surface">{faq.q}</span>
        <span className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}>
          keyboard_arrow_down
        </span>
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export default function Support() {
  const { showToast } = useApp();
  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    // Simulate API call (no email service configured, UI demonstrates the flow)
    await new Promise(res => setTimeout(res, 1200));
    setSending(false);
    setSent(true);
    showToast('Message sent! We\'ll get back to you shortly.', 'success');
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  const INPUT_CLS = 'w-full h-10 px-3 border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface bg-surface-container-lowest placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all';

  return (
    <div className="flex-1 overflow-y-auto bg-surface">
      {/* Header */}
      <div className="px-margin-page py-xl border-b border-outline-variant/30 bg-surface-container-lowest shrink-0">
        <h2 className="font-headline-xl text-headline-xl text-on-surface mb-1">Support Center</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Find answers to common questions or send us a message.
        </p>
      </div>

      <div className="p-margin-page">

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: 'menu_book',      title: 'Documentation',  desc: 'Full guides and API reference.',   link: '/docs',    linkLabel: 'Read docs' },
            { icon: 'bug_report',     title: 'Report a Bug',   desc: 'Found something broken? Tell us.', link: '#contact', linkLabel: 'Report now' },
            { icon: 'keyboard',       title: 'Shortcuts',      desc: 'Work faster with keyboard shortcuts.', link: '/docs#shortcuts', linkLabel: 'View shortcuts' },
          ].map(card => (
            <div key={card.title} className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-5 hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-[28px] text-primary mb-3 block">{card.icon}</span>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{card.title}</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">{card.desc}</p>
              <a
                href={card.link}
                className="font-label-md text-label-md text-primary hover:underline flex items-center gap-1"
              >
                {card.linkLabel}
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </a>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQ */}
          <div>
            <h3 className="font-headline-lg text-headline-lg text-on-surface mb-4">Frequently Asked Questions</h3>
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg overflow-hidden">
              {FAQS.map((faq, i) => <FAQItem key={i} faq={faq} />)}
            </div>
          </div>

          {/* Contact Form */}
          <div id="contact">
            <h3 className="font-headline-lg text-headline-lg text-on-surface mb-4">Contact Us</h3>
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-6">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <span className="material-symbols-outlined text-[32px]">check_circle</span>
                  </div>
                  <h4 className="font-headline-md text-headline-md text-on-surface">Message Received!</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSend} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-md text-label-md text-on-surface-variant">NAME *</label>
                      <input
                        name="name" type="text" required
                        placeholder="John Doe"
                        value={form.name} onChange={handleChange}
                        className={INPUT_CLS}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-md text-label-md text-on-surface-variant">EMAIL *</label>
                      <input
                        name="email" type="email" required
                        placeholder="you@email.com"
                        value={form.email} onChange={handleChange}
                        className={INPUT_CLS}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface-variant">SUBJECT</label>
                    <input
                      name="subject" type="text"
                      placeholder="What is this about?"
                      value={form.subject} onChange={handleChange}
                      className={INPUT_CLS}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md text-on-surface-variant">MESSAGE *</label>
                    <textarea
                      name="message" required rows={5}
                      placeholder="Describe your issue or question in detail…"
                      value={form.message} onChange={handleChange}
                      className="w-full px-3 py-2 border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface bg-surface-container-lowest placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="h-10 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {sending ? (
                      <><span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>Sending…</>
                    ) : (
                      <><span className="material-symbols-outlined text-[16px]">send</span>Send Message</>
                    )}
                  </button>

                  <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
                    Or email us directly at{' '}
                    <a href="mailto:support@devflowops.com" className="text-primary hover:underline">
                      support@devflowops.com
                    </a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
