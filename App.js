import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProductsList } from "./screens/ProductsList.js";
import { ProductDetails } from "./screens/ProductDetails.js";
import { Cart } from "./screens/Cart.js";
import { CartProvider } from "./CartContext.js";
import { CartIcon } from "./components/CartIcon.js";

import AsyncStorage from "@react-native-async-storage/async-storage";
import RegistrationScreen from "./screens/RegistrationScreen.js";
import LoginScreen from "./screens/LoginScreen.js";
import Loader from "./components/Loader.js";
import Payment from "./screens/Payment.js";

const Stack = createNativeStackNavigator();

const App = () => {
  const [initialRouteName, setInitialRouteName] = React.useState("");

  React.useEffect(() => {
    setTimeout(() => {
      authUser();
    }, 1000);
  }, []);

  const authUser = async () => {
    try {
      let userData = await AsyncStorage.getItem("userData");
      if (userData) {
        userData = JSON.parse(userData);
        if (userData.loggedIn) {
          setInitialRouteName("Products");
        } else {
          setInitialRouteName("LoginScreen");
        }
      } else {
        setInitialRouteName("RegistrationScreen");
      }
    } catch (error) {
      setInitialRouteName("RegistrationScreen");
    }
  };

  return (
    <CartProvider>
      <NavigationContainer>
        {!initialRouteName ? (
          <Loader visible={true} />
        ) : (
          <>
            <Stack.Navigator
              initialRouteName={initialRouteName}
              screenOptions={{ headerShown: true }}
            >
              <Stack.Screen name="LoginScreen" component={LoginScreen} />
              <Stack.Screen
                name="RegistrationScreen"
                component={RegistrationScreen}
              />
              <Stack.Screen
                name="Products"
                component={ProductsList}
                options={({ navigation }) => ({
                  title: "Products",
                  headerRight: () => <CartIcon navigation={navigation} />,
                })}
              />
              <Stack.Screen
                name="ProductDetails"
                component={ProductDetails}
                options={({ navigation }) => ({
                  title: "Products",
                  headerRight: () => <CartIcon navigation={navigation} />,
                })}
              />
              <Stack.Screen
                name="Cart"
                component={Cart}
                options={({ navigation }) => ({
                  title: "Products",
                  headerRight: () => <CartIcon navigation={navigation} />,
                })}
              />
              <Stack.Screen name="Payment" component={Payment} />
            </Stack.Navigator>
          </>
        )}
      </NavigationContainer>
    </CartProvider>
  );
};

const styles = StyleSheet.create({
  Container: {
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default App;
