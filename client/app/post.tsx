import React, { useState } from "react";
import { Text } from "react-native";

export default function PostPage(){
    const [didCook, setDidCook] = useState(true);
    const username = "JohnDoe";
    return <>
        <Text>I {didCook ? "Cooked" : "Ate"}</Text>
        {/*
        text input/select for food type
        text input for optional description
        take image button
        */}
    </>
}