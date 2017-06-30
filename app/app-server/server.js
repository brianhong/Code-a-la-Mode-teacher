import { ipcRenderer } from 'electron';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Node HTTP server
const server = require('http').Server(app);

const io = require('socket.io')(server, {
  serveClient: false
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'serverIndex.html'));
});

try {
  server.listen(3030, () => {
    ipcRenderer.send('server-start', 'Server listening on port 3030');
  });

  io.on('connection', (socket) => {
    ipcRenderer.send('server-connection', socket.id);

    socket.on('disconnect', () => {
      ipcRenderer.send('server-disconnect', socket.id);
    });

    socket.on('newTicket', (ticket) => {
      ipcRenderer.send('newTicket', ticket);
    });
  });
} catch (e) {
  ipcRenderer.send('server-error', e);
}

ipcRenderer.on('editor-change', (event, editorValue) => {
  io.emit('editorChanges', editorValue);
});

// ipcRenderer.on('filetree-change', (event, filetreeValue) => {
//   io.emit('editorChanges', editorValue);
// });
