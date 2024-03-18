import { CircleUserRound } from "lucide-react";
import React from "react";

const UserAvatar: React.FC<{ user: { name: string; avatarUrl?: string }, asLink?: boolean } & React.ComponentPropsWithoutRef<any>> = ({ user, asLink = true, ...props }) => {
  // TODO hardcoding as icon for now
  const content = (
    <>
      <CircleUserRound className="w-6 h-6" />
      <span>{user.name}</span>
    </>
  );
  return (asLink
    ? (<a href="" className="flex flex-row gap-2 items-center" {...props}>{content}</a>)
    : (<div className="flex flex-row gap-2 items-center text-sm" {...props}>{content}</div>)
  );
};

export default UserAvatar;