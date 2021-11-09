import React, { useEffect, useMemo, useRef } from "react";
import { Card, Layout, Spin, Typography } from "antd";
// Image Assets
import googleLogo from "./assets/google_logo.jpg";
import { useViewerDispatch } from "../../context/viewer";
import { ViewerActionTypes } from "../../context/viewer/types";
import { Viewer } from "../../lib/types";
import { useApolloClient, useMutation } from "@apollo/react-hooks";
import { AUTH_URL } from "../../lib/graphql/queries/AuthUrl";
import { AuthUrl as AuthUrlData } from "../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl";
import {
  LogIn as LogInData,
  LogInVariables,
} from "../../lib/graphql/mutations/LogIn/__generated__/LogIn";
import { LOG_IN } from "../../lib/graphql/mutations/LogIn";
import {
  displaySuccessNotification,
  displayErrorMessage,
} from "../../lib/utils";
import { ErrorBanner } from "../../lib/components";
import { useHistory } from "react-router-dom";

const { Content } = Layout;
const { Text, Title } = Typography;

export const Login = () => {
  const { dispatch = null } = useViewerDispatch();
  const client = useApolloClient();
  const history = useHistory();
  const [logIn, { loading: logInLoading, error: logInError }] = useMutation<
    LogInData,
    LogInVariables
  >(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn) {
        const viewer = data.logIn;
        setViewer(viewer);
        displaySuccessNotification("You've successfully logged in!");
        history.push(`/user/${viewer.id}`);
      }
    },
  });
  const logInRef = useRef(logIn);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      logInRef.current({
        variables: {
          input: { code },
        },
      });
    }
  }, []);

  const setViewer = (viewer: Viewer) =>
    dispatch &&
    dispatch({ type: ViewerActionTypes.SetViewer, payload: viewer });

  const handleAuthorize = async () => {
    try {
      const { data } = await client.query<AuthUrlData>({
        query: AUTH_URL,
      });
      window.location.href = data.authUrl;
    } catch {
      displayErrorMessage(
        "Sorry! We weren't able to log you in. Please try again later!"
      );
    }
  };

  const logInErrorBannerElement = useMemo(
    () =>
      logInError ? (
        <ErrorBanner description="We weren't able to log you in. Please try again soon." />
      ) : null,
    [logInError]
  );

  if (logInLoading) {
    return (
      <Content className="log-in">
        <Spin size="large" tip="Logging you in..." />
      </Content>
    );
  }

  return (
    <Content className="log-in">
      {logInErrorBannerElement}
      <Card className="log-in-card">
        <div className="log-in-card__intro">
          <Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="wave">
              👋
            </span>
          </Title>
          <Title level={3} className="log-in-card__intro-title">
            Log in to TinyHouse!
          </Title>
          <Text>Sign in with Google to start booking available rentals!</Text>
        </div>
        <button
          className="log-in-card__google-button"
          onClick={handleAuthorize}
        >
          <img
            src={googleLogo}
            alt="Google Logo"
            className="log-in-card__google-button-logo"
          />
          <span className="log-in-card__google-button-text">
            Sign in with Google
          </span>
        </button>
        <Text type="secondary">
          Note: By signing in, you'll be redirected to the Google consent form
          to sign in with your Google account.
        </Text>
      </Card>
    </Content>
  );
};
