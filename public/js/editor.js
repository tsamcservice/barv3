// 編輯器狀態
let currentCard = {
    type: 'bubble',
    size: 'mega',
    body: {
        type: 'box',
        layout: 'vertical',
        contents: []
    }
};

// 新增元件
function addComponent(type) {
    const component = createComponent(type);
    currentCard.body.contents.push(component);
    updatePreview();
}

// 建立元件
function createComponent(type) {
    switch (type) {
        case 'box':
            return {
                type: 'box',
                layout: 'vertical',
                contents: []
            };
        case 'text':
            return {
                type: 'text',
                text: '新文字',
                size: 'md'
            };
        case 'image':
            return {
                type: 'image',
                url: 'https://example.com/image.jpg',
                size: 'full'
            };
        case 'button':
            return {
                type: 'button',
                action: {
                    type: 'uri',
                    label: '按鈕',
                    uri: 'https://example.com'
                }
            };
        default:
            return null;
    }
}

// 更新預覽
function updatePreview() {
    const previewElement = document.getElementById('preview');
    previewElement.innerHTML = JSON.stringify(currentCard, null, 2);
}

// 儲存卡片
async function saveCard() {
    try {
        const response = await fetch('/api/cards/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: currentCard,
                type: 'flex'
            })
        });

        const result = await response.json();
        if (result.success) {
            alert('卡片儲存成功！');
        } else {
            alert('儲存失敗：' + result.message);
        }
    } catch (error) {
        console.error('儲存錯誤：', error);
        alert('儲存時發生錯誤');
    }
}

// 預覽卡片
function previewCard() {
    const previewUrl = `/preview/?data=${encodeURIComponent(JSON.stringify(currentCard))}`;
    window.open(previewUrl, '_blank');
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    updatePreview();
}); 