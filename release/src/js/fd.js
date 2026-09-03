
document.querySelectorAll('.toolbar button').forEach(btn => {
    btn.addEventListener('click', () => {
        const cmd = btn.dataset.command;
        if (cmd === 'createLink') {
            const url = prompt('Enter URL:');
            if (url) document.execCommand(cmd, false, url);
        } else if (cmd === 'formatBlock') {
            document.execCommand(cmd, false, btn.dataset.value);
        } else {
            document.execCommand(cmd, false, null);
        }
        updatePreview();
    });
});

const editor = document.getElementById('editor');
const preview = document.getElementById('preview');

editor.addEventListener('paste', e => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
});

function htmlToMarkdown(html) {
    let md = html;

    md = md.replace(/<h1>(.*?)<\/h1>/gi, '# $1\n');
    md = md.replace(/<h2>(.*?)<\/h2>/gi, '## $1\n');
    md = md.replace(/<h3>(.*?)<\/h3>/gi, '### $1\n');

    md = md.replace(/<(b|strong)>(.*?)<\/\1>/gi, '**$2**');
    md = md.replace(/<(i|em)>(.*?)<\/\1>/gi, '*$2*');
    md = md.replace(/<(s|strike)>(.*?)<\/\1>/gi, '~~$2~~');

    md = md.replace(/<a href="(.*?)">(.*?)<\/a>/gi, '[$2]($1)');

    md = md.replace(/<ul>(.*?)<\/ul>/gis, (match, p1) => {
        const items = p1.match(/<li>(.*?)<\/li>/gi);
        if (!items) return '';
        return items.map(li => {
            const text = li.replace(/<\/?li>/gi, '').trim();
            return '- ' + text;
        }).join('\n') + '\n';
    });


    md = md.replace(/<\/?[^>]+(>|$)/g, '');
    return md;
}

function updatePreview() {
    const html = editor.innerHTML;
    preview.textContent = htmlToMarkdown(html);
}

editor.addEventListener('input', updatePreview);
updatePreview();

const toggleBtn = document.getElementById('toggle-preview');
toggleBtn.addEventListener('click', () => {
    preview.style.display = preview.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('submit-btn').addEventListener('click', () => {
    const title = encodeURIComponent(document.getElementById('issue-title').value);
    const bodyMd = encodeURIComponent(htmlToMarkdown(editor.innerHTML));
    const label = encodeURIComponent(document.getElementById('label-select').value);

    const ua = navigator.userAgent;
    let os = "Unknown OS", arch = "", browser = "Unknown Browser", version = "", engine = "Unknown", legacyTokens = [];

    if (/Windows NT 10/.test(ua)) os = "Win 10";
    else if (/Windows NT 6.3/.test(ua)) os = "Win 8.1";
    else if (/Windows NT 6.2/.test(ua)) os = "Win 8";
    else if (/Windows NT 6.1/.test(ua)) os = "Win 7";
    else if (/Mac OS X/.test(ua)) os = ua.match(/Mac OS X [\d_]+/)[0].replace(/_/g, '.');
    else if (/Linux/.test(ua)) os = "Linux";

    if (/WOW64|Win64|x64/.test(ua)) arch = "64x";
    else if (/i686|i386/.test(ua)) arch = "32x";

    if (/Chrome\/([\d.]+)/.test(ua)) { browser = "Chrome"; version = ua.match(/Chrome\/([\d.]+)/)[1]; }
    else if (/Firefox\/([\d.]+)/.test(ua)) { browser = "Firefox"; version = ua.match(/Firefox\/([\d.]+)/)[1]; }
    else if (/Safari\/([\d.]+)/.test(ua) && !/Chrome/.test(ua)) { browser = "Safari"; version = ua.match(/Version\/([\d.]+)/)?.[1] || ""; }

    if (/AppleWebKit/.test(ua)) engine = "Blink/WebKit";
    else if (/Gecko/.test(ua)) engine = "Gecko";
    else if (/Trident/.test(ua)) engine = "Trident";

    legacyTokens = ua.split(' ').filter(tok => /Mozilla|AppleWebKit|KHTML|Gecko|Safari/.test(tok));

    const envInfo = `## Environment:
- OS: ${os}, ${arch}
- Browser: ${browser}, V${version}
- Rendering Engine: ${engine}
- Legacy Tokens: ${legacyTokens.join(', ')}`;

    const url = `https://github.com/Pro-Bandey/HomePage/issues/new?title=${title}&body=${bodyMd}%0A%0A${encodeURIComponent(envInfo)}&labels=${label}`;
    window.open(url, '_blank');
});
