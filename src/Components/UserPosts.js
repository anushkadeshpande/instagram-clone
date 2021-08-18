import React, { useState } from "react";
import PostModal from "./PostModal";
import "./UserPosts.css";
function UserPosts({ posts }) {
  const [modalPost, setModalPost] = useState({});
  const [modalIsOpen, setIsOpen] = useState(false);
  const openPostModal = (post, id) => {
    setModalPost({ id: id, post: post });
    setIsOpen(true);
  };
  return (
    <div className="userPosts">
      {posts?.map((post) => (
        <div
          key={post?.id}
          className="grid-pic"
          style={{ backgroundImage: `url(${post?.data?.pic})` }}
          onClick={() => openPostModal(post.data, post.id)}
        ></div>
      ))}
      {modalIsOpen ? (
        <PostModal
          modalIsOpen={modalIsOpen}
          setIsOpen={setIsOpen}
          modalPost={modalPost}
          setModalPost={setModalPost}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default UserPosts;
