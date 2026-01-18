import { baseUrl } from "../baseUrl.ts";

export const getDeletedPosts = async (page = 1, limit = 10) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const response = await fetch(`${baseUrl}/post/deletedposts?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch deleted posts");
  }

  return await response.json();
};

export const restorePost = async (postId:string) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const response = await fetch(`${baseUrl}/post/restore/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to restore post");
  }

  return await response.json();
};

export const getMyPosts = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${baseUrl}/post/myposts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch my posts");
  return res.json();
};

export const getLikedPosts = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${baseUrl}/post/likedposts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch liked posts");
  return res.json();
};

export const likePost = async (postId: string) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${baseUrl}/post/like/${postId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Like failed");
  return res.json();
};

export const commentPost = async (postId: string, text: string) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${baseUrl}/post/comment/${postId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Comment failed");
  return res.json();
};
export const deletePost = async (postId: string) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const response = await fetch(`${baseUrl}/post/delete/${postId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete post");
  }

  return await response.json();
};