import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Send } from 'lucide-react';

interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  text: string;
  createdAt: string;
}

interface CommentSectionProps {
  comments: Comment[];
  promptId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, promptId }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    // In a real application, this would call an API to save the comment
    console.log(`Submitting comment for prompt ${promptId}: ${newComment}`);
    
    // Reset the input field
    setNewComment('');
  };

  // Show only 3 most recent comments by default
  const displayedComments = showAllComments ? comments : comments.slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-slate-800">
            Comments ({comments.length})
          </h2>
        </div>

        {/* Comment form */}
        {user ? (
          <form onSubmit={handleSubmitComment} className="mb-6">
            <div className="flex items-start space-x-3">
              <img 
                src={user.photoURL || "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"} 
                alt={user.displayName || "User"} 
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <textarea
                  placeholder="Add a comment..."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-white ${
                      newComment.trim() ? 'bg-teal-600 hover:bg-teal-700' : 'bg-slate-300 cursor-not-allowed'
                    } transition duration-150`}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Post
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-slate-50 rounded-lg p-4 mb-6 text-center">
            <p className="text-slate-600 mb-2">Sign in to leave a comment</p>
            <a 
              href="/auth" 
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 transition duration-150"
            >
              Sign In
            </a>
          </div>
        )}

        {/* Comments list */}
        {comments.length > 0 ? (
          <div className="space-y-4">
            {displayedComments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <img
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center mb-1">
                      <span className="font-medium text-slate-800">{comment.author.name}</span>
                      <span className="text-xs text-slate-500 ml-2">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm">{comment.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500">No comments yet</p>
            <p className="text-sm text-slate-400">Be the first to share your thoughts</p>
          </div>
        )}

        {/* Show more/less comments button */}
        {comments.length > 3 && (
          <button
            onClick={() => setShowAllComments(!showAllComments)}
            className="w-full mt-4 px-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            {showAllComments ? 'Show less comments' : `Show all ${comments.length} comments`}
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentSection;