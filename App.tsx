import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';


export default function App() {
  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}

// import React from 'react';
// import { Text, View } from 'react-native';
// import * as SplashScreen from 'expo-splash-screen';
// import { useFonts, Rubik_400Regular, Rubik_500Medium } from '@expo-google-fonts/rubik';

// SplashScreen.preventAutoHideAsync(); // keep splash visible

// export default function App() {
//   const [fontsLoaded] = useFonts({
//     Rubik_400Regular,
//     Rubik_500Medium,
//   });

//   // useEffect(() => {
//   //   if (fontsLoaded) {
//   //     SplashScreen.hideAsync(); // hide splash when fonts are ready
//   //   }
//   // }, [fontsLoaded]);

//   if (!fontsLoaded) {
//     return null; // or <View><Text>Loading...</Text></View>
//   }

//   return (
//     <View>
//       <Text style={{ fontFamily: 'Rubik_400Regular', fontSize: 18 }}>
//         This is Rubik!
//       </Text>
//     </View>
//   );
// }
