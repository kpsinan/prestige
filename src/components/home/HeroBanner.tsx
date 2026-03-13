// src/components/home/HeroBanner.tsx

export default function HeroBanner() {
  return (
    <section className="relative bg-prestige-black text-white py-20 overflow-hidden">
      {/* Abstract Background Design */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-prestige-blue via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-gray-800 via-transparent to-transparent"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
        <span className="text-prestige-blue font-bold tracking-widest text-sm uppercase mb-4 drop-shadow-md">
          Premium Auto Parts Since 2009
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Keep Your Vehicle <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Performing at Its Peak
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 font-light">
          Directly sourced, genuine spare parts for Toyota and more. 
          Guaranteed fitment, fast shipping, and secure guest checkout.
        </p>
      </div>
    </section>
  );
}