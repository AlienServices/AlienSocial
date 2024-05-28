import { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { IonIcon } from '@ionic/react';
import { useApi } from '../hooks/useApi';
import { colorFill, heart, heartCircle, chatbubbleOutline, ellipsisHorizontalOutline, cartOutline, bookmarkOutline, shareOutline, ellipsisHorizontal } from 'ionicons/icons';
// import Editor from '../components/Editor';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill/core';
import { supabase } from './supaBase';
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
} from '@ionic/react';
import '../pages/Tab3.css';
import { post } from '../utils/fetch';
import Page from '../pages/View/[id]'
import { MyContext } from '../providers/postProvider';



const Content: React.FC = () => {
    const { posts, myPosts, setPosts, setMyPosts, updatePost, deletePost } = useContext(MyContext)
    const [userEmail, setUserEmail] = useState<any>(localStorage.getItem('user'))
    const [value, setValue] = useState('<p>here is my values this is for a test</p><p><br></p><p>																																									this should go in the middle</p><p>idk about thiks one </p><p><br></p><p><br></p><p>lets see what happens</p><p><br></p><h1>this is a big header</h1>');


    return (
        <IonContent className='page' >
            <IonList>
                {myPosts ? <>   {myPosts?.sort((a, b) => Date.parse(b?.date) - Date.parse(a?.date)).map((post: any, index: number) => {
                    var parser = new DOMParser()
                    var doc = parser.parseFromString(post.content, 'text/html');
                    var output = Array.prototype.slice.call(
                        doc.querySelectorAll('h1')
                    ).map(el => el.outerHTML);
                    const date = new Date(post.date)
                    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
                    const day = String(date.getUTCDate()).padStart(2, '0');
                    const year = date.getUTCFullYear();

                    // Format the date as mm/dd/yyyy
                    const formattedDate = `${month}/${year}`;
                    return (
                        <div className='shadow'>
                            <IonCard style={{ boxShadow: 'none', borderRadius: "0px", borderBottom: "1px solid #eaeaea", paddingTop: '10px', paddingBottom: '10px' }} key={index} className='card'>
                                <div className='around'>
                                    <div className='emailContainer'>
                                        <IonAvatar style={{ height: '20px', width: '20px', marginLeft: '10px', marginRight: '5px' }}>
                                            <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                                        </IonAvatar>
                                        <div className='username'>{post.email}</div>
                                    </div>
                                    <IonFab horizontal='end'>
                                        <IonFabButton size='small'>
                                            <IonIcon icon={ellipsisHorizontal}></IonIcon>
                                        </IonFabButton>
                                        <IonFabList>
                                            <IonFabButton onClick={() => { deletePost(post.id) }}>Trash</IonFabButton>
                                        </IonFabList>
                                    </IonFab>
                                </div>
                                <IonNavLink routerDirection="forward" component={() => <Page id={post.id} />}>
                                    <ReactQuill style={{ color: "black" }} readOnly={true} theme="bubble" value={output[0]} />
                                </IonNavLink>
                                <div className='around'>
                                    <div className='flex'>
                                        <div className='center' onClick={() => {
                                            if (post.likes.indexOf(userEmail) === -1) {
                                                let fullLikes = [...post.likes, userEmail];
                                                updatePost({ id: post.id, likes: fullLikes, content: post.content, email: post.email })
                                            } else {
                                                let emailIndex = post.likes.indexOf(localStorage.getItem('user') || '')
                                                let newLikes = post.likes.toSpliced(emailIndex, 1)
                                                console.log(newLikes, 'thse are new likes')
                                                updatePost({ id: post.id, likes: newLikes, content: post.content, email: post.email })
                                            }
                                        }}>
                                            <IonIcon color='danger' size='small' icon={heartCircle} ></IonIcon>
                                            <div>{post.likes.length}</div>
                                        </div>
                                        <div className='center'>
                                            <IonIcon color='' size='small' icon={chatbubbleOutline} ></IonIcon>
                                            <div>{post.comments.length}</div>
                                        </div>
                                        <div className='center'>
                                            <IonIcon color='' size='small' icon={bookmarkOutline} ></IonIcon>
                                        </div>
                                    </div>
                                    <div className='flexSmall'>
                                        <div>{formattedDate}</div>
                                        <IonIcon color='' size='small' icon={shareOutline} ></IonIcon>
                                        
                                    </div>
                                </div>
                                <div>
                                </div>
                            </IonCard>
                        </div>
                    )
                })} </> : <><div>You aint got no post</div></>}
            </IonList>
        </IonContent>
    );
}

export default Content