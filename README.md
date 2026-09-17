# ArgosWOP
Argos TCG

## Internet Rooms

The active game is `TCG/war_of_the_philippines_tcg_v10(muchupdated).html`.
Internet duels use the Socket.IO room server in `server.js`.

```bash
npm install
npm start
```

Open `http://localhost:9000/TCG/war_of_the_philippines_tcg_v10%28muchupdated%29.html`.
Player 1 creates a room, then shares the generated room URL or code. For two players on the public internet, expose port `9000` through your host, reverse proxy, or tunnel and share that public URL. The server keeps only the live room membership; game state is relayed by Socket.IO between the two clients.
