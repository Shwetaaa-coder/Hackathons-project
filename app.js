import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase/app';
import 'firebase/database';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import MemeCreationStudio from './MemeCreationStudio.js';

// Firebase configuration - replace with your own config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();

function Home() {
  const [message, setMessage] = useState('Loading MemeHub...');
  const [memes, setMemes] = useState([]);
  const [newMeme, setNewMeme] = useState('');
  const [userVotes, setUserVotes] = useState({}); // memeId: { userId: voteValue }
  const [comments, setComments] = useState({}); // memeId: { commentId: {text} }
  const [commentInputs, setCommentInputs] = useState({}); // memeId: current input text
  const [flags, setFlags] = useState({}); // memeId: boolean

  useEffect(() => {
    setMessage('Welcome to MemeHub');

    // Listen for memes in the database
    const memesRef = database.ref('memes');
    memesRef.on('value', (snapshot) => {
      const data = snapshot.val();
      const memesList = data ? Object.entries(data).map(([key, value]) => ({ id: key, ...value })) : [];
      setMemes(memesList);
    });

    // Listen for votes
    const votesRef = database.ref('votes');
    votesRef.on('value', (snapshot) => {
      const data = snapshot.val() || {};
      setUserVotes(data);
    });

    // Listen for comments
    const commentsRef = database.ref('comments');
    commentsRef.on('value', (snapshot) => {
      const data = snapshot.val() || {};
      setComments(data);
    });

    // Listen for flags
    const flagsRef = database.ref('flags');
    flagsRef.on('value', (snapshot) => {
      const data = snapshot.val() || {};
      setFlags(data);
    });

    // Cleanup listeners on unmount
    return () => {
      memesRef.off();
      votesRef.off();
      commentsRef.off();
      flagsRef.off();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMeme.trim() === '') return;

    // Push new meme to database
    const memesRef = database.ref('memes');
    memesRef.push({ text: newMeme.trim(), tags: [] });

    setNewMeme('');
  };

  const handleVote = (memeId, voteValue) => {
    // One vote per user per meme: store vote in Firebase under votes/memeId/userId
    // For simplicity, use localStorage userId or generate one
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('userId', userId);
    }

    const voteRef = database.ref(`votes/${memeId}/${userId}`);
    voteRef.set(voteValue);
  };

  const getVoteCount = (memeId) => {
    const memeVotes = userVotes[memeId] || {};
    return Object.values(memeVotes).reduce((acc, val) => acc + val, 0);
  };

  const handleCommentChange = (memeId, text) => {
    setCommentInputs((prev) => ({ ...prev, [memeId]: text }));
  };

  const handleCommentSubmit = (memeId, e) => {
    e.preventDefault();
    const text = commentInputs[memeId];
    if (!text || text.trim() === '' || text.length > 140) return;

    const commentRef = database.ref(`comments/${memeId}`);
    const newCommentRef = commentRef.push();
    newCommentRef.set({ text: text.trim() });

    setCommentInputs((prev) => ({ ...prev, [memeId]: '' }));
  };

  const handleFlag = (memeId) => {
    const flagRef = database.ref(`flags/${memeId}`);
    flagRef.set(true);
  };

  return (
    <div>
      <h1>{message}</h1>
      <p>This is the initial setup of MemeHub with Firebase Realtime Database.</p>

      <nav>
        <Link to="/create">Go to Meme Creation Studio</Link>
      </nav>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a new meme"
          value={newMeme}
          onChange={(e) => setNewMeme(e.target.value)}
        />
        <button type="submit">Add Meme</button>
      </form>

      <ul>
        {memes.map((meme) => (
          <li key={meme.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
            <p>{meme.text}</p>
            <p>Tags: {(meme.tags || []).join(', ')}</p>
            <div>
              <button onClick={() => handleVote(meme.id, 1)} disabled={userVotes[meme.id]?.[localStorage.getItem('userId')] === 1}>Upvote</button>
              <button onClick={() => handleVote(meme.id, -1)} disabled={userVotes[meme.id]?.[localStorage.getItem('userId')] === -1}>Downvote</button>
              <span>Votes: {getVoteCount(meme.id)}</span>
            </div>
            <div>
              <button onClick={() => handleFlag(meme.id)} disabled={flags[meme.id]}>Flag/Report</button>
              {flags[meme.id] && <span style={{ color: 'red' }}>Flagged for review</span>}
            </div>
            <div>
              <form onSubmit={(e) => handleCommentSubmit(meme.id, e)}>
                <input
                  type="text"
                  maxLength={140}
                  placeholder="Add a comment (max 140 chars)"
                  value={commentInputs[meme.id] || ''}
                  onChange={(e) => handleCommentChange(meme.id, e.target.value)}
                />
                <button type="submit">Comment</button>
              </form>
              <ul>
                {(comments[meme.id] ? Object.entries(comments[meme.id]) : []).map(([commentId, comment]) => (
                  <li key={commentId}>{comment.text}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/create" component={MemeCreationStudio} />
      </Switch>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
