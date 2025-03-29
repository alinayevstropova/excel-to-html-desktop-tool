import React, { useState } from 'react';

const formTemplates = {
    form1: '<form class="form-style-1"><input type="text" placeholder="Имя"><button>Submit</button></form>',
    form2: '<form class="form-style-2"><input type="email" placeholder="Email"><button>Send</button></form>',
    form3: '<form class="form-style-3"><textarea placeholder="Сообщение"></textarea><button>Post</button></form>',
};

const FormSelector = ({ selectedForm, onChange }) => {
    const [showPreview, setShowPreview] = useState(false);

    const togglePreview = () => {
        setShowPreview(!showPreview);
    };

    return (
        <div>
            <h2>Выбор формы</h2>
            <select value={selectedForm} onChange={e => onChange('selectedForm', e.target.value)}>
                <option value="form1">Форма 1</option>
                <option value="form2">Форма 2</option>
                <option value="form3">Форма 3</option>
            </select>
            <button onClick={togglePreview}>
              {showPreview ? "Скрыть предпросмотр" : "Предпросмотр"}
            </button>
            {showPreview && (
                <div dangerouslySetInnerHTML={{ __html: formTemplates[selectedForm] }} />
            )}
        </div>
    );
};

export default FormSelector;