import React, { useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css'; // Импортируйте стили Prism.js

function Output({ outputText, onInsertText }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const highlightedHtml = Prism.highlight(outputText, Prism.languages.html, 'html');

    return (
        <div>
            <h2>Вывод результата</h2>
            <button onClick={toggleCollapse}>
                {isCollapsed ? 'Развернуть' : 'Свернуть'}
            </button>
            {!isCollapsed && (
                <div style={{ position: "relative" }}>
                    <pre>
                        <code className="language-html" dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
                    </pre>

                    <button
                        onClick={onInsertText}
                        style={{ position: 'absolute', bottom: '10px', right: '10px' }}
                    >
                        Вставить текст в Div
                    </button>
                </div>
            )}
        </div>
    );
}

export default Output;