import React, { useState } from "react";
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';

const CustomWhatsAppEditor = ({ onMessageChange }) => {
  const [waMessage, setWaMessage] = useState("");
  const textareaRef = React.createRef();

  const handleInputChange = () => {
    const inputValue = textareaRef.current.value;
    setWaMessage(inputValue);
    onMessageChange(inputValue);
  };

  const insertText = (openTag, closeTag) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

    const selectedText = value.substring(start, end);
    const modifiedValue = `${value.substring(0, start)}${openTag}${selectedText}${closeTag}${value.substring(end)}`;
    textarea.value = modifiedValue;
    textarea.setSelectionRange(start + openTag.length, start + openTag.length + selectedText.length);
    textarea.focus();
    handleInputChange();
  };

  const formatPreview = (text) => {
    console.log(text);
    // Apply formatting to the text in the preview
    return text
      .replace(/\*(.*?)\*/g, (match, p1) => `<strong>${p1}</strong>`)
      .replace(/_(.*?)_/g, (match, p1) => `<em>${p1}</em>`)
      .replace(/~(.*?)~/g, (match, p1) => `<del>${p1}</del>`)
      .replace(/```(.*?)```/g, (match, p1) => `<code>${p1}</code>`);
  };

  return (
    <div>
      <div style={{ border: "1px solid gray" }}>
        <div style={{ borderBottom: "1px solid gray", padding: "5px", display: "flex", gap: "1.5rem", alignItems: "center", justifyContent: "center" }}>
          <FormatBoldIcon style={{ cursor: "pointer" }} onClick={() => insertText("*", "*")} />
          <FormatItalicIcon style={{ cursor: "pointer" }} onClick={() => insertText("_", "_")} />
          <img onClick={() => insertText("~", "~")} src="./strikethrough.png" style={{ color: "black", width: "13px", height: "17px", cursor: "pointer" }} alt="Strikethrough" />
          <img onClick={() => insertText("```", "```")} src="./monospace.png" style={{ color: "black", width: "20px", height: "22px", cursor: "pointer" }} alt="Monospace" />
        </div>

        <textarea
          ref={textareaRef}
          onChange={handleInputChange}
          placeholder="WA Message"
          value={waMessage}
          style={{
            fontFamily: "roboto",
            maxWidth: "100%",
            minWidth: "100%",
            maxHeight: "200px",
            overflowY: "auto",
            minHeight: "100px",
            paddingLeft: "10px",
            paddingTop: "10px",
            border: "none",
            outline: "none"
          }}
        ></textarea>
      </div>

      {
        waMessage?.length > 0 && <div style={{ marginTop: "10px" }}>
          <strong>Preview:</strong>
          <div style={{ minHeight: "100px", padding: "10px", overflowY: "auto" }} dangerouslySetInnerHTML={{ __html: formatPreview(waMessage) }}></div>
        </div>
      }
    </div>
  );
};

export default CustomWhatsAppEditor;
