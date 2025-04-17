import React, { useState } from 'react';
import { Upload, Download, RefreshCw } from 'lucide-react';

function App() {
  const [base64Result, setBase64Result] = useState<string>('');
  const [cssFormat, setCssFormat] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Extract just the base64 part without the data URL prefix
        const base64Only = base64String.split(',')[1];
        setBase64Result(base64Only);
        
        // Format for CSS background-image, keeping the full data URL
        const cssString = `background-image: url('${base64String}');\nbackground-repeat: no-repeat;\nbackground-size: contain;`;
        setCssFormat(cssString);
        
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error converting file:', error);
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([base64Result], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'base64_content.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleReset = () => {
    setBase64Result('');
    setCssFormat('');
    // Reset the file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Image to Base64 Converter
          </h1>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-gray-500 rounded hover:bg-gray-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="mb-8">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG or SVG files</p>
            </div>
            <input
              id="file-upload"
              type="file"
              accept=".png,.svg"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {loading && (
          <div className="text-center text-gray-600">Converting...</div>
        )}

        {base64Result && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">Raw Base64:</h2>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-green-500 rounded hover:bg-green-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
              <textarea
                readOnly
                value={base64Result}
                className="w-full h-24 p-3 text-sm text-gray-700 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => navigator.clipboard.writeText(base64Result)}
                  className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-700">CSS Format:</h2>
              <textarea
                readOnly
                value={cssFormat}
                className="w-full h-24 p-3 text-sm text-gray-700 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => navigator.clipboard.writeText(cssFormat)}
                  className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Preview:</h3>
              <div 
                className="w-full h-40 border rounded-lg"
                style={{ backgroundImage: `url(data:image/png;base64,${base64Result})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;