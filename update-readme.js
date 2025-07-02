const fs = require('fs');
const Parser = require('rss-parser');
const parser = new Parser();

const RSS_URL = 'https://www.baakhan.com/rss.xml';
const NUM_POSTS = 5;
const START_MARKER = '## Latest Blog Posts';

(async () => {
    const feed = await parser.parseURL(RSS_URL);

    // 최신 5개 리스트 작성
    const lines = [];
    lines.push(`${START_MARKER}\n`);
    feed.items.slice(0, NUM_POSTS).forEach(item => {
        lines.push(`- [${item.title}](${item.link})`);
    });
    lines.push(''); // 빈 줄

    // README 파일 읽기
    const readme = fs.readFileSync('README.md', { encoding: 'utf-8' }).split('\n');
    let startIdx = readme.findIndex(line => line.trim().startsWith(START_MARKER));

    if (startIdx !== -1) {
        let endIdx = startIdx + 1;
        while (
            endIdx < readme.length &&
            !(readme[endIdx].startsWith('## ') && endIdx !== startIdx + 1)
        ) {
            endIdx += 1;
        }
        const before = readme.slice(0, startIdx);
        const after = readme.slice(endIdx);
        const newReadme = [...before, ...lines, ...after];
        fs.writeFileSync('README.md', newReadme.join('\n'), { encoding: 'utf-8' });
    } else {
        fs.appendFileSync('README.md', '\n' + lines.join('\n'), { encoding: 'utf-8' });
    }
})();
