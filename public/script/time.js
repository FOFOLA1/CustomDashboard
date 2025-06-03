document.addEventListener('DOMContentLoaded', () => {
    const time = document.getElementById("time");
    const date = document.getElementById("date");
    setTime();
    setDate();
    setInterval(setTime, 5000);
});
function setTime() {
    const now = new Date();
    time.innerHTML = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    if (!date.innerHTML.startsWith(now.getDate)) setDate();
}

function setDate() {
    const now = new Date();
    date.innerHTML = `${now.getDate()} ${now.toLocaleString('en-US', { month: 'short' })}`;
}