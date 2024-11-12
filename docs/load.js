fetch('w.json')
    .then(response => response.json())
    .then(data => {
        // dataはnumpy配列に対応するJavaScript配列
        console.log(data);
    })
    .catch(error => console.error('Error loading JSON:', error));
