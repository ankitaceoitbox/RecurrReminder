import "./global.css"
import React, { useState } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { stateToHTML } from 'draft-js-export-html';

function RichTextEditor({ onChange }) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    const contentState = newEditorState.getCurrentContent();
    const html = stateToHTML(contentState);
    onChange(html);
  };

  return (
    <div>
   
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
      />
    </div>
  );
}

export default RichTextEditor;
