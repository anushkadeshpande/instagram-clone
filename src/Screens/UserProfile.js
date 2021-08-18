import React, { useState, useEffect } from "react";
import "./UserProfile.css";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { postDb } from "../firebase";
import UserProfileHeader from "../Components/UserProfileHeader";
import { selectSearched } from "../features/searchSlice";

import UserPosts from "../Components/UserPosts";
function UserProfile() {
  const user = useSelector(selectUser);
  if (!user) window.location = "https://instagram-4.netlify.app/";
  const search = useSelector(selectSearched);
  const [profileMode, setMode] = useState("");
  const [followedAcc, setFollowedAcc] = useState([]);

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = () => {
      setPosts([]);
      user?.posts?.map((post) => {
        postDb
          .doc(post)
          .get()
          .then((doc) =>
            setPosts((prevState) => [
              { id: doc.id, data: doc.data() },
              ...prevState,
            ])
          );
      });
    };

    // if it is my account
    if (
      window.location.pathname === "/me" ||
      search?.data.username === user.userName
    ) {
      setMode("MyAccount");
      fetchPosts();
    }

    // if it is others account
    else {
      setFollowedAcc([]);

      // check if it is followed
      const followedAccount = user.following.filter(
        (following) => following === search?.id
      );

      //if it is followed, grab data form search
      const grabPosts = () => {
        search.data.posts?.map((postId) => {
          postDb
            .doc(postId)
            .get()
            .then((doc) =>
              setFollowedAcc((prevState) => [
                { id: doc.id, data: doc.data() },
                ...prevState,
              ])
            );
        });
      };
      if (followedAccount.length === 0) {
        //user is not followed
        setMode("NotFollowed");
      } else {
        //user is followed
        grabPosts();
        setMode("Followed");
      }
    }
  }, [search]);

  return (
    <div className="userProfile">
      {
        // if visiting my account
        profileMode === "MyAccount" ? (
          <>
            <UserProfileHeader
              uid={user.id}
              user={user}
              username={user.userName}
              postsCount={posts?.length}
              followers={user.followers ? user.followers.length : 0}
              following={user.following ? user.following.length : 0}
              mode="myProfile"
            />
            <UserPosts posts={posts} />
          </>
        ) : (
          //others account
          <>
            <UserProfileHeader
              uid={search?.id}
              user={search?.data}
              username={search?.data.username}
              postsCount={search?.data.posts.length}
              followers={
                search?.data.followers ? search?.data.followers.length : 0
              }
              following={
                search?.data.following ? search?.data.following.length : 0
              }
              mode={profileMode}
            />
            {
              // if the other account is not followed
              profileMode === "NotFollowed" ? (
                <h1 className="follow-warning">
                  Follow {search?.data.username} to view their posts.
                </h1>
              ) : (
                // if the other account is followed
                <UserPosts posts={followedAcc} />
              )
            }
          </>
        )
      }
    </div>
  );
}

export default UserProfile;
