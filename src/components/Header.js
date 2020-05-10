import React from "react";

export default function Header(props) {
  return <div>{props.user ? props.user.name : "Guest"}</div>;
}
