import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const TinyMCEEditor = ({ fileId }) => {
    const [content, setContent] = useState('');
    const editorRef = useRef(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/${fileId}`);
                console.log(response.data.content)
                setContent(response.data.content);
            } catch (error) {
                console.error('Error fetching file content:', error);
            }
        };

        if (fileId) {
            fetchContent();
        }
    }, [fileId]);

    useEffect(() => {
        const loadTinyMCE = async () => {
            if (!window.tinymce) {
                const script = document.createElement('script');
                script.src = '/tinymce/tinymce.min.js';
                script.referrerPolicy = 'origin';

                script.onload = () => {
                    window.tinymce.init({
                        selector: '#editor',
                        height: 500,
                        menubar: false,
                        plugins: 'lists link image code',
                        toolbar:
                            'undo redo | formatselect | bold italic | ' +
                            'alignleft aligncenter alignright | ' +
                            'bullist numlist outdent indent | removeformat | help',
                        setup: (editor) => {
                            editorRef.current = editor;
                            editor.setContent(content);
                            editor.on('Change', () => {
                                setContent(editor.getContent()); // Update content state on editor change
                            });
                        },
                    });
                };

                document.body.appendChild(script);
            } else {
                // TinyMCE is already loaded, initialize directly
                window.tinymce.init({
                    selector: '#editor',
                    height: 500,
                    menubar: false,
                    plugins: 'lists link image code',
                    toolbar:
                        'undo redo | formatselect | bold italic | ' +
                        'alignleft aligncenter alignright | ' +
                        'bullist numlist outdent indent | removeformat | help',
                    setup: (editor) => {
                        editorRef.current = editor;
                        editor.setContent(content);
                        editor.on('Change', () => {
                            setContent(editor.getContent()); // Update content state on editor change
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
    }, [fileId, content]);

    useEffect(() => {
        console.log("lol update hua haiiii")
        if (editorRef.current) {
            editorRef.current.setContent(content);
        }
    }, [content]);

    return (
        <div>
            <textarea id="editor" defaultValue={content} />
        </div>
    );
};

export default TinyMCEEditor;
