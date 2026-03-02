fetch('http://localhost:3000/api/test')
    .then(r => r.json())
    .then(d => {
        require('fs').writeFileSync('result.json', JSON.stringify(d, null, 2));
        console.log('Saved to result.json');
    })
    .catch(console.error);
