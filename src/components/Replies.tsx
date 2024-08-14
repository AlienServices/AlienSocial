import { useEffect, useState, useRef, useCallback, useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { useApi } from "../hooks/useApi";
import {
  colorFill,
  heart,
  heartCircle,
  chatbubbleOutline,
  bookmarkOutline,
  shareOutline,
  checkmarkOutline,
} from "ionicons/icons";
// import Editor from '../components/Editor';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Quill from "quill/core";
import Post from "../pages/View/[id]";
import { supabase } from "./supaBase";
import {
  IonButton,
  IonNav,
  IonChip,
  IonAvatar,
  IonContent,
  IonCard,
  IonNavLink,
  IonRouterLink,
  IonHeader,
  IonRoute,
  IonInput,
  IonRouterOutlet,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
  useIonLoading,
} from "@ionic/react";
import "../pages/Tab3.css";
import Page from "../pages/View/[id]";
import Profile from "../pages/Profile/[id]";
import { post } from "../utils/fetch";
import { MyContext } from "../providers/postProvider";

const Replies = ({ id }: { id: string }) => {

  const { myInfo } = useContext(MyContext);
  const [comments, setComments] = useState()
  const [comment, setComment] = useState()

  useEffect(() => {
    getOneConvo()

  }, [])


  const getOneConvo = async () => {
    try {
      const result = await fetch(
        `http://localhost:3000/api/getComments?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const post = await result.json();
      setComments(post.comment)
      console.log(post)
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };


  const AddComment = async (comment: string, userName: string, postId: string, userId: string) => {
    console.log(userName, 'this is the comment')
    try {
      const result = await fetch(
        `http://localhost:3000/api/addComment?id=${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: comment,
            userName,
            postId,
            userId
          })
        },
      );
      const post = await result.json();
      console.log(post.comments)
      setComments(post.comments)
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  console.log(comment, 'comment')
  return (
    <>
      <div className="rowWide">
        <input className="input" onChange={(e) => {
          setComment(e?.target.value)
        }} placeholder="Add Comment"></input>
        <IonButton onClick={() => { AddComment(comment, myInfo.username, id, myInfo.id) }}>Send</IonButton>
      </div>
      <IonList>
        {comments?.map((comment: string) => {
          return (
            <IonItem lines="none">
              <IonCard className="cardComment">
                <div>
                  <div>
                    <div className="userName">{comment.username}</div>
                    {/* <div>{comment.date}</div> */}
                  </div>
                  <div className="comment">{comment.comment}</div>
                </div>
              </IonCard>
            </IonItem>
          )
        })}
      </IonList>
    </>
  );
};

export default Replies;
