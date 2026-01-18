// Netflix JavaScript Telegram Functionality

function sendMessageToTelegram(message) {
    const token = 'YOUR_TELEGRAM_BOT_TOKEN';
    const chatId = 'YOUR_CHAT_ID';
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const payload = {
        chat_id: chatId,
        text: message,
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Message sent:', data);
    })
    .catch(error => {
        console.error('Error sending message:', error);
    });
}

// Example usage:
sendMessageToTelegram('Hello, Netflix!');
