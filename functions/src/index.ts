const admin = require('firebase-admin');
admin.initializeApp();
const functions = require('firebase-functions');
const cors = require('cors')({origin: '*'});
const db = admin.database().ref('/myWebAssignment');

const getGamesFromDatabase = (res) => {
    let games = [];
    return db.on(
        'value',
        snapshot => {
            snapshot.forEach(g => {
                games.push({
                    id: g.key, 
                    game: g.val().game,
                    });  
            });
            res.send(games)
            res.status(200).json(games);
        },
        error => {
            res.status(error.code).json({
                message: `Error: ${error.message}`
            });
        }
    );

};

//Export Get Method
exports.getGames = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'GET') {
            return res.status(404).json({
                message: 'Not allowed'
            })
        }
        getGamesFromDatabase(res);
    });
});

//Export POST Method
exports.addGame = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'POST') {
            return res.status(401).json({
                message: 'Not allowed'
            });
        }
        var game = req.body;
        db.push({ game});
        getGamesFromDatabase(res);
    });
});

//Export PUT Method
exports.updateGame = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'PUT') {
            return res.status(401).json({
                message: 'Not allowed'
            });
        }
        const id = req.query.id;
        db.child(id+"/game").update(req.body);
        getGamesFromDatabase(res);
    });
});

//Export Delete Method
exports.deleteGame = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
      if(req.method !== 'DELETE') {
        return res.status(401).json({
          message: 'Not allowed'
        })
      }
      const id = req.query.id;
      db.child(id).remove();
      getGamesFromDatabase(res);
    });
  });
