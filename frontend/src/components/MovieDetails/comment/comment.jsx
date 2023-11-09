import React from 'react';
import { AiTwotoneLike, AiTwotoneDislike } from 'react-icons/ai';

const Comment = ({
  comment,
  commentLikes,
  handleToggleLike,
  handleDeleteComment,
}) => {
  return (
    <div className="border rounded-md p-3 ml-3 my-3 relative" key={comment.id}>
      <div className="flex gap-3 items-center">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrmaYAWRAbOZOfFEX8mnY1G9lBIVLZq4DKog&usqp=CAU"
          className="object-cover w-8 h-8 rounded-full border-2 border-emerald-400 shadow-emerald-400"
          alt="User Avatar"
        />
        <h3 className="font-bold">{comment.author_username}</h3>
      </div>
      <p className="text-gray-600 mt-2">{comment.text}</p>

      <div className="comment-actions absolute top-0 right-0 mt-2 mr-2">
        <div className="like-dislike-buttons inline-flex">

        <div className="likes-count ml-2">
          <p>{comment.likes}</p>
        </div>

          <button
            onClick={() => handleToggleLike(comment.id)}
            className={commentLikes[comment.id] ? "unlike-button" : "like-button"}
          >
            {commentLikes[comment.id] ? (
              <span>
                <AiTwotoneDislike />
              </span>
            ) : (
              <span>
                <AiTwotoneLike />
              </span>
            )}
          </button>
        </div>
      </div>

      <button
        onClick={() => handleDeleteComment(comment.id)}
        className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-2 mb-2"
      >
        Delete
      </button>
    </div>
  );
};

export default Comment;
