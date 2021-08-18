import { useEffect } from 'react';
import './App.css';
import { db, auth, userDb } from './firebase';
import { useDispatch, useSelector } from "react-redux";
import { logout, login, selectUser } from './features/userSlice';
import LandingPage from './Components/LandingPage';
import SignUp from './Screens/SignUp';
import Home from './Screens/Home'
import Login from './Screens/Login'
import UserProfile from './Screens/UserProfile';
import Notification from './Screens/Notification'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

 
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        userDb.where("userId", "==", `${userAuth.uid}`).onSnapshot(snapshot => 
       //   .then((doc) => {
          // console.log(snapshot.docs.data())
           dispatch(login({
              uid: userAuth.uid,
              email: userAuth.email,
              userName: snapshot.docs[0]?.data().username,
              name: snapshot.docs[0]?.data().name,
              id:snapshot.docs[0]?.id,
              likedPosts: snapshot.docs[0]?.data().likedPosts? snapshot.docs[0]?.data().likedPosts : [],
              posts: snapshot.docs[0]?.data().posts? snapshot.docs[0]?.data().posts : [],
              followRequests: snapshot.docs[0]?.data().followRequests? snapshot.docs[0]?.data().followRequests : [],
              sentRequests: snapshot.docs[0]?.data().sentRequests? snapshot.docs[0]?.data().sentRequests : [],
              followers: snapshot.docs[0]?.data().followers? snapshot.docs[0]?.data().followers : [],
              following: snapshot.docs[0]?.data().following? snapshot.docs[0]?.data().following : []   
            }))
        )}
          
        //logged in

          
      else {
        //logged out
        dispatch(logout());
      }
    });
    return unsubscribe;
  }, [dispatch])



  return (
    <div className="App">
      <Router>
        <Route exact path='/' component={SignUp} />
        <Route path='/login' component={Login} />
        <Route path='/home' component={Home} />
        <Route path='/user' component={UserProfile} />
        <Route path='/me' component={UserProfile} />
        <Route path='/notifications' component={Notification} />
        {!user ?
          <Redirect to='/' exact />
          :
          (
            <>
              <LandingPage />
              <Redirect to='/home' />
            </>
          )
        }
      </Router>
    </div>
  );
}

export default App;
