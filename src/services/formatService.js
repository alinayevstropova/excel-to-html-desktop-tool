export function formatData(data, settings, linkSettings, selectedForm) {
    let formattedContent = '';

    data.forEach(item => {
        if (item.tag === settings.headerTag) {
            formattedContent += `<${item.tag} class="${item.class}">${item.content}</${item.tag}>\n`;
        } else if (item.tag === settings.textTag) {
            let text = item.content;
            // Добавление ссылок
            if (linkSettings.words && linkSettings.words.length > 0) {
                linkSettings.words.forEach(wordObj => {
                    //Улучшенное регулярное выражение
                    const regex = new RegExp(`\\b${wordObj.word}\\b`, 'gi');
                    text = text.replace(regex, `<a href="${wordObj.link}" class="${linkSettings.linkClass}">${wordObj.word}</a>`);
                });
            }
            formattedContent += `<${item.tag} class="${item.class}">${text}</${item.tag}>\n`;
        } else if (item.tag === 'img') {
            formattedContent += `<a href="#"><img src="${item.src}" alt="${item.alt}"/></a>\n`;
        } else if (item.tag === 'form') {
            // Генерация HTML для формы
            let formHTML = '';
            if (selectedForm === 'form1') {
                formHTML = `
                    <form id="form1">
                        <label for="name">Имя:</label><br>
                        <input type="text" id="name" name="name"><br>
                        <label for="email">Email:</label><br>
                        <input type="email" id="email" name="email"><br>
                        <input type="submit" value="Отправить">
                    </form>\n
                `;
            } else if (selectedForm === 'form2') {
                formHTML = `
                    <form id="form2">
                        <label for="message">Сообщение:</label><br>
                        <textarea id="message" name="message"></textarea><br>
                        <input type="submit" value="Отправить">
                    </form>\n
                `;
            }
            formattedContent += formHTML;
        }
    });

    return formattedContent;
}