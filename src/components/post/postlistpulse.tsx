const Postlistpulse = () => {
  const pulse = [1, 2, 3, 4];
  return (
    <div className="w-full mx-auto mb-2 mt-4">
      {pulse.map((key) => (
        <div className="animate-pulse flex space-x-4 w-full mb-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white/90 dark:bg-slate-700/90" key={key}>
          <div className=" bg-slate-300 h-28 w-28"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-3 bg-slate-300 w-80 rounded"></div>
            <div className="space-y-3">
              <div className="h-3 bg-slate-300 rounded"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-3 bg-slate-300 rounded col-span-2"></div>
                <div className="h-3 bg-slate-300 rounded col-span-1"></div>
              </div>
              <div className="flex justify-end">
                <div className="h-6 w-16 bg-slate-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Postlistpulse;
