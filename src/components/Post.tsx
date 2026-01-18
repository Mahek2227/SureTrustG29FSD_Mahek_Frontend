import React, { useState, useRef, useEffect } from "react";

interface Comment {
  id: string;
  text: string;
}

interface PostCardProps {
  id: string;
  profilePhoto: string;
  userName: string;
  caption: string;
  likes: number;
  comments_count: number;
  postImage?: string;
  isProfilePage?: boolean;
  comments?: Comment[];
  onDelete?: (id: string) => void;
  onLike?: (id: string) => void;
  onComment?: (id: string, text: string) => void;
 
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  profilePhoto,
  userName,
  caption,
  likes,
  comments_count,
  postImage,
  isProfilePage = false,
  comments,
  onDelete,
  onLike,
  onComment,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [commentText, setCommentText] = useState(""); // ✅ Fix: added state
  const menuRef = useRef<HTMLDivElement>(null);

  /* -------------------- Close menu on outside click -------------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  /* ---------------------------- Delete post ---------------------------- */
  const handleDelete = () => {
    if (!onDelete) return;
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setShowMenu(false);
    onDelete(id);
  };

  /* ---------------------------- Add Comment ---------------------------- */
  const handleAddComment = () => {
    if (!onComment) return;
    if (!commentText.trim()) return;
    onComment(id, commentText);
    setCommentText("");
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-4 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={profilePhoto}
            alt="profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <span className="font-semibold text-lg">{userName}</span>
        </div>

        {/* Profile-only menu */}
        {isProfilePage && (
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="flex flex-col gap-1"
            >
              <span className="w-5 h-[3px] bg-gray-700 rounded"></span>
              <span className="w-5 h-[3px] bg-gray-700 rounded"></span>
              <span className="w-5 h-[3px] bg-gray-700 rounded"></span>
            </button>

            {showMenu && (
              <div className="absolute right-0 top-6 bg-white border rounded shadow-md w-32 z-20">
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Caption */}
      <p className="mt-3 text-gray-700">{caption}</p>

      {/* Image */}
      {postImage && (
        <div className="mt-3">
          <img
            src={postImage}
            alt="post"
            className="w-full h-72 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Stats */}
      <div className="flex justify-between mt-3 text-gray-600 text-sm">
        <span>{likes} Likes</span>
        <span>{comments_count} Comments</span>
      </div>

      {/* Actions */}
      {/* Actions */}
<div className="flex justify-around mt-4">
  <button
    onClick={() => onLike && onLike(id)}
    className="text-xl hover:scale-110 transition"
  >
    👍
  </button>
  <button
    onClick={handleAddComment} // Fix: call this to add comment
    className="text-xl hover:scale-110 transition"
  >
    💬
  </button>
  <button className="text-xl hover:scale-110 transition">↗️</button>
</div>

      

      {/* Comments */}
      <div className="items-center mt-4">
        <h3 className="text-lg font-semibold">Comments</h3>
        <div className="mt-2 max-h-40 overflow-y-auto">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="border-b py-2">
                <p className="text-sm">{comment.text}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No comments yet.</p>
          )}
        </div>
      </div>

      {/* Add Comment */}
      <div className="flex items-center border rounded-full px-2 py-2 mt-4 focus-within:ring-2 focus-within:ring-blue-600">
        <input
  type="text"
  placeholder="Add a comment..."
  className="flex grow px-4 py-2 focus:outline-none bg-transparent"
  value={commentText}
  onChange={(e) => setCommentText(e.target.value)}
/>
<button
  className="bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700 transition"
  onClick={handleAddComment} // this calls onComment prop
>
  Comment
</button>
      </div>
    </div>
  );
};

export default PostCard;
