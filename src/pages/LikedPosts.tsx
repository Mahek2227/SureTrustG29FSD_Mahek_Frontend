import React, { useEffect, useState } from "react";
import axios from "axios";

type LikedPost = {
  id: string;
  author: string;
  avatar: string;
  content: string;
  image?: string;
  likedAt: string;
};

const timeAgo = (dateString: string): string => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "Less than 1 hour ago";
  if (hours < 24) return `${hours} hour(s) ago`;
  return `${Math.floor(hours / 24)} day(s) ago`;
};

const LikedPosts: React.FC = () => {
  const [likedPosts, setLikedPosts] = useState<LikedPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<LikedPost | null>(null);

  useEffect(() => {
    fetchLikedPosts();
  }, []);

  const fetchLikedPosts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/post/likedposts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🔥 map backend → dummy format
      const formatted: LikedPost[] = res.data.posts.map((post: any) => ({
        id: post._id,
        author: post.user?.name || "Unknown",
        avatar:
          post.user?.profilePic ||
          "https://ui-avatars.com/api/?name=User",
        content: post.text,
        image: post.image,
        likedAt: post.updatedAt || post.createdAt,
      }));

      setLikedPosts(formatted);
      setSelectedPost(formatted[0] || null);
    } catch (err) {
      console.error("Liked posts error:", err);
    }
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex">
      {/* LEFT PANEL */}
      <div className="w-2/5 bg-white border-r p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Liked Posts</h2>

        {likedPosts.map((post) => (
          <button
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 text-left border transition ${
              selectedPost?.id === post.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <img
              src={post.avatar}
              className="w-10 h-10 rounded-full object-cover border"
            />
            <div className="flex-1">
              <div className="font-semibold text-sm">{post.author}</div>
              <div className="text-xs text-gray-500">
                Liked: {timeAgo(post.likedAt)}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* RIGHT PANEL */}
      <div className="w-3/5 p-6 flex justify-center items-start">
        {selectedPost ? (
          <div className="bg-white rounded-xl shadow max-w-xl w-full p-4">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={selectedPost.avatar}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="font-semibold">
                  @{selectedPost.author}
                </div>
                <div className="text-xs text-gray-500">
                  Liked: {timeAgo(selectedPost.likedAt)}
                </div>
              </div>
            </div>

            <p className="mb-3">{selectedPost.content}</p>

            {selectedPost.image && (
              <img
                src={selectedPost.image}
                className="w-full rounded-lg"
              />
            )}
          </div>
        ) : (
          <p className="text-gray-500">No liked posts</p>
        )}
      </div>
    </div>
  );
};

export default LikedPosts;
