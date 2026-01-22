import React, { useState, useEffect, useRef} from "react";
import { FaTrash } from "react-icons/fa";

interface Comment {
  
   _id?: string;   // from backend
  id?: string; 
   text: string; 
}

interface PostProps {
  id: string;
  profilePhoto: string;
  userName: string;
  caption: string;
  likes: number;
  comments?: Comment[];
  postImage?: string;
  onLike?: (id: string) => void;
  onComment?: (id: string, text: string) => void;
  isOwnPost?: boolean;
  alreadyLiked?: boolean;
  isProfilePage?: boolean;
  comments_count?: number;
  onDelete?: (postId: string) => void | Promise<void>; // ✅ add this
}



const Post: React.FC<PostProps> = ({
  id,
  profilePhoto,
  userName,
  caption,
  likes,
  comments = [],
  postImage,
  onLike,
  onComment,
  onDelete,
  isOwnPost = false,
  alreadyLiked = false,
}) => {
  const [localLikes, setLocalLikes] = useState<number>(likes);
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  const [commentText, setCommentText] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {setLocalLikes(likes);}, [likes]);

  useEffect(() => {setLocalComments(comments);}, [comments]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  
 

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment = { id: Date.now().toString(), text: commentText };
    setLocalComments([...localComments, newComment]);
    setCommentText("");

    if (onComment) onComment(id, commentText);
  };

  const handleLikeClick = () => {
  if (isOwnPost) return;
  setLocalLikes((prev) => prev + 1);
  if (onLike) onLike(id);
  };
  const handleDelete = () => {
  if (!onDelete) return;

  const confirmDelete = window.confirm("Are you sure you want to delete this post?");
  if (!confirmDelete) return;

  onDelete(id);
};


  return (
    <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-4">
      {/* Header */}
      
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
           <img
            src={profilePhoto}
             alt={userName}
             className="w-12 h-12 rounded-full object-cover"
           />
          <span className="font-semibold">{userName}</span>
        </div>

         
        {/* 3-LINES MENU (sir style) */}
        {isOwnPost && (
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="flex flex-col gap-[3px] p-1"
            >
              <span className="w-5 h-[2px] bg-gray-700 rounded"></span>
              <span className="w-5 h-[2px] bg-gray-700 rounded"></span>
              <span className="w-5 h-[2px] bg-gray-700 rounded"></span>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-20">
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  <FaTrash size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>


      {/* Caption */}
      <p className="mt-2 text-gray-700">{caption}</p>

      {/* Image */}
      {postImage && <img src={postImage} alt="post" className="w-full mt-2 rounded-lg" />}

      {/* Actions + Stats (Single Row) */}
      <div className="flex justify-between mt-3 items-center text-gray-600 text-sm">
        <div className="flex gap-4 items-center">
          <button
            onClick={handleLikeClick}
            className={`text-xl hover:scale-110 transition ${isOwnPost || alreadyLiked ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            👍
          </button>
          <button
            onClick={() => setShowCommentInput(!showCommentInput)}
            className="text-xl hover:scale-110 transition"
          >
            💬
          </button>
        </div>
        <div className="flex gap-4">
          <span>❤️ {localLikes} Likes</span>
          <span>💬 {localComments.length} Comments</span>
        </div>
      </div>

      {/* Comment Input + List */}
      {showCommentInput && (
        <div className="mt-3">
          <div className="flex items-center border rounded-full px-2 py-2 mb-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-4 py-2 focus:outline-none bg-transparent"
            />
            <button
              onClick={handleAddComment}
              className="bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700 transition"
            >
              Comment
            </button>
          </div>

          <div className="max-h-40 overflow-y-auto">
            {localComments.length > 0 ? (
              localComments.map((comment,) => (
                <div key={comment.id || comment.id} className="border-b py-2">
                  <p className="text-sm">{comment.text}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No comments yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;