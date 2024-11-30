import { useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import 'ckeditor5/ckeditor5.css';

function TextEditor({ value = '', onChange }) {
  const editorToolbarRef = useRef(null);

  useEffect(() => {
    return () => {
      // Clean up toolbar reference on unmount
      if (editorToolbarRef.current) {
        editorToolbarRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div>
      {/* Toolbar Container */}
      <div ref={editorToolbarRef}></div>
      {/* Editor Instance */}
      <CKEditor
        editor={DecoupledEditor}
        data={value}
        config={{
          plugins: DecoupledEditor.builtinPlugins,
          toolbar: ['undo', 'redo', '|', 'bold', 'italic', 'bulletedList', 'numberedList', '|', 'indent', 'outdent',
                'insertTable',
                'tableColumn',
                'tableRow',
                'mergeTableCells',],
          ui: {
            viewportTopOffset: 50, // Adjusts for any sticky headers
          },
          table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
          },
        }}
        onReady={(editor) => {
          if (editorToolbarRef.current) {
            editorToolbarRef.current.appendChild(editor.ui.view.toolbar.element);
            editor.ui.view.editable.element.style.height = '400px';
          }
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          if (onChange) {
            onChange(data); // Update parent component
          }
        }}
        onError={(error) => {
          console.error('CKEditor error:', error);
        }}
      />
    </div>
  );
}

export default TextEditor;
