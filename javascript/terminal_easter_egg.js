document.addEventListener('DOMContentLoaded', () => {
    const secret = 'simon';
    let buffer = '';

    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        if (event.key.length !== 1) return;

        const target = event.target;
        const isTypingField = target && (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable
        );
        if (isTypingField) return;

        buffer = `${buffer}${event.key.toLowerCase()}`.slice(-secret.length);
        if (buffer === secret) {
            window.location.href = './terminal/';
        }
    });
});
