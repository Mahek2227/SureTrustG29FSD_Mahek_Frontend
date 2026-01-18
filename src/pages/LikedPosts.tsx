import { useEffect, useState } from "react";
import { getLikedPosts, likePost, commentPost } from "../api/postApi";

interface Comment {
  user: string;
  text: string;
  createdAt: string;
  _id: string;
}

interface Post {
  _id: string;
  user: {
    _id: string;
    name: string;
    profilePic: string;
  };
  text: string;
  image?: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

const timeAgo = (dateString: string): string => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));

  if (hours < 1) return "Less than 1 hour ago";
  if (hours < 24) return `${hours} hour(s) ago`;
  return `${Math.floor(hours / 24)} day(s) ago`;
};

const LikedPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Fetch liked posts
  useEffect(() => {
    getLikedPosts()
      .then((res) => {
        const data = res.posts || [];
        setPosts(data);
        setSelectedPost(data[0] ?? null);
      })
      .catch(console.error);
  }, []);

  // Handle Like (unchanged)
  // Handle Like
const handleLike = async (postId: string) => {
  try {
    const res = await likePost(postId); // API call
    const updatedPost = res.data.post;  // <-- Use this
    setPosts(prev =>
      prev.map(p => (p._id === postId ? updatedPost : p))
    );
  } catch (err) {
    console.error(err);
  }
};

// Handle Comment
const handleComment = async (postId: string, text: string) => {
  if (!text.trim()) return;
  try {
    const res = await addComment(postId, text); // API call
    const updatedPost = res.data.post;  // <-- Use this
    setPosts(prev =>
      prev.map(p => (p._id === postId ? updatedPost : p))
    );
  } catch (err) {
    console.error(err);
  }
};


  return (
    <div className="w-full h-screen bg-gray-100 flex">
      {/* LEFT PANEL */}
      <div className="w-2/5 bg-white border-r p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Liked Posts</h2>

        {posts.length === 0 && (
          <p className="text-gray-500 text-sm">
            You haven't liked any posts yet.
          </p>
        )}

        {posts.map((post) => (
          <button
            key={post._id}
            onClick={() => setSelectedPost(post)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 text-left border transition ${
              selectedPost?._id === post._id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <img
              src={post.user.profilePic}
              alt={post.user.name}
              className="w-10 h-10 rounded-full object-cover border"
            />
            <div className="flex-1">
              <div className="font-semibold text-sm">
                {post.user.name}
              </div>
              <div className="text-xs text-gray-500">
                Liked: {timeAgo(post.createdAt)}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* RIGHT PANEL */}
      <div className="w-3/5 p-6 flex justify-center items-start overflow-y-auto">
        {selectedPost ? (
          <div className="bg-white rounded-xl shadow max-w-xl w-full p-4">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={selectedPost.user.profilePic}
                alt={selectedPost.user.name}
                className="w-10 h-10 rounded-full object-cover border"
              />
              <div>
                <div className="font-semibold">
                  @{selectedPost.user.name}
                </div>
                <div className="text-xs text-gray-500">
                  Liked: {timeAgo(selectedPost.createdAt)}
                </div>
              </div>
            </div>

            <p className="mb-3 text-gray-800">{selectedPost.text}</p>

            {selectedPost.image && (
              <img
                src={selectedPost.image}
                alt="post"
                className="w-full rounded-lg object-cover"
              />
            )}

            {/* Like + Comment counts (display only) */}
            <div className="flex gap-4 mt-4 text-sm text-gray-600">
              <span>❤️ {selectedPost.likes.length} likes</span>
              <span>💬 {selectedPost.comments.length} comments</span>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-sm">
            No liked post selected.
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedPosts;
