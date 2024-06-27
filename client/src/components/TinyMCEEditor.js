import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const TinyMCEEditor = ({ fileId }) => {
    const [content, setContent] = useState('');
    const editorRef = useRef(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/${fileId}`);
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
                            editor.on('init', () => {
                                editor.setContent(content);
                            });
                            editor.on('Change', () => {
                                const newContent = editor.getContent();
                                setContent(newContent);
                            });
                        },
                    });
                };

                document.body.appendChild(script);
            } else {
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
                        editor.on('init', () => {
                            editor.setContent(content);
                        });
                        editor.on('Change', () => {
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
    }, [fileId, content]);

    return (
        <div>
            <textarea id="editor" />
        </div>
    );
};

export default TinyMCEEditor;
