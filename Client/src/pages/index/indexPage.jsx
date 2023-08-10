import { useContext, useState } from "react";
// import Header from "../Header";
import { UserContext } from "../../UserContext";

export default function IndexPage() {
    const { setUser, user } = useContext(UserContext);
    if (user) {
        // console.log(user);
    }

    return (
        <div>
            Index Page
        </div>
    )
}