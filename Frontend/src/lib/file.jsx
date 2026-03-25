import { useRef } from "react";

export function FileUploud({ value = [], onChange, maxFiles = 3 }) {
  const inputRef = useRef(null);

  function handleAddFile(fileList) {
    const newFile = [...value];

    Array.from(fileList).forEach(function (file) {
      if (newFile.length >= maxFiles) return;
      newFile.push(file);
    });

    onChange(newFile);
  }

  function handleRemove(index) {
    const newFile = value.filter(function (_, i) {
      return i !== index;
    });
    onChange(newFile);
  }
  return (
    <div>
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleAddFile(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        <p className="text-2xl">☁</p>
        <p className="text-sm font-medium text-gray-700">
          Klik atau drag file ke sini
        </p>
        <p className="text-xs text-gray-400 mt-1">Maks. {maxFiles} file</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => {
            handleAddFile(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <div className="flex flex-wrap gap-3 mt-3">
        {value.map(function (file, index) {
          return (
            <div
              key={index}
              className="relative w-24 rounded-lg border border-gray-200 overflow-hidden"
            >
              {file.type.startsWith("image/") ? (
                <>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-20 object-cover"
                  />
                  <div className="bg-black/50 px-2 py-0.5">
                    <p className="text-white text-[10px] truncate">
                      {file.name}
                    </p>
                  </div>
                </>
              ) : (
                <div className="h-20 flex flex-col items-center justify-center gap-1 px-2 bg-gray-50">
                  <span className="text-2xl">📄</span>
                  <span className="text-[10px] text-gray-500 text-center break-all">
                    {file.name}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm flex items-center justify-center"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}