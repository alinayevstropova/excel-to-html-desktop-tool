import React from 'react';

const Settings = ({ settings, onChange }) => {
    return (
        <div className="settings-section">
            <h2>Настройки разметки</h2>
<div className="settings-section_fields">
            <label>
                Тег заголовка:
                <input
                    type="text"
                    value={settings.headerTag}
                    onChange={(e) => onChange('headerTag', e.target.value)}
                />
            </label>

            <label>
                Класс заголовка:
                <input
                    type="text"
                    value={settings.headerClass}
                    onChange={(e) => onChange('headerClass', e.target.value)}
                />
            </label>

            <label>
                Тег текста:
                <input
                    type="text"
                    value={settings.textTag}
                    onChange={(e) => onChange('textTag', e.target.value)}
                />
            </label>

            <label>
                Класс текста:
                <input
                    type="text"
                    value={settings.textClass}
                    onChange={(e) => onChange('textClass', e.target.value)}
                />
            </label></div>
        </div>
    );
};

export default Settings;