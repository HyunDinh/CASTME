"use client";

import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { X, Link as LinkIcon, Edit3, Bold, Italic, List, ListOrdered, Undo, Redo } from "lucide-react";

export default function ScriptEditorModal({ isOpen, onClose, onSubmit }) {
  const [activeTab, setActiveTab] = useState("WRITE"); // "WRITE" | "LINK"
  const [linkValue, setLinkValue] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Bắt đầu soạn kịch bản của bạn tại đây...",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[300px] p-4 text-gray-800 text-sm leading-relaxed max-h-[50vh] overflow-y-auto tiptap-editor",
      },
    },
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (activeTab === "WRITE") {
      if (!editor) return;
      const html = editor.getHTML();
      if (editor.getText().trim() === "") {
        alert("Vui lòng nhập nội dung kịch bản!");
        return;
      }
      onSubmit(html);
    } else {
      if (!linkValue.trim()) {
        alert("Vui lòng nhập link kịch bản!");
        return;
      }
      onSubmit(linkValue);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <style dangerouslySetInnerHTML={{__html: `
        .tiptap-editor p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .tiptap-editor ul { list-style-type: disc; padding-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
        .tiptap-editor ol { list-style-type: decimal; padding-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
        .tiptap-editor p { margin-bottom: 0.5rem; }
        .tiptap-editor strong { font-weight: 700; color: #111827; }
        .tiptap-editor em { font-style: italic; }
      `}} />
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl flex flex-col overflow-hidden max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Nộp kịch bản</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 px-6 pt-4 border-b border-gray-100 bg-white">
          <button 
            onClick={() => setActiveTab("WRITE")}
            className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "WRITE" ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Edit3 size={18} /> Soạn thảo trực tiếp
          </button>
          <button 
            onClick={() => setActiveTab("LINK")}
            className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "LINK" ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <LinkIcon size={18} /> Dán Link (Google Docs)
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          {activeTab === "WRITE" ? (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
                <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-2 rounded hover:bg-gray-200 cursor-pointer ${editor?.isActive('bold') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
                  title="In đậm"
                >
                  <Bold size={16} />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded hover:bg-gray-200 cursor-pointer ${editor?.isActive('italic') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
                  title="In nghiêng"
                >
                  <Italic size={16} />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <button
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`p-2 rounded hover:bg-gray-200 cursor-pointer ${editor?.isActive('bulletList') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
                  title="Danh sách"
                >
                  <List size={16} />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={`p-2 rounded hover:bg-gray-200 cursor-pointer ${editor?.isActive('orderedList') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
                  title="Danh sách số"
                >
                  <ListOrdered size={16} />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <button
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor?.can().undo()}
                  className="p-2 rounded hover:bg-gray-200 text-gray-600 disabled:opacity-30 cursor-pointer"
                  title="Hoàn tác"
                >
                  <Undo size={16} />
                </button>
                <button
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor?.can().redo()}
                  className="p-2 rounded hover:bg-gray-200 text-gray-600 disabled:opacity-30 cursor-pointer"
                  title="Làm lại"
                >
                  <Redo size={16} />
                </button>
              </div>
              
              {/* Editor */}
              <div className="flex-1 cursor-text bg-white" onClick={() => editor?.commands.focus()}>
                <EditorContent editor={editor} />
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <label className="block text-sm font-bold text-gray-700 mb-2">Đường dẫn kịch bản (URL)</label>
              <input 
                type="url"
                value={linkValue}
                onChange={(e) => setLinkValue(e.target.value)}
                placeholder="https://docs.google.com/document/..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
              />
              <p className="text-xs text-gray-500 mt-3 flex flex-col gap-1">
                <span>Lưu ý: Hãy chắc chắn bạn đã mở quyền truy cập (Anyone with the link can view) cho link này để Shop có thể xem.</span>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
          >
            Hủy
          </button>
          <button 
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition shadow-md shadow-blue-200 cursor-pointer"
          >
            Nộp bài
          </button>
        </div>

      </div>
    </div>
  );
}
