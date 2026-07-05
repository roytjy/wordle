import { doc, getDoc, setDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from './client.js';
import { isValidUsername, normalizeUsername } from '../game/username.js';

export function resultDocId(difficulty, dateString, usernameId) {
  return `${difficulty}_${dateString}_${usernameId}`;
}

export async function claimUsername(rawUsername) {
  if (!isValidUsername(rawUsername)) return { ok: false, reason: 'invalid' };
  const display = rawUsername.trim();
  const usernameId = normalizeUsername(rawUsername);
  try {
    await setDoc(doc(db, 'usernames', usernameId), {
      username: display,
      createdAt: serverTimestamp(),
    });
    return { ok: true, username: display };
  } catch (err) {
    if (err.code === 'permission-denied') return { ok: false, reason: 'taken' };
    return { ok: false, reason: 'error' };
  }
}

export async function hasPlayedToday(difficulty, dateString, usernameId) {
  const snap = await getDoc(doc(db, 'results', resultDocId(difficulty, dateString, usernameId)));
  return snap.exists();
}

export async function submitResult({ difficulty, dateString, username, status, timeMs }) {
  const usernameId = normalizeUsername(username);
  const id = resultDocId(difficulty, dateString, usernameId);
  try {
    await setDoc(doc(db, 'results', id), {
      difficulty,
      date: dateString,
      username,
      status,
      timeMs: status === 'won' ? timeMs : null,
      createdAt: serverTimestamp(),
    });
    return { ok: true };
  } catch (err) {
    if (err.code === 'permission-denied') return { ok: false, reason: 'already-played' };
    return { ok: false, reason: 'error' };
  }
}

export async function fetchLeaderboard(difficulty, dateString) {
  const leaderboardQuery = query(
    collection(db, 'results'),
    where('difficulty', '==', difficulty),
    where('date', '==', dateString)
  );
  const snap = await getDocs(leaderboardQuery);
  const entries = snap.docs.map((d) => d.data());
  return entries.sort((a, b) => {
    if (a.status === 'won' && b.status === 'won') return a.timeMs - b.timeMs;
    if (a.status === 'won') return -1;
    if (b.status === 'won') return 1;
    return a.username.localeCompare(b.username);
  });
}
