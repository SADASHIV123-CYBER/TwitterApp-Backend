import * as tweetRepository from '../repository/tweetRepository.js';
import { withErrorHandling } from '../utils/errors/errorHandler.js';
import { Follow } from '../schema/userSchema.js';

export const createTweet = withErrorHandling(async ({ body, author, image }) => {
  return await tweetRepository.createTweet({ body, author, image });
});

const markIsFollowed = async (doc, viewerId) => {
  if (!viewerId) return doc;
  if (!doc) return doc;
  const author = doc.author || (doc.originalTweet && doc.originalTweet.author) || null;
  if (!author) return doc;
  const authorId = author._id ?? author;
  const exists = await Follow.exists({ follower: viewerId, following: authorId });
  if (doc.author && typeof doc.author === 'object') doc.author = { ...doc.author.toObject ? doc.author.toObject() : doc.author, isFollowed: !!exists };
  if (doc.originalTweet && doc.originalTweet.author && typeof doc.originalTweet.author === 'object') {
    doc.originalTweet.author = { ...doc.originalTweet.author.toObject ? doc.originalTweet.author.toObject() : doc.originalTweet.author, isFollowed: !!exists };
  }
  return doc;
};

export const getTweets = withErrorHandling(async (viewerId) => {
  const tweets = await tweetRepository.getTweets();
  if (!viewerId) return tweets;
  const out = [];
  for (const t of tweets) {
    const tpop = t.toObject ? t.toObject() : t;
    const exists = await Follow.exists({ follower: viewerId, following: tpop.author?._id ?? tpop.author });
    tpop.author = { ...tpop.author, isFollowed: !!exists };
    out.push(tpop);
  }
  return out;
});

export const getTweetById = withErrorHandling(async (id, viewerId) => {
  const tweet = await tweetRepository.getTweetById(id);
  if (!viewerId) return tweet;
  const tpop = tweet.toObject ? tweet.toObject() : tweet;
  const exists = await Follow.exists({ follower: viewerId, following: tpop.author?._id ?? tpop.author });
  tpop.author = { ...tpop.author, isFollowed: !!exists };
  return tpop;
});

export const deleteTweet = withErrorHandling(async (id) => {
  return await tweetRepository.deleteTweet(id);
});

export const updateTweet = withErrorHandling(async (id, body) => {
  return await tweetRepository.updateTweet(id, body);
});

export const likeTweet = withErrorHandling(async (tweetId, userId) => {
  return await tweetRepository.likeTweet(tweetId, userId);
});

export const unlikeTweet = withErrorHandling(async (tweetId, userId) => {
  return await tweetRepository.unlikeTweet(tweetId, userId);
});

// export const addComment = withErrorHandling(async (tweetId, userId, text) => {
//   return await tweetRepository.addComment(tweetId, userId, text);
// });

// In tweetService file

export const addComment = withErrorHandling(async (tweetId, userId, text) => {
  // Optionally log incoming values
  console.log("Service: addComment", { tweetId, userId, text });
  return await tweetRepository.addComment(tweetId, userId, text);
});


export const updateComment = withErrorHandling(async (tweetId, commentId, body) => {
  return await tweetRepository.updateComment(tweetId, commentId, body);
});

export const replyToComment = withErrorHandling(async (tweetId, commentId, userId, text) => {
  return await tweetRepository.replyToComment(tweetId, commentId, userId, text);
});

export const toggleCommentLike = withErrorHandling(async (tweetId, commentId, userId) => {
  const { updatedTweet, liked } = await tweetRepository.toggleCommentLike(tweetId, commentId, userId);
  return { updatedTweet, liked };
});

export const softDeleteComment = withErrorHandling(async (tweetId, commentId, userId) => {
  return await tweetRepository.softDeleteComment(tweetId, commentId, userId);
});

export const retweet = withErrorHandling(async (tweetId, userId) => {
  const existing = await tweetRepository.findRetweet(tweetId, userId);
  if (existing) {
    await tweetRepository.undoRetweet(tweetId, userId);
    return { action: "undone", retweetId: existing._id };
  } else {
    const created = await tweetRepository.createRetweet(tweetId, userId);
    return { action: "done", retweet: created };
  }
});

export const quote = withErrorHandling(async (tweetId, userId, text) => {
  if (!text || text.trim() === "") throw new Error("Quote text cannot be empty");
  return await tweetRepository.createQuoteTweet(tweetId, userId, text);
});

export const deleteQuote = withErrorHandling(async (quoteId, userId) => {
  return await tweetRepository.deleteQuoteTweet(quoteId, userId);
});

export const getUserTweets = withErrorHandling(async (userId, viewerId) => {
  const tweets = await tweetRepository.getUserTweets(userId);
  if (!viewerId) return tweets;
  const out = [];
  for (const t of tweets) {
    const tpop = t.toObject ? t.toObject() : t;
    const exists = await Follow.exists({ follower: viewerId, following: tpop.author?._id ?? tpop.author });
    tpop.author = { ...tpop.author, isFollowed: !!exists };
    out.push(tpop);
  }
  return out;
});

export const getUserRetweets = withErrorHandling(async (userId, viewerId) => {
  const retweets = await tweetRepository.getUserRetweets(userId);
  if (!viewerId) return retweets;
  const out = [];
  for (const r of retweets) {
    const rpop = r.toObject ? r.toObject() : r;
    if (rpop.originalTweet && rpop.originalTweet.author) {
      const exists = await Follow.exists({ follower: viewerId, following: rpop.originalTweet.author._id ?? rpop.originalTweet.author });
      rpop.originalTweet.author = { ...rpop.originalTweet.author, isFollowed: !!exists };
    }
    out.push(rpop);
  }
  return out;
});

export const getUserQuotes = withErrorHandling(async (userId, viewerId) => {
  const quotes = await tweetRepository.getUserQuotes(userId);
  if (!viewerId) return quotes;
  const out = [];
  for (const q of quotes) {
    const qpop = q.toObject ? q.toObject() : q;
    if (qpop.originalTweet && qpop.originalTweet.author) {
      const exists = await Follow.exists({ follower: viewerId, following: qpop.originalTweet.author._id ?? qpop.originalTweet.author });
      qpop.originalTweet.author = { ...qpop.originalTweet.author, isFollowed: !!exists };
    }
    out.push(qpop);
  }
  return out;
});
