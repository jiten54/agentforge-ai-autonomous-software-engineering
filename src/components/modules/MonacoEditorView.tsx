import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import {
  TerminalSquare,
  Save,
  RotateCcw,
  CheckCircle2,
  FileCode,
  FolderOpen,
  Sparkles,
  Play
} from 'lucide-react';
import { ProjectFile } from '../../types';

interface MonacoEditorViewProps {
  files: ProjectFile[];
  onSaveFile: (path: string, content: string) => void;
  onAddLog: (message: string, agent?: any, level?: any) => void;
}

export const MonacoEditorView: React.FC<MonacoEditorViewProps> = ({
  files,
  onSaveFile,
  onAddLog,
}) => {
  const [activeFile, setActiveFile] = useState<ProjectFile>(files[0]);
  const [editorContent, setEditorContent] = useState<string>(files[0]?.content || '');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSelectFile = (file: ProjectFile) => {
    setActiveFile(file);
    setEditorContent(file.content);
    setHasUnsavedChanges(false);
  };

  const handleContentChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditorContent(value);
      setHasUnsavedChanges(value !== activeFile.content);
    }
  };

  const handleSave = () => {
    onSaveFile(activeFile.path, editorContent);
    setHasUnsavedChanges(false);
    setSavedSuccess(true);
    onAddLog(`Saved manual modifications to ${activeFile.path}`, 'developer', 'INFO');
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const getMonacoLanguage = (lang: string): string => {
    switch (lang.toLowerCase()) {
      case 'python':
        return 'python';
      case 'typescript':
      case 'tsx':
        return 'typescript';
      case 'javascript':
        return 'javascript';
      case 'dockerfile':
        return 'dockerfile';
      case 'bicep':
      case 'json':
        return 'json';
      case 'markdown':
        return 'markdown';
      case 'sql':
        return 'sql';
      default:
        return 'plaintext';
    }
  };

  return (
    <div className="space-y-4 pb-12 h-[calc(100vh-7rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-800 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <TerminalSquare className="w-5 h-5 text-blue-400" />
            <span>Monaco Code Editor (IDE)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Full-featured in-browser code editor with syntax highlighting, diagnostics, and direct repository persistence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Saved</span>
            </span>
          )}

          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
              hasUnsavedChanges
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Editor Main Container */}
      <div className="flex-1 rounded-xl bg-[#0d121f] border border-slate-800 overflow-hidden flex flex-col min-h-[500px]">
        {/* File Tabs Header */}
        <div className="bg-slate-950 border-b border-slate-800 flex items-center overflow-x-auto shrink-0">
          {files.map(file => {
            const isSelected = activeFile.path === file.path;
            return (
              <button
                key={file.path}
                onClick={() => handleSelectFile(file)}
                className={`px-3.5 py-2 text-xs font-mono flex items-center gap-2 border-r border-slate-800 transition ${
                  isSelected
                    ? 'bg-[#1e1e1e] text-blue-400 border-t-2 border-t-blue-500 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span className="truncate max-w-[180px]">{file.path}</span>
                {isSelected && hasUnsavedChanges && (
                  <span className="w-2 h-2 rounded-full bg-amber-400" title="Unsaved changes" />
                )}
              </button>
            );
          })}
        </div>

        {/* Monaco Editor Container */}
        <div className="flex-1 w-full bg-[#1e1e1e]">
          <Editor
            height="100%"
            theme="vs-dark"
            language={getMonacoLanguage(activeFile.language)}
            value={editorContent}
            onChange={handleContentChange}
            options={{
              minimap: { enabled: true },
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
              lineNumbers: 'on',
              folding: true,
              tabSize: 2,
            }}
          />
        </div>

        {/* Footer info bar */}
        <div className="h-7 bg-[#0b0f17] border-t border-slate-800/80 px-4 flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0">
          <div className="flex items-center space-x-4">
            <span className="text-slate-200 font-semibold">{activeFile.path}</span>
            <span>Language: {activeFile.language}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>UTF-8</span>
            <span>Spaces: 2</span>
            <span className="text-emerald-400">● Monaco Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
