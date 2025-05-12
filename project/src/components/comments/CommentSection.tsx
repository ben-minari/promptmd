import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface Comment {
  id: string;
  text: string;
  created_at: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
}

interface CommentSectionProps {
  comments: Comment[];
  promptId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments: initialComments, promptId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          prompt_id: promptId,
          user_id: user.id,
          text: newComment.trim(),
          author: {
            id: user.id,
            name: user.user_metadata.full_name || 'Anonymous',
            avatar: user.user_metadata.avatar_url || '',
          }
        })
        .select()
        .single();

      if (error) throw error;

      setComments([...comments, data]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Comments</h2>
      
      {/* Comment form */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
          rows={3}
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition duration-150"
        >
          Post Comment
        </button>
      </form>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-start space-x-3">
              <img
                src={comment.author.avatar}
                alt={comment.author.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-800">{comment.author.name}</p>
                  <p className="text-sm text-slate-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                </div>
                <p className="mt-1 text-slate-600">{comment.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection; 