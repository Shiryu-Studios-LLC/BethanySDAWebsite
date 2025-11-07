import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Plus, Code, Library, Download, Upload, ChevronRight, ChevronDown, Check } from 'lucide-react';

// Common CSS properties for autocomplete
const CSS_PROPERTIES = [
  'display', 'position', 'width', 'height', 'margin', 'padding', 'color',
  'background', 'background-color', 'border', 'border-radius', 'font-size',
  'font-weight', 'text-align', 'flex', 'flex-direction', 'justify-content',
  'align-items', 'gap', 'grid-template-columns', 'grid-gap', 'overflow',
  'opacity', 'transform', 'transition', 'animation', 'box-shadow', 'z-index',
  'cursor', 'user-select', 'white-space', 'text-decoration', 'line-height'
];

// Preset utility classes
const PRESET_CLASSES = {
  'Layout': {
    'flex': 'display: flex',
    'flex-col': 'display: flex; flex-direction: column',
    'flex-row': 'display: flex; flex-direction: row',
    'grid': 'display: grid',
    'block': 'display: block',
    'inline': 'display: inline',
    'inline-block': 'display: inline-block',
    'hidden': 'display: none'
  },
  'Alignment': {
    'items-center': 'align-items: center',
    'items-start': 'align-items: flex-start',
    'items-end': 'align-items: flex-end',
    'justify-center': 'justify-content: center',
    'justify-between': 'justify-content: space-between',
    'justify-around': 'justify-content: space-around',
    'text-center': 'text-align: center',
    'text-left': 'text-align: left',
    'text-right': 'text-align: right'
  },
  'Spacing': {
    'm-0': 'margin: 0',
    'm-1': 'margin: 0.25rem',
    'm-2': 'margin: 0.5rem',
    'm-4': 'margin: 1rem',
    'm-8': 'margin: 2rem',
    'p-0': 'padding: 0',
    'p-1': 'padding: 0.25rem',
    'p-2': 'padding: 0.5rem',
    'p-4': 'padding: 1rem',
    'p-8': 'padding: 2rem',
    'gap-1': 'gap: 0.25rem',
    'gap-2': 'gap: 0.5rem',
    'gap-4': 'gap: 1rem'
  },
  'Typography': {
    'text-xs': 'font-size: 0.75rem',
    'text-sm': 'font-size: 0.875rem',
    'text-base': 'font-size: 1rem',
    'text-lg': 'font-size: 1.125rem',
    'text-xl': 'font-size: 1.25rem',
    'text-2xl': 'font-size: 1.5rem',
    'font-normal': 'font-weight: 400',
    'font-medium': 'font-weight: 500',
    'font-bold': 'font-weight: 700',
    'italic': 'font-style: italic',
    'underline': 'text-decoration: underline'
  },
  'Effects': {
    'shadow-sm': 'box-shadow: 0 1px 2px rgba(0,0,0,0.05)',
    'shadow': 'box-shadow: 0 1px 3px rgba(0,0,0,0.1)',
    'shadow-lg': 'box-shadow: 0 10px 15px rgba(0,0,0,0.1)',
    'rounded': 'border-radius: 0.25rem',
    'rounded-lg': 'border-radius: 0.5rem',
    'rounded-full': 'border-radius: 9999px',
    'opacity-50': 'opacity: 0.5',
    'opacity-75': 'opacity: 0.75',
    'cursor-pointer': 'cursor: pointer',
    'select-none': 'user-select: none'
  }
};

const CSSClassEditor = ({
  element,
  onClassChange = () => {},
  onStyleChange = () => {},
  isOpen = false,
  onClose = () => {}
}) => {
  const [classes, setClasses] = useState([]);
  const [customCSS, setCustomCSS] = useState('');
  const [activeTab, setActiveTab] = useState('classes');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showPropertyAutocomplete, setShowPropertyAutocomplete] = useState(false);
  const [autocompletePosition, setAutocompletePosition] = useState({ top: 0, left: 0 });
  const [currentProperty, setCurrentProperty] = useState('');
  const [computedStyles, setComputedStyles] = useState({});
  const [inheritedStyles, setInheritedStyles] = useState({});
  const cssEditorRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [classInput, setClassInput] = useState('');

  // Parse element's current classes and styles on mount
  useEffect(() => {
    if (element && isOpen) {
      // Get classes
      const elementClasses = element.className ? element.className.split(' ').filter(c => c) : [];
      setClasses(elementClasses);

      // Get inline styles
      const inlineStyle = element.style ? element.style.cssText : '';
      setCustomCSS(inlineStyle);

      // Get computed styles
      if (element instanceof HTMLElement) {
        const computed = window.getComputedStyle(element);
        const styles = {};
        CSS_PROPERTIES.forEach(prop => {
          const value = computed.getPropertyValue(prop);
          if (value) {
            styles[prop] = value;
          }
        });
        setComputedStyles(styles);

        // Get inherited styles from parent
        if (element.parentElement) {
          const parentComputed = window.getComputedStyle(element.parentElement);
          const inherited = {};
          ['color', 'font-size', 'font-weight', 'line-height', 'text-align'].forEach(prop => {
            const parentValue = parentComputed.getPropertyValue(prop);
            const currentValue = computed.getPropertyValue(prop);
            if (parentValue === currentValue) {
              inherited[prop] = parentValue;
            }
          });
          setInheritedStyles(inherited);
        }
      }
    }
  }, [element, isOpen]);

  // Handle class changes
  const handleClassToggle = (className) => {
    const newClasses = classes.includes(className)
      ? classes.filter(c => c !== className)
      : [...classes, className];
    setClasses(newClasses);
    onClassChange(newClasses);
  };

  // Add custom class
  const handleAddCustomClass = () => {
    if (classInput.trim() && !classes.includes(classInput.trim())) {
      const newClasses = [...classes, classInput.trim()];
      setClasses(newClasses);
      onClassChange(newClasses);
      setClassInput('');
    }
  };

  // Remove class
  const handleRemoveClass = (className) => {
    const newClasses = classes.filter(c => c !== className);
    setClasses(newClasses);
    onClassChange(newClasses);
  };

  // Apply preset class
  const applyPresetClass = (className, cssText) => {
    handleClassToggle(className);
  };

  // Handle CSS editor input
  const handleCSSChange = (e) => {
    const value = e.target.value;
    setCustomCSS(value);
    onStyleChange(value);

    // Check for property autocomplete
    const cursorPos = e.target.selectionStart;
    setCursorPosition(cursorPos);

    const lines = value.substring(0, cursorPos).split('\n');
    const currentLine = lines[lines.length - 1];

    // Show autocomplete if typing a property
    if (currentLine.match(/^\s*[a-z-]*$/i) && currentLine.trim().length > 0) {
      const rect = cssEditorRef.current.getBoundingClientRect();
      setAutocompletePosition({
        top: rect.top + (lines.length * 20),
        left: rect.left + (currentLine.length * 8)
      });
      setCurrentProperty(currentLine.trim());
      setShowPropertyAutocomplete(true);
    } else {
      setShowPropertyAutocomplete(false);
    }
  };

  // Insert property from autocomplete
  const insertProperty = (property) => {
    const before = customCSS.substring(0, cursorPosition - currentProperty.length);
    const after = customCSS.substring(cursorPosition);
    const newCSS = `${before}${property}: ;${after}`;
    setCustomCSS(newCSS);
    onStyleChange(newCSS);
    setShowPropertyAutocomplete(false);

    // Focus back and position cursor
    setTimeout(() => {
      if (cssEditorRef.current) {
        cssEditorRef.current.focus();
        const newPos = before.length + property.length + 2;
        cssEditorRef.current.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };

  // Export CSS
  const handleExport = () => {
    const cssContent = `.element {\n${customCSS.split(';').map(rule => '  ' + rule.trim()).join(';\n')}\n}`;
    const blob = new Blob([cssContent], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'styles.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import CSS
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        // Extract CSS rules (simple parsing)
        const rules = content.match(/[^{}]+{([^}]+)}/);
        if (rules && rules[1]) {
          setCustomCSS(rules[1].trim());
          onStyleChange(rules[1].trim());
        }
      };
      reader.readAsText(file);
    }
  };

  // Syntax highlighting for CSS
  const highlightCSS = (css) => {
    if (!css) return { __html: '' };

    let highlighted = css
      // Highlight properties (blue)
      .replace(/([a-z-]+)(?=\s*:)/gi, '<span style="color: #4a7ba7">$1</span>')
      // Highlight values (green)
      .replace(/:\s*([^;]+)/g, ': <span style="color: #5a9b5a">$1</span>')
      // Highlight strings (gray-blue)
      .replace(/(["'])(.*?)\1/g, '<span style="color: #7b8ba7">$1$2$1</span>')
      // Highlight numbers with units
      .replace(/(\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|deg|s|ms)?)/g, '<span style="color: #b5cea8">$1</span>')
      // Highlight hex colors
      .replace(/(#[0-9a-fA-F]{3,6})/g, '<span style="color: #ce9178">$1</span>');

    // Add line numbers
    const lines = highlighted.split('\n');
    const numberedLines = lines.map((line, i) =>
      `<div style="display: flex;"><span style="color: #5a5a5a; width: 30px; text-align: right; margin-right: 10px; user-select: none;">${i + 1}</span><span>${line}</span></div>`
    ).join('');

    return { __html: numberedLines };
  };

  // Filtered autocomplete properties
  const filteredProperties = useMemo(() => {
    if (!currentProperty) return CSS_PROPERTIES;
    return CSS_PROPERTIES.filter(prop =>
      prop.toLowerCase().includes(currentProperty.toLowerCase())
    );
  }, [currentProperty]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-[#1e1e1e] rounded-lg shadow-2xl w-[900px] h-[700px] flex flex-col border border-[#3a3a3a]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3a3a3a]">
          <div className="flex items-center gap-3">
            <Code className="w-5 h-5 text-[#4a7ba7]" />
            <h2 className="text-lg font-medium text-white">CSS Class & Style Editor</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#2a2a2a] rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#3a3a3a]">
          {['classes', 'styles', 'inspector', 'library'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-white border-b-2 border-[#4a7ba7] bg-[#252525]'
                  : 'text-gray-400 hover:text-white hover:bg-[#252525]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {/* Classes Tab */}
          {activeTab === 'classes' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Add Custom Class
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={classInput}
                    onChange={(e) => setClassInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCustomClass()}
                    placeholder="Enter class name..."
                    className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-white placeholder-gray-500 focus:outline-none focus:border-[#4a7ba7]"
                  />
                  <button
                    onClick={handleAddCustomClass}
                    className="px-4 py-2 bg-[#4a7ba7] text-white rounded hover:bg-[#5a8bb7] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Classes
                </label>
                <div className="flex flex-wrap gap-2">
                  {classes.length === 0 ? (
                    <span className="text-gray-500 text-sm">No classes applied</span>
                  ) : (
                    classes.map((cls) => (
                      <div
                        key={cls}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#2a2a2a] border border-[#3a3a3a] rounded text-sm text-white"
                      >
                        <span>{cls}</span>
                        <button
                          onClick={() => handleRemoveClass(cls)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Styles Tab */}
          {activeTab === 'styles' && (
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-300">
                  Custom CSS
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={handleExport}
                    className="px-3 py-1.5 bg-[#2a2a2a] text-white text-sm rounded hover:bg-[#3a3a3a] transition-colors flex items-center gap-2"
                  >
                    <Download className="w-3 h-3" />
                    Export
                  </button>
                  <label className="px-3 py-1.5 bg-[#2a2a2a] text-white text-sm rounded hover:bg-[#3a3a3a] transition-colors flex items-center gap-2 cursor-pointer">
                    <Upload className="w-3 h-3" />
                    Import
                    <input
                      type="file"
                      accept=".css"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-[#1e1e1e] rounded border border-[#3a3a3a] overflow-hidden">
                  <div
                    className="absolute inset-0 p-4 overflow-y-auto"
                    style={{
                      fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                      fontSize: '14px',
                      lineHeight: '20px'
                    }}
                    dangerouslySetInnerHTML={highlightCSS(customCSS)}
                  />
                  <textarea
                    ref={cssEditorRef}
                    value={customCSS}
                    onChange={handleCSSChange}
                    placeholder="/* Enter CSS properties */\ndisplay: flex;\njustify-content: center;\npadding: 1rem;"
                    className="absolute inset-0 p-4 bg-transparent text-transparent caret-white resize-none focus:outline-none"
                    style={{
                      fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                      fontSize: '14px',
                      lineHeight: '20px',
                      caretColor: 'white'
                    }}
                    spellCheck={false}
                  />
                </div>

                {/* Property Autocomplete */}
                {showPropertyAutocomplete && filteredProperties.length > 0 && (
                  <div
                    className="absolute bg-[#2a2a2a] border border-[#3a3a3a] rounded shadow-lg z-10 max-h-48 overflow-y-auto"
                    style={{
                      top: `${autocompletePosition.top - 350}px`,
                      left: `${autocompletePosition.left - 200}px`
                    }}
                  >
                    {filteredProperties.slice(0, 10).map((prop) => (
                      <button
                        key={prop}
                        onClick={() => insertProperty(prop)}
                        className="block w-full px-3 py-2 text-left text-sm text-white hover:bg-[#3a3a3a] transition-colors"
                      >
                        {prop}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Inspector Tab */}
          {activeTab === 'inspector' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Computed Styles</h3>
                  <div className="space-y-2">
                    {Object.entries(computedStyles).map(([prop, value]) => {
                      const isInherited = inheritedStyles[prop] === value;
                      return (
                        <div
                          key={prop}
                          className={`flex items-center justify-between px-3 py-2 bg-[#2a2a2a] rounded text-sm ${
                            isInherited ? 'opacity-60' : ''
                          }`}
                        >
                          <span className="text-[#4a7ba7]" style={{ fontFamily: 'monospace' }}>
                            {prop}
                          </span>
                          <span className="text-[#5a9b5a]" style={{ fontFamily: 'monospace' }}>
                            {value}
                          </span>
                          {isInherited && (
                            <span className="text-xs text-gray-500 ml-2">(inherited)</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Library Tab */}
          {activeTab === 'library' && (
            <div className="p-6 h-full overflow-y-auto">
              <div className="space-y-4">
                {Object.entries(PRESET_CLASSES).map(([category, presets]) => (
                  <div key={category} className="border border-[#3a3a3a] rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedCategories(prev => ({
                        ...prev,
                        [category]: !prev[category]
                      }))}
                      className="w-full px-4 py-3 bg-[#2a2a2a] text-left flex items-center justify-between hover:bg-[#3a3a3a] transition-colors"
                    >
                      <span className="text-sm font-medium text-white">{category}</span>
                      {expandedCategories[category] ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </button>

                    {expandedCategories[category] && (
                      <div className="p-4 bg-[#1a1a1a] grid grid-cols-2 gap-3">
                        {Object.entries(presets).map(([className, cssText]) => (
                          <button
                            key={className}
                            onClick={() => applyPresetClass(className, cssText)}
                            className={`px-3 py-2 text-sm rounded border transition-all ${
                              classes.includes(className)
                                ? 'bg-[#4a7ba7] border-[#4a7ba7] text-white'
                                : 'bg-[#2a2a2a] border-[#3a3a3a] text-gray-300 hover:border-[#4a7ba7]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span style={{ fontFamily: 'monospace' }}>{className}</span>
                              {classes.includes(className) && (
                                <Check className="w-3 h-3 ml-2" />
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 text-left" style={{ fontFamily: 'monospace' }}>
                              {cssText.length > 30 ? cssText.substring(0, 30) + '...' : cssText}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#3a3a3a]">
          <div className="text-xs text-gray-500">
            {classes.length} classes • {customCSS.split(';').filter(s => s.trim()).length} custom rules
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#2a2a2a] text-white rounded hover:bg-[#3a3a3a] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onClassChange(classes);
                onStyleChange(customCSS);
                onClose();
              }}
              className="px-4 py-2 bg-[#4a7ba7] text-white rounded hover:bg-[#5a8bb7] transition-colors"
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSSClassEditor;