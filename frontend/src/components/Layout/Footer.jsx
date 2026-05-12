import { GraduationCap, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary-500" />
            <span className="font-semibold">PlacementPortal</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span>© {currentYear} PlacementPortal. All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>for placement aspirants</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;