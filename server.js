import express from 'express';
const app = express();


app.use(express.static('public'));
app.get('/', (req, res) => {
    // es.sendFile(__dirname + '/public/index.html');
}); 
app.listen(3000, () => {
    console.log('Start server port:3000');
});