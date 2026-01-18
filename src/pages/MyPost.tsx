import { useEffect, useState } from "react";
import PostCard from "../components/Post";
import { getMyPosts, likePost, commentPost } from "../api/postApi";

const MyPost = () => {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    getMyPosts()
      .then((res) => setPosts(res.posts || []))
      .catch(console.error);
  }, []);

  const handleLike = async (id: string) => {
    const res = await likePost(id);
    setPosts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, likes: res.likes } : p))
    );
  };

  const handleComment = async (id: string, text: string) => {
    const res = await commentPost(id, text);
    setPosts((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, comments: res.post.comments } : p
      )
    );
  };

  return (
    <div className="flex flex-col items-center gap-6 mt-6">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          id={post._id}
          profilePhoto={post.user.profilePic}
          userName={post.user.username}
          caption={post.text}
          postImage={post.image}
          likes={post.likes.length}
          comments_count={post.comments.length}
          comments={post.comments}
          isProfilePage
          onLike={handleLike}
          onComment={handleComment}
        />
      ))}
    </div>
  );
};

export default MyPost;
