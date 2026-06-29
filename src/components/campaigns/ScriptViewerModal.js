import React from "react";
import { X } from "lucide-react";

export default function ScriptViewerModal({ isOpen, onClose, content, title = "Chi tiết kịch bản" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex flex-col overflow-hidden max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white tiptap-editor">
          {content?.startsWith('<') ? (
            <div dangerouslySetInnerHTML={{ __html: content }} className="leading-relaxed text-gray-800 text-base" />
          ) : content?.startsWith('http') ? (
             <div className="flex flex-col items-center justify-center py-10 gap-4">
                <p className="text-gray-500">Kịch bản được nộp dưới dạng đường dẫn (URL):</p>
                <a href={content} target="_blank" rel="noreferrer" className="px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition shadow-sm break-all text-center">
                  Mở liên kết
                </a>
             </div>
          ) : (
            <p className="whitespace-pre-wrap leading-relaxed text-gray-800 text-base">{content}</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-end bg-white">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
