import { useRef } from "react";
import useFirestore from "../hooks/useFirestore";
import PropTypes from "prop-types";
import {
  addDoc,
  collection,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import useAuth from "../hooks/useAuth";

const Comments = ({ photoId }) => {
  const commentRef = useRef(null);
  const { user } = useAuth();
  const COMMENT_COLLECTION = `photos/${photoId}/comments`;

  const { docs: comments = [] } = useFirestore(COMMENT_COLLECTION, {
    orderBy: orderBy("createdAt", "desc"),
  });

  const addComment = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, COMMENT_COLLECTION), {
        createdAt: serverTimestamp(),
        authorEmail: user.email,
        comment: commentRef.current.value,
      });
      commentRef.current.value = null;
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const getLocalDate = (timestamp) => {
    if (!timestamp) return;
    const _timestamp = timestamp.toDate();
    const formattedDate = _timestamp.toLocaleString();
    return formattedDate;
  };

  return (
    <div className="comment-page-container">
      <div className="comments-wrapper">
        <h3 className="subtitle">Comments ({comments?.length || 0})</h3>

        {comments.map((c) => (
          <div className="comment-block" key={c.id}>
            <div className="comment-info">
              <div className="name">{c.authorEmail}</div>
              <div className="date">{getLocalDate(c.createdAt)}</div>
            </div>
            <div className="comment-text">{c.comment}</div>
          </div>
        ))}
      </div>
      <h3 className="subtitle text-center comment-heading">Leave a Comment</h3>
      <form onSubmit={addComment}>
        <div className="input-block" id="comment">
          <textarea
            ref={commentRef}
            required
            placeholder="Write a comment..."
          />
        </div>
        <div className="btn-block">
          <button type="submit" className="btn-primary">
            Leave a Comment
          </button>
        </div>
      </form>
    </div>
  );
};

Comments.propTypes = {
  photoId: PropTypes.string.isRequired,
};

export default Comments;
