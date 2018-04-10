import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import Header from "./Header";
import Footer from "./Footer";
import Home from "./Home";
import NotFound from "./NotFound";
import Login from "./Account/Login";
import Signup from "./Account/Signup";
import Profile from "./Account/Profile";
import Forgot from "./Account/Forgot";
import Reset from "./Account/Reset";

import { Provider, subscribe } from "react-contextual";

const store = {
  initialState: { jwtToken: null, user: {}, messages: {} },
  actions: {
    // () => ({ }): means returning an object
    saveSession: (jwtToken, user) => ({ jwtToken, user }),
    clearSession: () => ({ jwtToken: null, user: {} }),
    clearMessages: () => ({ messages: {} }),
    setErrorMessages: errors => ({ messages: { error: errors } }),
    setSuccessMessages: success => ({ messages: { success: success } })
  }
};

const isAuthenticated = props => props.jwtToken !== null;

// build a PrivateRoute component when user login
const PrivateRoute = subscribe()(({ component: Component, ...rest }) => (
  // It renders a <Route /> and passes all the props through to it.
  <Route
    {...rest}
    // line 35: It checks if the user is authenticated, if they are, it renders the “component” prop. If not, it redirects the user to /login.
    render={props =>
      isAuthenticated(props) ? (
        <Component {...props} />
      ) : (
        // <Redirect to/> : means a location to redirect to
        <Redirect
          to={{
            pathname: "/login",
            // state's value: is the current location of the route the user is trying to access
            // props.location : is the current location where the user is.
            state: { from: props.location }
          }}
        />
      )
    }
  />
));

class App extends React.Component {
  render() {
    return (
      <Provider {...store}>
        <CookiesProvider>
          {/* Required for the React Router */}
          <BrowserRouter>
            <div>
              <Header />
              {/* Switch: "just choose any component that MATCH the url an display the page(component)" */}
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/signup" component={Signup} />
                {/* If you put as <Route> , the problem is that by rendering a normal Route, anyone will be able to access it, which obviously isn’t what we want */}
                <PrivateRoute path="/account" component={Profile} />
                <Route path="/forgot" component={Forgot} />
                <Route path="/reset/:token" component={Reset} />
                <Route path="*" component={NotFound} />
              </Switch>
              <Footer />
            </div>
          </BrowserRouter>
        </CookiesProvider>
      </Provider>
    );
  }
}

export default App;
