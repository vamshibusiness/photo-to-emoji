import React from 'react';

const SOCIAL_LINKS = [
    { icon: 'fa-linkedin-in', url: 'https://linkedin.com/in/vamshi-krishna-687b05315', color: 'hover:text-blue-500' },
    { icon: 'fa-github', url: 'https://github.com/vamshibusiness', color: 'hover:text-gray-400' },
    { icon: 'fa-x-twitter', url: 'https://twitter.com/yourtwitterhandle', color: 'hover:text-sky-400' },
    { icon: 'fa-instagram', url: 'https://instagram.com/vamshi_krishna_v7', color: 'hover:text-pink-500' },
    { icon: 'fa-facebook-f', url: 'https://www.facebook.com/bandavamshikrishna2457', color: 'hover:text-blue-600' },
    { icon: 'fa-envelope', url: 'mailto:vamshibusiness07@gmail.com', color: 'hover:text-red-500', isSolid: true },
];

interface FooterProps {
    onTermsClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onTermsClick }) => {
    return (
        <footer className="mt-auto py-12 border-t border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 flex flex-col items-center space-y-8">

                <div className="flex items-center space-x-6">
                    <button
                        onClick={onTermsClick}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-colors"
                    >
                        Terms & Privacy
                    </button>
                    <div className="w-1 h-1 rounded-full bg-gray-200 dark:bg-gray-800" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        Production Build v2.4.0
                    </span>
                </div>
                <div className="flex items-center space-x-6">
                    {SOCIAL_LINKS.map((link, i) => (
                        <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`
                                w-11 h-11 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-900 
                                text-gray-400 transition-all duration-300 hover:scale-125 hover:-translate-y-2
                                ${link.color} hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] 
                                dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] group
                            `}
                        >
                            <i className={`${link.isSolid ? 'fas' : 'fab'} ${link.icon} text-xl transition-all duration-300 group-hover:drop-shadow-[0_0_8px_currentColor]`}></i>
                        </a>
                    ))}
                </div>

                <div className="flex flex-col items-center text-center">
                    <p className="text-sm font-black tracking-widest text-[#000000] dark:text-white uppercase transition-colors">
                        Developed by @vamshi_Krishna_v7
                    </p>
                </div>
            </div>
        </footer>
    );
};
