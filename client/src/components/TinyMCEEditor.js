import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const TinyMCEEditor = ({ fileId }) => {
  const [content, setContent] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const editorRef = useRef(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/files/${fileId}`);
        // console.log(response.data.content)
        setContent(response.data.content);
        setEditedContent(response.data.content);
      } catch (error) {
        console.error("Error fetching file content:", error);
      }
    };

    if (fileId) {
      fetchContent();
    }
  }, [fileId]);

  useEffect(() => {
    const loadTinyMCE = async () => {
      if (!window.tinymce) {
        const script = document.createElement("script");
        script.src = "/tinymce/tinymce.min.js";
        script.referrerPolicy = "origin";

        script.onload = () => {
          window.tinymce.init({
            selector: "#editor",
            license_key: "gpl",
            height: 500,
            menubar: true,
            plugins: 'lists link image code pagebreak advlist autolink lists charmap preview anchor searchreplace wordcount visualblocks code fullscreen insertdatetime media table emoticons codesample',
            toolbar:
              "undo redo | styles | bold italic underline | alignleft aligncenter alignright alignjustify |" +
              "bullist numlist outdent indent | link image | print preview media fullscreen |" +
              "forecolor backcolor emoticons",
            content_style:
              "body { font-family: Helvetica, Arial, sans-serif; font-size:16px }",
            setup: (editor) => {
              editorRef.current = editor;
              editor.on("init", () => {
                editor.setContent(content);
              });
              editor.on("Change", () => {
                const newContent = editor.getContent();
                setContent(newContent);
              });
            },
          });
        };

        document.body.appendChild(script);
      } else {
        window.tinymce.init({
          selector: "#editor",
          license_key: "gpl",
          height: 500,
          menubar: true,
          plugins: 'lists link image code pagebreak advlist autolink lists charmap preview anchor searchreplace wordcount visualblocks code fullscreen insertdatetime media table emoticons codesample',
          toolbar:
            "undo redo | styles | bold italic underline | alignleft aligncenter alignright alignjustify |" +
            "bullist numlist outdent indent | link image | print preview media fullscreen |" +
            "forecolor backcolor emoticons",
          content_style:
            "body { font-family: Helvetica, Arial, sans-serif; font-size:16px }",
          setup: (editor) => {
            editorRef.current = editor;
            editor.on("init", () => {
              editor.setContent(content);
            });
            editor.on("Change", () => {
              const newContent = editor.getContent();
              setContent(newContent);
            });
          },
        });
      }
    };

    loadTinyMCE();

    return () => {
      if (editorRef.current) {
        window.tinymce.remove(editorRef.current);
      }
    };
  }, [fileId, editedContent]);

  const handleSaveFile = async (fileId) => {
    try {
      console.log("handle save file");
      const updatedContent = editorRef.current.getContent(); // Get current content from TinyMCE
      setEditedContent(updatedContent);
      console.log(updatedContent,"updatedddddddddddd");
      await axios.put(`http://localhost:5000/${fileId}`, {
        content: updatedContent,
      });
      console.log("File saved successfully!");
    } catch (error) {
      console.error("Error saving file:", error);
    }
  };

  return (
    <>
      <div className="kreena">
        <textarea id="editor" />
        {/* <button onClick={() => handleSaveFile(fileId)}>Save</button> */}
        <button onClick={(e) => { e.preventDefault(); handleSaveFile(fileId); }}>Save</button>
      </div>
    </>
  );
};

export default TinyMCEEditor;