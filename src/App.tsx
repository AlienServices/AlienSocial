import { Redirect, Route } from "react-router-dom";
import { add, chevronUp, search } from "ionicons/icons";
import { IonNav } from "@ionic/react";
import {
  IonApp,
  IonButton,
  IonItem,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonMenuToggle,
  IonFabList,
  IonFabButton,
  IonFab,
  IonPage,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  ellipse,
  square,
  triangle,
  beer,
  diamondOutline,
  giftOutline,
  flameOutline,
} from "ionicons/icons";
// import Tab1 from './pages/Tab1';
import Tab2 from "../src/pages/tabs/Profile";
import Tab3 from "../src/pages/tabs/Homepage";
import Login from "./pages/Login";
import Create from "../src/pages/tabs/Create";
import Post from "./pages/View/[id]";
import MessageHome from "../src/pages/tabs/MessageHome";
import Menu from "./components/Menu";
import Chat from "../src/pages/messagePages/Chat";
import Quiz from "./subPages/Quiz";
import CurrentChat from "../src/pages/messagePages/CurrentChat";
import Comment from "./pages/Comment/[id]";
import Search from "../src/pages/tabs/Search";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => (
  <IonNav
    root={() => (
      <IonPage>
        <IonContent>
          <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet>
                <Route
                  exact={true}
                  path="/tab1"
                  render={() => <Tab3 />}
                ></Route>
                <Route exact={true} path="/" render={() => <Login />}></Route>
                <Route
                  exact={true}
                  path="/Comment/:id/:myVote/:postId" 
                  render={() => <Comment />}
                ></Route>
                <Route
                  exact={true}
                  path="/quiz"
                  render={() => <Quiz />}
                ></Route>
                <Route
                  exact={true}
                  path="/tab2"
                  render={() => <Tab2 />}
                ></Route>
                <Route
                  exact={true}
                  path="/tab3"
                  render={() => <MessageHome />}
                ></Route>
                <Route
                  exact={true}
                  path="/newChat"
                  render={() => <Chat />}
                ></Route>
                <Route
                  exact={true}
                  path="/chat/:id"
                  render={() => <CurrentChat />}
                ></Route>
                <Route exact={true} path="/create" component={Create}></Route>
                <Route
                  path={`/view/:id`}
                  render={() => {
                    return <Post />;
                  }}
                ></Route>
                <Route path={`/search`} component={Search}></Route>
              </IonRouterOutlet>
              <IonTabBar slot="bottom">
                <IonTabButton tab="tab1" href="/tab1">
                  <IonIcon aria-hidden="true" icon={beer} />
                  <IonLabel>Home</IonLabel>
                </IonTabButton>
                <IonTabButton tab="search" href="/search">
                  <IonIcon aria-hidden="true" icon={search} />
                  <IonLabel>Search</IonLabel>
                </IonTabButton>
                <IonTabButton tab="create" href="/create">
                  <IonIcon aria-hidden="true" icon={flameOutline} />
                  <IonLabel>Create</IonLabel>
                </IonTabButton>                
                <IonTabButton tab="tab3" href="/tab3">
                  <IonIcon aria-hidden="true" icon={giftOutline} />
                  <IonLabel>Messages</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab2" href="/tab2">
                  <IonIcon aria-hidden="true" icon={diamondOutline} />
                  <IonLabel>My Profile</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </IonReactRouter>
        </IonContent>
      </IonPage>
    )}
  />
);

export default App;
