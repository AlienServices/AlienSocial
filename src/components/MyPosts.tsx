import { useEffect, useState, useRef, useCallback, useContext } from "react";
import { IonIcon } from "@ionic/react";
import { useApi } from "../hooks/useApi";
import { useLocation, useHistory } from "react-router";
import {
  colorFill,
  heart,
  heartCircle,
  chatbubbleOutline,
  ellipsisHorizontalOutline,
  cartOutline,
  bookmarkOutline,
  shareOutline,
  ellipsisHorizontal,
} from "ionicons/icons";
// import Editor from '../components/Editor';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Quill from "quill/core";
import { supabase } from "./supaBase";
import {
  IonButton,
  IonAvatar,
  IonFab,
  IonFabList,
  IonFabButton,
  IonRouterLink,
  IonContent,
  IonNavLink,
  IonCard,
  IonHeader,
  IonInput,
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
import { post } from "../utils/fetch";
import Page from "../pages/View/[id]";
import { MyContext } from "../providers/postProvider";

const Content: React.FC = () => {
  const {
    posts,
    myPosts,
    setPosts,
    myInfo,
    setMyPosts,
    updatePost,
    deletePost,
    userPosts,
    getUserPosts,
  } = useContext(MyContext);
  const [userEmail, setUserEmail] = useState<any>(localStorage.getItem("user"));
  const history = useHistory();
  const [value, setValue] = useState(
    "<p>here is my values this is for a test</p><p><br></p><p>																																									this should go in the middle</p><p>idk about thiks one </p><p><br></p><p><br></p><p>lets see what happens</p><p><br></p><h1>this is a big header</h1>",
  );

  const transformTitleToH1 = (title: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(title, "text/html");
    const pTag = doc.querySelector("p");

    if (pTag) {
      const h1Tag = document.createElement("h1");
      h1Tag.innerHTML = pTag.innerHTML;
      pTag.parentNode?.replaceChild(h1Tag, pTag);
    }

    return doc.body.innerHTML;
  };

  const truncateContent = (content: string, length: number) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    let textContent = doc.body.textContent || "";
    if (textContent.length > length) {
      textContent = textContent.substring(0, length) + "...";
    }
    return textContent;
  };

  const gotoTopic = (email: string) => {
    history.push(`/view/${email}`);
  };


  return (

    <IonList>
      {myPosts ? (
        <>
          {" "}
          {myPosts
            .sort((a, b) => Date.parse(b?.date) - Date.parse(a?.date))
            .map((post: any, index: number) => {
              const transformedTitle = transformTitleToH1(post.title);
              const truncatedContent = truncateContent(post.content, 200);
              const date = new Date(post.date);
              const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
              const day = String(date.getUTCDate()).padStart(2, "0");
              const year = date.getUTCFullYear();

              // Format the date as mm/dd/yyyy
              const formattedDate = `${month}/${day}/${year}`;

              return (
                <div className="shadow" key={post.id}>
                  <IonCard
                    style={{
                      boxShadow: "none",
                      borderRadius: "0px",
                      paddingTop: "10px",
                      paddingBottom: "10px",
                    }}
                    className="card"
                  >
                    <div className="around">
                      <div className="emailContainer">
                        <IonAvatar
                          style={{
                            height: "20px",
                            width: "20px",
                            marginLeft: "10px",
                            marginRight: "5px",
                          }}
                        >
                          <img
                            alt="Silhouette of a person's head"
                            src="https://ionicframework.com/docs/img/demos/avatar.svg"
                          />
                        </IonAvatar>
                        <div className="username">{post.email}</div>

                      </div>
                      <div>
                        {myInfo?.email !== post?.email ? (
                          <>
                            {" "}
                            {myInfo?.following?.indexOf(post.email) !== -1 ? (
                              <div>
                                {" "}
                                <IonButton
                                  onClick={() => {
                                    deletePost(post.id)
                                  }}
                                  size="small"
                                >
                                  {"Trash"}
                                </IonButton>
                              </div>
                            ) : (
                              <div>
                                {" "}
                                <IonButton
                                  onClick={() => {
                                    updateUser(
                                      user?.username,
                                      user?.bio,
                                      [...user.following, post.email],
                                      myInfo.email
                                    );
                                  }}
                                  size="small"
                                >
                                  Follow
                                </IonButton>
                              </div>
                            )}
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    <div onClick={() => { gotoTopic(post.email) }}>
                      <ReactQuill
                        style={{ color: "black" }}
                        readOnly={true}
                        theme="bubble"
                        value={transformedTitle}
                      />
                      <ReactQuill
                        className="small"
                        readOnly={true}
                        theme="bubble"
                        value={truncatedContent}
                      />
                    </div>

                    {/* <div className="around">
                      <div className="flex">
                        <div className="center">
                          <IonIcon
                            color=""
                            size="small"
                            icon={chatbubbleOutline}
                          ></IonIcon>
                          <div>{post.comments.length}</div>
                        </div>
                        <div className="center">
                          <IonIcon
                            color=""
                            size="small"
                            icon={bookmarkOutline}
                          ></IonIcon>
                        </div>
                      </div>
                      <div className="flex">
                        <div>{formattedDate}</div>
                        <IonIcon
                          color=""
                          size="small"
                          icon={shareOutline}
                        ></IonIcon>
                      </div>
                    </div> */}
                  </IonCard>
                </div>
              );
            })}{" "}
        </>
      ) : (
        <>
          <div>You aint got no post</div>
        </>
      )}
    </IonList>

  );
};

export default Content;
