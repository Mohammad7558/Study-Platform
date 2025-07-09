import React from 'react';
import { Link } from 'react-router';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-8">
            <div className="container mx-auto flex justify-between items-start">
                {/* Section 1: Branding */}
                <div>
                    <h2 className="text-2xl font-bold text-cyan-500 mb-2">My Website</h2>
                    <p className="text-sm">
                        Building meaningful web experiences with modern tech.
                    </p>
                </div>

                {/* Section 2: Quick Links */}
                <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Quick Links</h3>
                    <ul className="space-y-1">
                        <li><Link to="/" className="hover:text-cyan-400">Home</Link></li>
                        <li><Link to="/about" className="hover:text-cyan-400">About</Link></li>
                        <li><Link to="/contact" className="hover:text-cyan-400">Contact</Link></li>
                    </ul>
                </div>

                {/* Section 3: Contact */}
                <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Contact</h3>
                    <p>Email: <a href="mailto:info@example.com" className="hover:text-cyan-400">info@example.com</a></p>
                    <p>Phone: <a href="tel:+1234567890" className="hover:text-cyan-400">+123 456 7890</a></p>
                </div>
            </div>

            <div className="text-center text-sm text-gray-500 mt-8 border-t border-gray-700 pt-4">
                © {new Date().getFullYear()} My Website. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
