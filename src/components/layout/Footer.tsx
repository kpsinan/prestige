// src/components/layout/Footer.tsx

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-black tracking-tighter mb-4">PRESTIGE TRADERS</h2>
            <p className="text-gray-400 text-sm max-w-sm">
              Providing high-quality genuine car spare parts since 2009. 
              Based in Edakkara, Malappuram, Kerala.
            </p>
          </div>
          <div className="flex flex-col md:items-end justify-center">
            <p className="text-xs font-black uppercase tracking-widest text-gray-500">© {new Date().getFullYear()} All Rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
}