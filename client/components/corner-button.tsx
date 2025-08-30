import { Pressable, StyleSheet } from "react-native";


export default function CornerButton({ children, onPress, isTop }: {children: React.ReactNode, onPress: () => void, isTop: boolean}
) {
    return (
    <Pressable className={`absolute right-4 ${isTop ? "top-4" : "bottom-4"} p-2 bg-primary-500 text-white rounded-full shadow-md`}
        style={({pressed}) => [
            {
              backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
            },
          ]}
        onPress={onPress}
    >
        {children}
    </Pressable>)
}

const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   text: {
//     fontSize: 16,
//   },
//   wrapperCustom: {
//     borderRadius: 8,
//     padding: 6,
//   },
//   logBox: {
//     padding: 20,
//     margin: 10,
//     borderWidth: StyleSheet.hairlineWidth,
//     borderColor: '#f0f0f0',
//     backgroundColor: '#f9f9f9',
//   },
});