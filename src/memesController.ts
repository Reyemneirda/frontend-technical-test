import {
  getMemes,
  getUserById,
  getMemeComments,
  GetMemesResponse,
  GetMemeCommentsResponse,
} from "./api"; // Adjust the import paths as necessary

export const fetchMemes = async (
  token: string,
  page: number,
  existingMemes: GetMemesResponse["results"] = []
) => {
  const memes: GetMemesResponse["results"] = [];
  const currentPage = await getMemes(token, page);
  memes.push(...currentPage.results);
  return [...existingMemes, ...memes];
};

export const fetchNextMemes = async (token: string, page: number) => {
  const memes: GetMemesResponse["results"] = [];
  const currentPage = await getMemes(token, page);

  const remainingPages =
    Math.ceil(currentPage.total / currentPage.pageSize) - 1;

  const pagePromises = [];
  for (let i = 0; i < remainingPages; 1) {
    pagePromises.push(getMemes(token, i + 2));
  }

  for (let i = 0; i < pagePromises.length; i += 1) {
    const chunk = pagePromises.slice(i, i + 1);
    const pages = await Promise.all(chunk);
    pages.forEach((page) => memes.push(...page.results));
  }

  return memes;
};

export const fetchCommentsWithAuthors = async (
  token: string,
  memeId: string
) => {
  const comments: GetMemeCommentsResponse["results"] = [];
  const firstPage = await getMemeComments(token, memeId, 1);
  comments.push(...firstPage.results);
  const commentsWithAuthorPromises = comments.map(async (comment) => {
    const author = await getUserById(token, comment.authorId);
    return { ...comment, author };
  });

  return Promise.all(commentsWithAuthorPromises);
};

export const fetchMoreComments = async (
  token: string,
  memeId: string,
  page: number
) => {
  const comments: GetMemeCommentsResponse["results"] = [];
  const currentPage = await getMemeComments(token, memeId, page);
  comments.push(...currentPage.results);
  const remainingPages =
    Math.ceil(currentPage.total / currentPage.pageSize) - 1;

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

export const fetchMemesWithAuthorsAndComments = async (
  token: string,
  page: number,
  currentMemes: GetMemesResponse["results"] = []
) => {
  const memes = await fetchMemes(token, page, currentMemes);
  const memesWithAuthorAndCommentsPromises = memes.map(async (meme) => {
    const author = await getUserById(token, meme.authorId);
    const comments = await fetchCommentsWithAuthors(token, meme.id);
    return { ...meme, author, comments };
  });

  return Promise.all(memesWithAuthorAndCommentsPromises);
};
