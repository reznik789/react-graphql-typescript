import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Avatar, Button, Icon, Menu } from "antd";
import { useViewerDispatch, useViewerState } from "../../../../context/viewer";
import { State, ViewerActionTypes } from "../../../../context/viewer/types";
import { useMutation } from "@apollo/react-hooks";
import { LOG_OUT } from "../../../../lib/graphql/mutations/LogOut";
import { LogOut as LogOutData } from "../../../../lib/graphql/mutations/LogOut/__generated__/LogOut";
import { displayErrorMessage, displaySuccessNotification } from "../../../../lib/utils";

const { Item, SubMenu } = Menu;

export const MenuItems: React.FC = () => {
  const { viewer }: State = useViewerState();
  const { dispatch } = useViewerDispatch();
  const [logOut] = useMutation<LogOutData>(LOG_OUT, {
    onCompleted: (data) => {
      if (!(data?.logOut)) return;
      dispatch({
        type: ViewerActionTypes.SetViewer,
        payload: data.logOut,
      });
      displaySuccessNotification("You've successfully logged out!");
    },
    onError: () => {
      displayErrorMessage(
        "Sorry! We weren't able to log you out. Please try again later!"
      );
    }
  });
  const handleLogOut = () => {
    logOut();
  };

  const subMenuLogin = useMemo(() => {
    return viewer.id && viewer.avatar ? (
      <SubMenu title={<Avatar src={viewer.avatar} />}>
        <Item key="/user">
          <Icon type="user" />
          Profile
        </Item>
        <Item key="/logout">
          <div onClick={handleLogOut}>
            <Icon type="logout" />
            Log out
          </div>
        </Item>
      </SubMenu>
    ) : (
      <Item>
        <Link to="/login">
          <Button type="primary">Sign In</Button>
        </Link>
      </Item>
    );
  }, [viewer]);
  return (
    <Menu mode="horizontal" selectable={false} className="menu">
      <Item key="/host">
        <Link to="/host">
          <Icon type="home" />
          Host
        </Link>
      </Item>
      {subMenuLogin}
    </Menu>
  );
};
