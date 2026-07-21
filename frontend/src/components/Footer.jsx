import React from 'react';
import { Stethoscope } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-surface border-t border-surface-200 pt-10 pb-4 px-4 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between items-center md:items-start gap-10 md:gap-8">

        {/* ─── Brand ─── */}
        <div className="flex flex-col items-center md:items-start flex-1 min-w-[180px]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center shadow-sm">
              <Stethoscope size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-ink">
              Medi<span className="text-brand-600">Sync</span>
            </span>
          </div>
          <p className="text-ink-secondary text-sm text-center md:text-left max-w-xs">
            Your trusted healthcare partner.<br />
            Quality care and support for your well-being.
          </p>
        </div>

        {/* ─── Links ─── */}
        <div className="flex flex-1 justify-center md:justify-between gap-8 w-full md:w-auto">
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-sm font-semibold text-ink mb-3 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2">
              <li><a href="/about"   className="text-sm text-ink-secondary hover:text-brand-600 transition-colors font-medium">About Us</a></li>
              <li><a href="/careers" className="text-sm text-ink-secondary hover:text-brand-600 transition-colors font-medium">Careers</a></li>
            </ul>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-sm font-semibold text-ink mb-3 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2">
              <li><a href="/contact" className="text-sm text-ink-secondary hover:text-brand-600 transition-colors font-medium">Contact</a></li>
              <li><a href="/faq"     className="text-sm text-ink-secondary hover:text-brand-600 transition-colors font-medium">FAQ</a></li>
              <li><a href="/help"    className="text-sm text-ink-secondary hover:text-brand-600 transition-colors font-medium">Help Center</a></li>
            </ul>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-sm font-semibold text-ink mb-3 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              <li><a href="/privacy" className="text-sm text-ink-secondary hover:text-brand-600 transition-colors font-medium">Privacy Policy</a></li>
              <li><a href="/terms"   className="text-sm text-ink-secondary hover:text-brand-600 transition-colors font-medium">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* ─── Social ─── */}
        <div className="flex flex-col items-center md:items-end flex-1 min-w-[140px]">
          <h4 className="text-sm font-semibold text-ink mb-3 uppercase tracking-wider">Follow Us</h4>
          <div className="flex space-x-3 mt-1">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-xl bg-surface-100 hover:bg-brand-50 hover:text-brand-600 text-ink-secondary transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12"/>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-xl bg-surface-100 hover:bg-brand-50 hover:text-brand-600 text-ink-secondary transition-colors">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-xl bg-surface-100 hover:bg-brand-50 hover:text-brand-600 text-ink-secondary transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm6 1.25a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="divider mt-8 pt-4 text-center text-sm text-ink-muted">
        © {new Date().getFullYear()} <span className="font-semibold text-ink">MediSync</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;