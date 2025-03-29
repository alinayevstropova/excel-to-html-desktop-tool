import React, { useState, useRef } from 'react';

const Preview = ({ formattedContent }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const previewRef = useRef(null);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const copyToClipboard = async () => {
        if (previewRef.current) {
            try {
                await navigator.clipboard.writeText(previewRef.current.innerText);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000); // Reset message after 2 seconds
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        }
    };

    return (
        <div className="preview-section">
            <h2>Предпросмотр</h2>
            <button onClick={toggleCollapse}>
                {isCollapsed ? 'Развернуть' : 'Свернуть'}
            </button>
            <button onClick={copyToClipboard} disabled={isCopied}>
                {isCopied ? 'Скопировано!' : 'Копировать HTML'}
            </button>
            {!isCollapsed && (
                <pre ref={previewRef}>
                    <code>
                        {formattedContent}
                    </code>
                </pre>
            )}
        </div>
    );
};

export default Preview;