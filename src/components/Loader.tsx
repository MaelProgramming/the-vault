const Loader = () => (
  <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FDFDFD]">
    <div className="flex flex-col items-center w-64 animate-in fade-in duration-500"> 
      <h2 className="text-4xl font-serif text-vault-black italic mb-4">The Vault</h2>
      <div className="h-[1px] w-full bg-vault-gold animate-shimmer-line"></div>
      <p className="mt-6 text-[10px] tracking-[0.4em] uppercase text-stone-500 font-light">
        Curating Excellence
      </p>
    </div>
  </div>
);

export default Loader;