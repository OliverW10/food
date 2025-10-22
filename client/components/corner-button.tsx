import { Pressable } from "react-native";

export default function CornerButton({
  children,
  onPress,
  isTop,
  isLeft = false,
}: {
  children: React.ReactNode;
  onPress: () => void;
  isTop: boolean;
  isLeft?: boolean;
}) {
  return (
    <Pressable
      className={`${isTop ? "top-4" : "bottom-4"} ${
        isLeft ? "left-4" : "absolute right-8"
      } p-2 bg-red text-white rounded-full shadow-md`}
      style={({ pressed, hovered }) => [
        {
          backgroundColor: hovered ? "rgb(210, 230, 255)" : "white",
        },
      ]}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
}
