import {
  getMemes,
  getUserById,
  getMemeComments,
  GetMemesResponse,
  GetMemeCommentsResponse,
} from "./api"; // Adjust the import paths as necessary

export const fetchMemes = async (token: string) => {
  const memes: GetMemesResponse["results"] = [];
  const firstPage = await getMemes(token, 1);
  memes.push(...firstPage.results);
  const remainingPages = Math.ceil(firstPage.total / firstPage.pageSize) - 1;

  const pagePromises = [];
  for (let i = 0; i < remainingPages; i++) {
    pagePromises.push(getMemes(token, i + 2));
  }
  const pages = await Promise.all(pagePromises);
  pages.forEach((page) => memes.push(...page.results));

  return memes;
};

export const fetchCommentsWithAuthors = async (
  token: string,
  memeId: string
) => {
  const comments: GetMemeCommentsResponse["results"] = [];
  const firstPage = await getMemeComments(token, memeId, 1);
  comments.push(...firstPage.results);
  const remainingPages = Math.ceil(firstPage.total / firstPage.pageSize) - 1;

  const pagePromises = [];
  for (let i = 0; i < remainingPages; i++) {
    pagePromises.push(getMemeComments(token, memeId, i + 2));
  }
  const pages = await Promise.all(pagePromises);
  pages.forEach((page) => comments.push(...page.results));

  const commentsWithAuthorPromises = comments.map(async (comment) => {
    const author = await getUserById(token, comment.authorId);
    return { ...comment, author };
  });

  return Promise.all(commentsWithAuthorPromises);
};

export const fetchMemesWithAuthorsAndComments = async (token: string) => {
  const memes = await fetchMemes(token);

  const memesWithAuthorAndCommentsPromises = memes.map(async (meme) => {
    const author = await getUserById(token, meme.authorId);
    const comments = await fetchCommentsWithAuthors(token, meme.id);
    return { ...meme, author, comments };
  });

  return Promise.all(memesWithAuthorAndCommentsPromises);
};
